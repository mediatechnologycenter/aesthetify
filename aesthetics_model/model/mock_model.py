# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import logging
from time import sleep
from typing import List
from PIL import Image

from aesthetics_model.model.model import AestheticModel
from aesthetics_model.api_types import ModelResponse

log = logging.Logger("MockModel-Logger")

INFERENCE_DELAY_SECONDS = 1

class MockModel(AestheticModel):
   
    def init_model(self):
        pass

    def is_ready(self) -> bool:
        return True

    def inference(self, images: List[Image.Image]) -> List[ModelResponse]:
        sleep(INFERENCE_DELAY_SECONDS)
        for image in images:
            log.info(f"Processed image: {image.info}")

        return [ModelResponse(aesthetic_score=0.0, aesthetic_embedding=[0.0], success=True)]
