# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import os
from http import HTTPStatus
from typing import List, Optional

from fastapi import HTTPException
from tinydb import TinyDB, Query, where

from api_backend.api_types import ImageProcessed, QueryParameters


class AestheticsDbClient:
    db_filepath: str
    db: TinyDB

    def __init__(self, db_filepath: str = "/tmp/tinyDB/aesthetics.json"):
        os.makedirs(
            name=os.path.dirname(db_filepath),
            exist_ok=True,
        )

        self.db_filepath = db_filepath
        self.db = TinyDB(db_filepath)

    def list_images(self, user_id: str, parameters: Optional[QueryParameters]) -> List[ImageProcessed]:

        # If cache size is not 0, calling from new instances of db clients return old results.
        user_table = self.db.table(user_id, cache_size=0)

        # # TODO: Ideally, this is the way I'd like to query the db. However, there´s no support for more complex queries
        # # such as query different parameters AND get documents if any element of a list is queried AND 
        # # query parameters of a field of a document, everything at the same time

        # fragment = {} if not parameters else parameters
        # docs = user_table.search(Query().fragment(fragment))

        def test_number_of_faces(val, number_of_faces):
            # TODO Hardcoded maximum number of faces
            if number_of_faces and number_of_faces < 3:
                return val == number_of_faces
            elif number_of_faces and number_of_faces == 3:
                return val >= number_of_faces
            else:
                return True

        image = Query()

        # TODO: Multiple queries. I don't know if I like this.
        docs = user_table.search(
            (image.colors.any([parameters.color]) if parameters.color else image.colors.exists()) &
            # This selects all the images with any of the emotions in the parameters.emotions list
            (image.emotion.emotions.any(parameters.emotions) if parameters.emotions else image.emotion.emotions.exists()) &
            (image.emotion.number_of_faces.test(test_number_of_faces, parameters.number_of_faces)) &
            (image.orientation == parameters.orientation if parameters.orientation else image.orientation.exists()) &
            (image.shot_scale.shot_scale == parameters.shot_scale if parameters.shot_scale else image.shot_scale.shot_scale.exists())
        )

        return [ImageProcessed.parse_obj(doc) for doc in docs]

    def images_count(self, user_id: str) -> int:
        return self.db.table(user_id).__len__()

    def get_image(self, image_id: str, user_id: str) -> ImageProcessed:
        user_table = self.db.table(user_id)
        result = user_table.search(where('image_id') == image_id)
        if result:
            return ImageProcessed.parse_obj(result[0])
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=f"Image with id: {image_id} does not exist for the user {user_id}")

    def image_exists_by_name(self, image_name: str, user_id: str) -> bool:
        user_table = self.db.table(user_id)
        result = user_table.search(where('image_name') == image_name)
        return bool(result)

    def insert_image(self, image_metadata: ImageProcessed) -> ImageProcessed:
        user_table = self.db.table(image_metadata.user_id)
        user_table.insert(document=image_metadata.json_dict)

        return image_metadata

    def upsert_image(self, image_metadata: ImageProcessed) -> ImageProcessed:
        user_table = self.db.table(image_metadata.user_id)
        # Update doc if exists, else insert it
        user_table.upsert(
            document=image_metadata.json_dict,
            cond=Query().image_id == image_metadata.image_id,
        )

        return image_metadata

    def delete_image(self, image_id: str, user_id: str) -> None:
        user_table = self.db.table(user_id)
        user_table.remove(Query().image_id == image_id)

    def delete_user_table(self, user_id: str) -> None:
        self.db.drop_table(user_id)
