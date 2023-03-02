# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import os
from typing import List

import torch
from PIL import Image
from fastapi import HTTPException
from mtc_api_utils.base_model import MLBaseModel
from torchvision import transforms
from huggingface_hub import hf_hub_download
from aesthetics_model.api_types import AestheticsModelResponse
from aesthetics_model.config import AestheticsModelConfig
from aesthetics_model.model.vision_transformer import vit_large_patch16_224_in21k


class AestheticModel(MLBaseModel):
    model = None
    transform = None
    device = None
    model_checkpoint_path = None

    def init_model(self):
        print("Initializing Aesthetic Model...")
        # Download image archive
        self.model_checkpoint_path = hf_hub_download(
            repo_id=AestheticsModelConfig.repo_id,
            filename=AestheticsModelConfig.filename,
            cache_dir=AestheticsModelConfig.model_checkpoint_path
            )
        print("Model downloaded, loading to device..")

        self.model, self.transform, self.device = self.load_model()
        print("Model initialized")

    def is_ready(self):
        return self.model is not None

    def inference(self, images: List[Image.Image]) -> List[AestheticsModelResponse]:
        if not self.is_ready():
            raise HTTPException(status_code=503, detail="Model is not ready")

        results = []
        for image in images:
            im = self.validate_and_resize_image(image, max_size=AestheticsModelConfig.max_image_size)
            image_tensor = self.transform(im).unsqueeze(0).to(self.device)
            with torch.no_grad():
                image_embedding = self.model.forward_features(image_tensor)
                score = self.model.head(image_embedding).squeeze().to("cpu")
            result: AestheticsModelResponse = AestheticsModelResponse(
                aesthetics_score=float(score),
                aesthetics_embedding=image_embedding.to("cpu").tolist(),
                # TODO: success is going to be always true
                success=True
            )
            results.append(result)
        return results

    def load_model(self):
        # Check if a gpu and cuda is available
        use_cuda = torch.cuda.is_available()
        device = torch.device("cuda:0" if use_cuda else "cpu")
        print(f"Running on {device}")

        model = vit_large_patch16_224_in21k()
        model.reset_classifier(num_classes=1)
        model.load_state_dict(torch.load(self.model_checkpoint_path, map_location=device))

        model.eval()
        model.to(device)

        transform = transforms.Compose(
            [transforms.ToTensor(), transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])]
        )

        return model, transform, device

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


if __name__ == '__main__':
    model = AestheticModel()
    model.__wait_until_ready__()

    example_images = ["../tests/test_image.png"]  # model.get_examples()

    # Perform inference with underlying model
    images = [model.model(Image.open(image)) for image in example_images]

    model_result = model.inference(images=images)
    print(model_result)
