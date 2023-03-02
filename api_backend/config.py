# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

from mtc_api_utils.config import Config


class AestheticsConfig(Config):
    mockBackend: bool = Config.parse_env_var("MOCK_BACKEND", default="False", convert_type=bool)

    db_path: str = Config.parse_env_var("DB_PATH", default="/tmp/tinyDB/aesthetics.json", convert_type=str)
    files_dir: str = Config.parse_env_var("FILES_DIR", default="/tmp/stored_images", convert_type=str)

    aesthetics_client_url: str = Config.parse_env_var("AESTHETICS_MODEL_URL", default="http://aesthetics-model:5000", convert_type=str)
    emotion_client_url: str = Config.parse_env_var("EMOTION_MODEL_URL", default="http://emotion-model:5000", convert_type=str)
    shot_scale_client_url: str = Config.parse_env_var("SHOT_SCALE_MODEL_URL", default="http://shot-scale-model:5000", convert_type=str)

    max_colors:int = Config.parse_env_var("MAX_NUM_COLORS", default=15, convert_type=int)
