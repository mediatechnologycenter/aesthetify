# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

# https://github.com/phamquiluan/ResidualMaskingNetwork

import os
from typing import List

import torch
from PIL import Image
from fastapi import HTTPException
from mtc_api_utils.base_model import MLBaseModel
from torchvision import transforms
from huggingface_hub import hf_hub_download
from shot_scale_model.api_types import ShotScaleModelResponse
from shot_scale_model.config import ShotScaleModelConfig
from shot_scale_model.model.resnet_encoder import ResnetEncoder

SHOT_SCALE = {
    0: "Extreme Close-up Shot",
    1: "Close-up Shot",
    2: "Medium Shot",
    3: "Full Shot",
    4: "Long Shot",
}


class ShotScaleModel(MLBaseModel):
    model = None
    transform = None
    device = None
    model_checkpoint_path = None

    def init_model(self):
        # Download image archive
        self.model_checkpoint_path = hf_hub_download(
            repo_id=ShotScaleModelConfig.repo_id,
            filename=ShotScaleModelConfig.filename,
            cache_dir=ShotScaleModelConfig.model_checkpoint_path
            )
        
        print("Model downloaded, loading to device..")

        self.model, self.device = self.load_model()
        print("Model initialized")

    def is_ready(self):
        return self.model is not None

    def inference(self, images: List[Image.Image]) -> List[ShotScaleModelResponse]:
        if not self.is_ready():
            raise HTTPException(status_code=503, detail="Model is not ready")

        results = []
        for image in images:
            # TODO: Not sure whther the model was trained with a specific image size (700)
            im = self.validate_and_resize_image(image, max_size=ShotScaleModelConfig.max_image_size)
            image_tensor = transforms.ToTensor()(im).unsqueeze(0).to(self.device)
            with torch.no_grad():
                output = self.model(image_tensor)
                probabilities = torch.softmax(output, 1).to("cpu").tolist()[0]

            # print("shot scale probabilities", probabilities)
            # get probability for each shot scale
            shot_scale_probs = {shot_scale_name: probabilities[idx] for idx, shot_scale_name in SHOT_SCALE.items()}
            shot_scale = SHOT_SCALE[probabilities.index(max(probabilities))]

            result: ShotScaleModelResponse = ShotScaleModelResponse(shot_scale=shot_scale,
                                                                    shot_scale_probs=shot_scale_probs,
                                                                    success=True
                                                                    )
            results.append(result)
        return results

    def load_model(self):
        # Check if a gpu and cuda is available
        use_cuda = torch.cuda.is_available()
        device = torch.device("cuda:0" if use_cuda else "cpu")
        print(f"Running on {device}")

        model = ResnetEncoder(50, pretrained=False)

        # TODO: This 2 steps load process is because the pretrained model is inside a hardcoded variable `net` in the .pt file
        state = torch.load(self.model_checkpoint_path, map_location=device)
        model.load_state_dict(state.get("net"))  # , strict=False)

        model.eval()
        model.to(device)

        return model, device

    def validate_and_resize_image(self, image: Image.Image, max_size: int):
        """Check if an image is to big, if it is too big resize it. Transform to RGB if B&W image.

        Args:
            img : PIL Image
            max_size : int
        """
        if not image.mode == "RGB":
            image = image.convert(mode="RGB")

        size_factor = (max_size + 0.0) / max(image.size)
        if size_factor < 1:
            new_h = round(image.size[0] * size_factor)
            new_w = round(image.size[1] * size_factor)
            image = image.resize((new_w, new_h), resample=Image.HAMMING)
        return image
