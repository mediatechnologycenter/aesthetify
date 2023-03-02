# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import asyncio
from asyncio import Task


class BackendReadiness:
    models_were_ready = False
    _worker_task = Task[bool]

    def __init__(self, model_clients):
        self.clients = model_clients

    async def start(self):
        self._worker_task = asyncio.create_task(self.await_model_readiness(), name="Await Model Readiness")

    async def models_are_ready(self) -> bool:
        results = await asyncio.gather(*[client.is_ready() for client in self.clients.values()])
        return all(results)

    async def await_model_readiness(self) -> bool:
        while not self.models_were_ready:
            try:
                if await self.models_are_ready():
                    print(f"All models are ready 🚀")
                    self.models_were_ready = True

            except Exception as e:
                # This is required as otherwise, the exception gets lost in the async execution
                print(e)

        return True

    async def is_ready(self):
        # if not self.models_were_ready and await self.models_are_ready():
        #     # This is run the first time all models are ready
        #     print(f"All models are ready 🚀")
        #     self.models_were_ready = True

        return self.models_were_ready
