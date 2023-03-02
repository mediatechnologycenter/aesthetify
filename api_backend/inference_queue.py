# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import asyncio
import os
from pathlib import Path
from asyncio import Task, Queue
from typing import List
from uuid import uuid4

from api_backend.api_types import ImageNotProcessed, ImageProcessed, ModelName, QueryParameters
from api_backend.clients.client import ModelClient
from api_backend.config import AestheticsConfig
from api_backend.db_client import AestheticsDbClient
from api_backend.image_utils import save_image_to_disk, get_image_metadata


class InferenceQueue:
    queue: Queue[ImageNotProcessed] = Queue()

    worker_sleep_seconds = 1
    _worker_task: Task[None]

    def __init__(self, inference_models: dict[ModelName, ModelClient], db_client: AestheticsDbClient, image_dir: str = AestheticsConfig.files_dir):
        self.model_clients = inference_models
        self.image_dir = image_dir
        self.db_client = db_client

        os.makedirs(self.image_dir, exist_ok=True)

    async def start(self):
        self._worker_task = asyncio.create_task(self._worker(), name="Inference Queue Worker")
        for task in self._recover_unfinished_tasks():
            await self.queue.put(task)

    async def add_task(self, task: ImageNotProcessed) -> None:
        success = await save_image_to_disk(task=task, image_dir=self.image_dir)
        # Queue inference task
        if success:
            await self.queue.put(task)
            print(f"Task added: {self.queue.qsize()=}")

    async def _worker(self):
        print(f"Worker ready, awaiting task.. {self.queue.qsize()=}")

        while True:
            task = await self.queue.get()
            print(f"Processing task {task.json_dict=}, {self.queue.qsize()=}")
            try:
                image_path = os.path.join(self.image_dir, task.user_id, "original", task.image_name)

                requests = [client.inference(image_path=image_path) for client in self.model_clients.values()]
                results = await asyncio.gather(*requests)

                processed = ImageProcessed(
                    aesthetics=results[0],
                    emotion=results[1],
                    shot_scale=results[2],
                    **task.json_dict,
                    **get_image_metadata(image_path=image_path)
                )

                self.db_client.insert_image(image_metadata=processed)

                print(f"Image has been successfully processed. \n{task.image_name=} \nNew {self.queue.qsize()=}")

            except Exception as e:
                # This is required as otherwise, the exception gets lost in the async execution
                print(f"The following error occurred when processing {task.image_name=}:")
                print(e)
                print(f"Putting {task.image_name=} back in queue")
                await self.queue.put(task)

            finally:
                self.queue.task_done()

    def _recover_unfinished_tasks(self) -> List[ImageNotProcessed]:
        from api_backend.app import Route # To avoid circular imports

        im_dir_path = Path(self.image_dir)
        users_paths = [user_path for user_path in im_dir_path.glob("*")]
        print(f"Found {len(users_paths)} users")
        print(users_paths)

        remaining_images = []
        for user_path in users_paths:
            user_id = user_path.name
            images_in_disk = [im_path.name for im_path in user_path.glob("original/*")]
            print(f"Found {len(images_in_disk)=} for user {user_id}")
            images_in_db = [image.image_name for image in self.db_client.list_images(user_id=user_id, parameters=QueryParameters())] 
            print(f"Found {len(images_in_db)=} for user {user_id}")

            not_processed_images = [image for image in images_in_disk if image not in images_in_db]
            print(f"Found {len(not_processed_images)=} for user {user_id}")

            # Put the not processed images back to the queue
            for image_name in not_processed_images:
                image_id = str(uuid4())
                remaining_images.append(ImageNotProcessed(
                        image_id=image_id,
                        image_name=image_name,
                        image_to_predict=None, #Image is already in disk
                        file_url=Route.file_url(image_id=image_id),
                        user_id=user_id
                    ))
        return remaining_images