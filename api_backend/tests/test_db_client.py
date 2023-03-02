# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from unittest import IsolatedAsyncioTestCase

from fastapi import HTTPException

from api_backend.api_types import ImageProcessed
from api_backend.db_client import AestheticsDbClient

TEST_DB_DIR = "/tmp/test-dbs/aesthetics.json"

TEST_METADATA = ImageProcessed(
    image_id="test-id",
    image_name="test-name",
    metadata={
                'name':'Test Image',
                'size': 'HD'
            },
    thumbnail_url="/test/thumbnail/url",
    original_url="/test/image/url",
    user_id="paco"
)

TEST_METADATA_2 = ImageProcessed(
    image_id="test-id-2",
    image_name="test-name-2",
    metadata={
                'name':'Test Image 2',
                'size': 'SD'
            },
    thumbnail_url="/test-2/thumbnail/url",
    original_url="/test-2/image/url",
    user_id="pepe"
)


class TestDbClient(IsolatedAsyncioTestCase):
    client: AestheticsDbClient

    def setUp(self) -> None:
        self.client = AestheticsDbClient(db_filepath=TEST_DB_DIR)
        self.client.db.drop_tables()

    def test_db_client(self):
        self.assertEqual(0, len(self.client.list_images(user_id="pepe")))

        self.client.insert_image(image_metadata=TEST_METADATA)
        self.assertEqual(1, len(self.client.list_images(user_id="paco")))
        self.assertEqual(TEST_METADATA, self.client.get_image(TEST_METADATA.image_id, user_id="paco"))

        self.client.insert_image(image_metadata=TEST_METADATA_2)
        self.assertEqual(1, len(self.client.list_images(user_id="pepe")))
        self.assertEqual(TEST_METADATA_2, self.client.get_image(TEST_METADATA_2.image_id, user_id="pepe"))

        self.client.delete_image(TEST_METADATA_2.image_id, user_id="pepe")
        self.assertEqual(0, len(self.client.list_images(user_id="pepe")))
        self.assertEqual(TEST_METADATA, self.client.get_image(TEST_METADATA.image_id, user_id="paco"))
        with self.assertRaises(HTTPException):
            self.client.get_image(TEST_METADATA.image_id, user_id="pepe")
