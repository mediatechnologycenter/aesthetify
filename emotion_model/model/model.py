# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

# https://github.com/phamquiluan/ResidualMaskingNetwork

from typing import List

import numpy as np
from PIL import Image
from fastapi import HTTPException
from mtc_api_utils.base_model import MLBaseModel

from emotion_model.api_types import EmotionModelResponse


class EmotionModel(MLBaseModel):
    model = None
    transform = None
    device = None
    model_checkpoint_path = None

    def init_model(self):
        # TODO: This import from a 3rd party library downloads the checkpoints... We would need to fork the library to fix this
        from rmn import RMN
        # Download image archive
        self.model = RMN()
        print("Model initialized")

    def is_ready(self):
        return self.model is not None

    def inference(self, images: List[Image.Image]) -> List[EmotionModelResponse]:
        if not self.is_ready():
            raise HTTPException(status_code=503, detail="Model is not ready")

        results = []
        for image in images:
            im = self.validate_image(image)

            # The emotion classifier expects cv2 format
            open_cv_image = np.array(im)
            # Convert RGB to BGR 
            open_cv_image = open_cv_image[:, :, ::-1].copy()

            emotions_metadata = self.model.detect_emotion_for_single_frame(open_cv_image)
            predicted_emotions = [face["emo_label"] for face in emotions_metadata]

            result: EmotionModelResponse = EmotionModelResponse(
                emotions=predicted_emotions,
                number_of_faces=len(predicted_emotions),
                emotions_metadata=emotions_metadata,
                success=True
            )
            results.append(result)

        return results

    def validate_image(self, image: Image.Image):
        """Transform to RGB if B&W image.

        Args:
            img : PIL Image
            max_size : int
        """
        if not image.mode == "RGB":
            image = image.convert(mode="RGB")
        return image
