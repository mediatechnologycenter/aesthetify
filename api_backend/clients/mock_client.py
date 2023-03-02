# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import logging
import random
from time import sleep

from api_backend.api_types import ModelResponse
from api_backend.clients.client import ModelClient

log = logging.Logger("MockClient-Logger")

INFERENCE_DELAY_SECONDS = 1
MOCK_RESULTS = ["Buenos dias princeso", "A quien no le va a gustar un baptisterio romano del siglo primero", "Sin ser nada de eso yo"]


class MockClient(ModelClient):

    def is_ready(self) -> bool:
        return True

    def inference(self, image_path: str) -> ModelResponse:
        sleep(INFERENCE_DELAY_SECONDS)
        log.info(f"Processed image: {image_path}")

        return ModelResponse(text=random.choice(MOCK_RESULTS), success=True)
