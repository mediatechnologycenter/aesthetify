# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import os
from enum import Enum
from http import HTTPStatus

from fastapi import APIRouter, UploadFile, Query, Depends
from fastapi.responses import FileResponse
from mtc_api_utils.api_types import FirebaseUser
from mtc_api_utils.clients.firebase_client import firebase_user_auth

from api_backend.api_types import LegacyImageProcessed, QueryParameters
from api_backend.config import AestheticsConfig
from api_backend.db_client import AestheticsDbClient

db_client = AestheticsDbClient(db_filepath=AestheticsConfig.db_path)

user_auth = firebase_user_auth(config=AestheticsConfig)

legacy_route_tag = "Legacy Routes"
legacy_router = APIRouter(tags=[legacy_route_tag])


class Route(Enum):
    value: str

    image = "/api/image"
    queryEngine = "/api/queryEngine"
    image_server = "/api/image-server/image"


@legacy_router.post(
    path=Route.image.value,
    status_code=HTTPStatus.ACCEPTED,
    tags=[legacy_route_tag],
)
async def upload_image(
        file: UploadFile,
        user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles)),
) -> None:
    from api_backend.app import inference
    image_id = await inference(image=file, user=user)


@legacy_router.get(
    path=Route.image_server.value,
    response_model=UploadFile,
    tags=[legacy_route_tag],
)
async def serve_image(
        userId: str,
        image_id: str,
        size: str = Query(default="thumbnail"),
        # TODO: Disabled user authentication for this
        # user: FirebaseUser = Depends(user_auth),
) -> FileResponse:
    image_entry = db_client.get_image(image_id=image_id, user_id=str(userId))
    image_path = os.path.join(AestheticsConfig.files_dir, image_entry.user_id, size, image_entry.image_name)
    return FileResponse(image_path)


@legacy_router.get(
    path=Route.queryEngine.value,
    response_model=dict,
    tags=[legacy_route_tag],
)
async def serve_images(
        # aestMin: int = Query(default=None),
        # aestMax: int = Query(default=None),
        # sortBy= Query(default=None),
        # sortDirection: int = Query(default=None),
        sorted_by_aesthetics: bool = Query(default=False, alias="sortedByAesthetics"),
        emotions: list = Query(default=None, alias="emotions"),
        number_of_faces: int = Query(default=None, alias="numberOfPeople"),
        # userId: str = Query(default=None),
        image_orientation: str = Query(default=None, alias="imageOrientation"),
        color: str = Query(default=None),
        clustering: bool = Query(default=None),
        shot_scale: str = Query(default=None, alias="shotScale"),
        # favorite: bool = Query(default=None),
        user: FirebaseUser = Depends(user_auth.with_roles(AestheticsConfig.required_roles)),
) -> dict:
    from api_backend.app import get_selectable_colors
    colors = get_selectable_colors(user=user)

    parameters = QueryParameters(
        emotions=emotions,
        number_of_faces=number_of_faces,
        shot_scale=shot_scale,
        orientation=image_orientation,
        color=color,
        # TODO: Implement clustering
        cluster=None,
        # TODO: Implement favorite image selection
        favorite=None
    )

    # print("Received parameters: ", parameters, " Aesthetic score: ", sorted_by_aesthetics)

    images = db_client.list_images(user_id=str(user.email), parameters=parameters)

    # Sort images by aesthetic score if needed
    if sorted_by_aesthetics:
        images.sort(reverse=True, key=lambda x: x.aesthetics.aesthetics_score)

    legacy_images = []
    for image in images:
        width, height = image.image_size
        processed_image = image.json_dict
        processed_image["width"] = width
        processed_image["height"] = height
        legacy_images.append(LegacyImageProcessed(**processed_image))

    return {
        "data": legacy_images,
        "queryLimits": {"selectableColors": await colors},
        "clusteredData": [],
    }
