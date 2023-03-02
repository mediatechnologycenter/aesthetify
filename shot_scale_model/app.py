# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import io
import logging
from enum import Enum
from http import HTTPStatus
from typing import List

from PIL import Image
from fastapi import UploadFile
from mtc_api_utils.api import BaseApi

from shot_scale_model.api_types import ShotScaleModelResponse
from shot_scale_model.config import ShotScaleModelConfig
from shot_scale_model.model.model import ShotScaleModel

ShotScaleModelConfig.print_config()
log = logging.Logger("App-Logger")

model = ShotScaleModel()

app = BaseApi(is_ready=model.is_ready, config=ShotScaleModelConfig)
model_route_tag = "Model Routes"


class Route(Enum):
    value: str

    inference = "/api/inference"


@app.post(
    path=Route.inference.value,
    status_code=HTTPStatus.ACCEPTED,
    response_model=List[ShotScaleModelResponse],
    tags=[model_route_tag],
)
async def inference(images: List[UploadFile]) -> List[ShotScaleModelResponse]:
    images_in_memory = [Image.open(io.BytesIO(await image.read())) for image in images]
    results = model.inference(images=images_in_memory)

    print(f"Processing images: {[image.filename for image in images]} completed successfully")
    return results


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=6000)
