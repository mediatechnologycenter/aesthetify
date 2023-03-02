# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from __future__ import annotations

import logging
from abc import ABC
from http import HTTPStatus
from typing import Union

import httpx
from fastapi import HTTPException
from httpx import Timeout, AsyncClient

from api_backend.api_types import AestheticsModelResponse, EmotionModelResponse, ShotScaleModelResponse, ModelName
from api_backend.config import AestheticsConfig

log = logging.Logger("Client-Logger")

class BaseClient(ABC):
    async_client: httpx.AsyncClient

    def __init__(self) -> None:
        self.async_client = httpx.AsyncClient()

class ModelClient(BaseClient):
    name: ModelName
    model_url: str
    http_client: AsyncClient

    def __init__(self, model_url: str, name: ModelName, http_client=AsyncClient()):
        self.name = name
        self.model_url = model_url
        self.http_client = http_client

    async def is_ready(self) -> bool:
        try:
            resp = await self.http_client.get(f"{self.model_url}/api/readiness")
            log.debug(f"Is {self.model_url} ready? {resp}")
        except (httpx.ReadTimeout, httpx.ConnectTimeout):
            return False

        if resp.status_code not in [HTTPStatus.OK, HTTPStatus.SERVICE_UNAVAILABLE]:
            print(f"Connection failed: {resp.request.url=}, {resp.status_code=}")

        return True if resp.status_code == HTTPStatus.OK else False

    async def inference(self, image_path: str) -> Union[AestheticsModelResponse, EmotionModelResponse, ShotScaleModelResponse]:
        # TODO maybe replace with list of FileResponses
        files = [('images', (image_path, open(image_path, 'rb')))]

        # Inference endpoints expects a list of images
        try:
            resp = await self.http_client.post(url=f"{self.model_url}/api/inference", files=files, timeout=Timeout(300))  # Set timeout to 5min
        except (httpx.ReadTimeout, httpx.ConnectTimeout) as err:
            print(f"The following error occurred when posting inference request to {err.request.url}: ")
            raise err

        if not resp.status_code == httpx.codes.ACCEPTED:
            raise HTTPException(status_code=httpx.codes.INTERNAL_SERVER_ERROR, detail=f"Inference failed from model {self.model_url}")

        result = resp.json()[0]
        log.debug(f"{self.model_url} inference results: {resp.json()}")

        return self._get_model_response_model(result)

    # TODO: There's probably a better way of doing this
    def _get_model_response_model(self, result: dict) -> Union[AestheticsModelResponse, EmotionModelResponse, ShotScaleModelResponse]:
        if self.name == ModelName.aesthetics:
            return AestheticsModelResponse(**result)
        elif self.name == ModelName.emotion:
            return EmotionModelResponse(**result)
        elif self.name == ModelName.shot_scale:
            return ShotScaleModelResponse(**result)
        else:
            raise ValueError

    @staticmethod
    def get_client(model_name: ModelName, url: str) -> ModelClient:
        from api_backend.clients.mock_client import MockClient

        return MockClient(name=model_name, model_url=url) if AestheticsConfig.mockBackend else ModelClient(name=model_name, model_url=url)
