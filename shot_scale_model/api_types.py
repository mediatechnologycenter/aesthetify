# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from typing import List, Union
from mtc_api_utils.api_types import ApiType
from pydantic import Field

class ModelResponse(ApiType):
    success: bool = Field(description="Whether the model response was successful", default=False)

class ShotScaleModelResponse(ModelResponse):
    shot_scale : str = Field(description="Predicted shot scale with maximum probability.")
    shot_scale_probs: dict = Field(description="Predicted shotscale")

