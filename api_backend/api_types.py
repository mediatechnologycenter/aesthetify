# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from enum import Enum
from typing import Optional

from fastapi import UploadFile
from mtc_api_utils.api_types import ApiType
from pydantic import Field


class ModelName(Enum):
    value: str

    aesthetics = "aesthetics"
    emotion = "emotion"
    shot_scale = "shot_scale"


class ImageSize(Enum):
    value: str

    thumbnail = "thumbnail"
    original = "original"


class ModelResponse(ApiType):
    success: bool = Field(description="Whether the model response was successful", default=False)


class AestheticsModelResponse(ModelResponse):
    aesthetics_score: float = Field(description="Predicted aesthetics score", example=5.0)
    aesthetics_embedding: list = Field(description="Embedding extracted from the last layer of the backbone.")


class EmotionModelResponse(ModelResponse):
    emotions: list = Field(description="Predicted emotions with maximum probability for each of the faces.")
    number_of_faces: int = Field(description="Predicted number of faces.")
    emotions_metadata: list = Field(description="Additional metadata such us faces bounding boxes and emotions probabilities.")


class ShotScaleModelResponse(ModelResponse):
    shot_scale: str = Field(description="Predicted shot scale with maximum probability.")
    shot_scale_probs: dict = Field(description="Predicted shotscale")


class QueryParameters(ApiType):
    emotions: Optional[list[str]]
    number_of_faces: Optional[int]
    shot_scale: Optional[str]
    orientation: Optional[str]
    color: Optional[str]
    cluster: Optional[str]
    favorite: Optional[bool]


# Media Routes Models

class ImageBaseApi(ApiType):
    image_id: str
    image_name: str
    file_url: str
    user_id: str


class ImageNotProcessed(ImageBaseApi):
    image_to_predict: Optional[UploadFile] = Field(alias="imageToPredict", default=None)


class ImageProcessed(ImageBaseApi):
    aesthetics: AestheticsModelResponse
    emotion: EmotionModelResponse
    shot_scale: ShotScaleModelResponse
    image_size: tuple
    thumbnail_size: tuple
    orientation: str
    colors: list[str]
    favorite: bool = Field(description="Whether the image was selected as favorite", default=False)


class LegacyImageProcessed(ImageProcessed):
    width: int
    height: int


class QueueStatistics(ApiType):
    total_queue_size: int
    user_queue_size: int
    count_user_images: int