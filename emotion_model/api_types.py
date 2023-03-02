# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from typing import List, Union
from mtc_api_utils.api_types import ApiType
from pydantic import Field

class ModelResponse(ApiType):
    success: bool = Field(description="Whether the model response was successful", default=False)

class EmotionModelResponse(ModelResponse):
    emotions: list = Field(description="Predicted emotions with maximum probability for each of the faces.")
    number_of_faces: int = Field(description="Predicted number of faces.")
    emotions_metadata: list = Field(description="Additional metadata such us faces bounding boxes and emotions probabilities.")

