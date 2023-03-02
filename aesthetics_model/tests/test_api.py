# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from unittest import TestCase
from PIL import Image
from fastapi import HTTPException
from aesthetics_model.model.model import AestheticModel
from aesthetics_model.api_types import ModelResponse
from time import sleep

test_image_path = "inference_backend/tests/test_image.png"

class TestModel(TestCase):
    model: AestheticModel

    def setUp(self) -> None:
        self.model = AestheticModel()
        # This is probably not the proper way of doing this, check out: https://fastapi.tiangolo.com/advanced/async-tests/
        while not self.model.is_ready():
            sleep(1)

    def test_inference(self):
        image = Image.open(test_image_path)
        results = self.model.inference(images=[image])
        self.assertEqual(len(results), 1)
        self.assertTrue(results[0].success)
        self.assertAlmostEqual(results[0].aesthetic_score, 5)
        self.assertEqual(len(results[0].aesthetic_embedding[0]),1024)

