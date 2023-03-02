# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from mtc_api_utils.config import Config


class ShotScaleModelConfig(Config):
    repo_id: str = Config.parse_env_var("REPO_ID", default="ethz-mtc/shot_scale_classifier-resnet50", convert_type=str)
    filename: str = Config.parse_env_var("FILENAME", default="pytorch_model.bin", convert_type=str)
    model_checkpoint_path: str = Config.parse_env_var("MODEL_CHECKPOINT_PATH", default="/tmp/pretrained_models", convert_type=str)

    max_image_size: int = Config.parse_env_var("MAX_IMAGE_SIZE", default="700", convert_type=int)
