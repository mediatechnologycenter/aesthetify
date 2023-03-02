# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from mtc_api_utils.api_types import ApiType
from pydantic import Field


class ModelResponse(ApiType):
    success: bool = Field(description="Whether the model response was successful", default=False)


class AestheticsModelResponse(ModelResponse):
    aesthetics_score: float = Field(description="Predicted aesthetics score", example=5.0)
    aesthetics_embedding: list = Field(description="Embedding extracted from the last layer of the backbone.")
