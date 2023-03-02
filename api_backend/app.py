# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import asyncio
import os
import pathlib
from enum import Enum
from http import HTTPStatus
from typing import List
from uuid import uuid4

from fastapi import Depends, HTTPException, UploadFile, Path, Query
from fastapi.responses import FileResponse
from mtc_api_utils.api import BaseApi
from mtc_api_utils.api_types import FirebaseUser
from mtc_api_utils.clients.firebase_client import firebase_user_auth

from api_backend.api_types import ImageProcessed, ModelName, ImageNotProcessed, QueryParameters, ImageSize, QueueStatistics
from api_backend.backend_readiness import BackendReadiness
from api_backend.clients.client import ModelClient
from api_backend.config import AestheticsConfig
from api_backend.db_client import AestheticsDbClient
from api_backend.image_utils import validate_image, delete_image_from_disk, reduce_colors, count_images_from_disk
from api_backend.inference_queue import InferenceQueue
from api_backend.legacy_routes import legacy_router

AestheticsConfig.print_config()
pathlib.Path(AestheticsConfig.files_dir).mkdir(parents=True, exist_ok=True)

user_auth = firebase_user_auth(config=AestheticsConfig)

db_client = AestheticsDbClient(db_filepath=AestheticsConfig.db_path)

models_urls = {
    ModelName.aesthetics: AestheticsConfig.aesthetics_client_url,
    ModelName.emotion: AestheticsConfig.emotion_client_url,
    ModelName.shot_scale: AestheticsConfig.shot_scale_client_url
}

clients = {
    model_name: ModelClient.get_client(model_name, url)
    for model_name, url in models_urls.items()
}

inference_queue = InferenceQueue(inference_models=clients, db_client=db_client)

backend_readiness = BackendReadiness(model_clients=clients)

app = BaseApi(is_ready=backend_readiness.is_ready, config=AestheticsConfig)
app.include_router(legacy_router)

model_route_tag = "Model Routes"


class Route(Enum):
    value: str

    image = "/api/image"
    list_images = f"{image}s"
    image_with_id = f"{image}/{{imageId}}"
    image_file = f"{image_with_id}/file"

    colors = "/api/filters/colors"
    inference = "/api/inference"
    queue = "/api/queue-size"

    @staticmethod
    def image_url(image_id: str = Path(alias="imageId")) -> str:
        return f"{Route.image.value}/{image_id}"

    @staticmethod
    def file_url(image_id: str = Path(alias="imageId")) -> str:
        return f"{Route.image.value}/file?image_id={image_id}&size=original"


@app.on_event("startup")
async def startup():
    await asyncio.gather(
        inference_queue.start(),
        backend_readiness.start(),
    )
    # await inference_queue.start()


@app.get(
    path=Route.list_images.value,
    response_model=List[ImageProcessed],
    tags=[model_route_tag],
)
async def list_images(
        emotion: str = Query(default=None, title="Predicted emotion in the image."),
        number_of_faces: int = Query(default=None, title="Predicted number of faces in the image"),
        shot_scale: str = Query(default=None, title="Predicted shot scale."),
        orientation: str = Query(default=None, title="Image orientation."),
        color: str = Query(default=None, title="Dominant color."),
        cluster: int = Query(default=None, title="Selected cluster ID"),
        favorite: bool = Query(default=None, title="Whether the images were starred by the user"),
        user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles)),
) -> List[ImageProcessed]:
    parameters = QueryParameters(
        emotion=emotion,
        number_of_faces=number_of_faces,
        shot_scale=shot_scale,
        orientation=orientation,
        color=color,
        cluster=cluster,
        favorite=favorite
    )

    return db_client.list_images(user_id=str(user.email), parameters=parameters)


@app.get(
    path=Route.image_with_id.value,
    response_model=ImageProcessed,
    tags=[model_route_tag],
)
async def get_image(
        image_id: str = Path(alias="imageId"),
        user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles)),
) -> ImageProcessed:
    print(f"Getting image metadata {image_id=}")
    return db_client.get_image(image_id=image_id, user_id=str(user.email))


@app.get(
    path=Route.image_file.value,
    response_model=UploadFile,
    tags=[model_route_tag],
)
async def get_image_file(
        image_id: str = Path(alias="imageId"),
        size: str = Query(default=ImageSize.thumbnail.value, title="`thumbnail` or `original`"),
        user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles)),
) -> FileResponse:
    print(f"Getting image {image_id=}")
    image_entry = db_client.get_image(image_id=image_id, user_id=str(user.email))
    image_path = os.path.join(AestheticsConfig.files_dir, image_entry.user_id, size, image_entry.image_name)
    return FileResponse(image_path)


@app.get(
    path=Route.colors.value,
    response_model=list,
    tags=[model_route_tag],
)
async def get_selectable_colors(user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles))) -> list:
    """
    Return the available color palette from the database as a list of strings representing the hexadecimal encoding of the main colors.
    """
    print(f"Getting color selection")
    images = await list_images(user=user, emotion=None, number_of_faces=None, shot_scale=None, orientation=None, color=None, cluster=None, favorite=None)
    total_colors = [color for image in images for color in image.colors]
    return reduce_colors(total_colors)

@app.get(
    path=Route.queue.value,
    response_model=QueueStatistics,
    tags=[model_route_tag],
)
async def get_queue_size(user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles))) -> QueueStatistics:
    """
    Return the number of images in processing queue.
    """
    elements_in_queue = inference_queue.queue.qsize()
    images_in_db = db_client.images_count(user_id=user.email)
    images_in_disk = count_images_from_disk(user_id=user.email, image_dir=AestheticsConfig.files_dir)
    # Images are saved in disk while they are being processed, and saved in db after being processed
    user_queue_size = images_in_disk - images_in_db
    queue_size = QueueStatistics(total_queue_size=max([elements_in_queue,user_queue_size]), user_queue_size=user_queue_size, count_user_images=images_in_db)
    print(f"{queue_size=}")
    return queue_size


@app.post(
    path=Route.inference.value,
    status_code=HTTPStatus.ACCEPTED,
    response_model=str,
    tags=[model_route_tag],
)
async def inference(image: UploadFile, user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles))) -> str:
    print(f"Adding image to queue: {image.filename=}")

    if db_client.image_exists_by_name(image_name=image.filename, user_id=user.email):
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail=str("Image already exist in the db."))

    if not validate_image(image=image):
        # TODO: Improve error message
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail=str("Image is not valid."))

    image_id = str(uuid4())

    await inference_queue.add_task(
        task=ImageNotProcessed(
            image_id=image_id,
            image_name=image.filename,
            image_to_predict=image,
            file_url=Route.file_url(image_id=image_id),
            user_id=user.email
        )
    )

    return image_id


@app.delete(
    path=Route.image_with_id.value,
    tags=[model_route_tag],
)
async def delete_image(image_id: str = Path(alias="imageId"), user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles))) -> None:
    print(f"Deleting {image_id=}")
    # TODO: Delete image from disk
    image = db_client.get_image(image_id=image_id, user_id=user.email)
    delete_image_from_disk(image_name=image.image_name, user_id=user.email, image_dir=AestheticsConfig.files_dir) 
    return db_client.delete_image(image_id=image_id, user_id=user.email)


@app.delete(
    path=Route.list_images.value,
    tags=[model_route_tag],
)
async def delete_user_images(user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles))) -> None:
    # TODO: Delete images from disk
    print(f"Deleting images of {user.email=}")
    images = db_client.list_images(user_id=str(user.email), parameters=QueryParameters())
    for image in images:
        delete_image_from_disk(image_name=image.image_name, user_id=user.email, image_dir=AestheticsConfig.files_dir) 
    return db_client.delete_user_table(user_id=str(user.email))


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
