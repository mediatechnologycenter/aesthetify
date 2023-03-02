# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

import logging
import os
from typing import List, Tuple
import random 
import glob

from PIL import Image
from fastapi import UploadFile

from api_backend.api_types import ImageNotProcessed
from api_backend.config import AestheticsConfig

log = logging.Logger("image_utils-Logger")


def validate_image(image: UploadFile):
    # TODO: build support for raw type?
    return "image" in image.content_type


async def save_image_to_disk(task: ImageNotProcessed, image_dir: str) -> bool:
    """
    Save image to disk and returns true if everything went well
    """
    # Create paths
    user_image_path = os.path.join(image_dir, task.user_id)
    original_image_path = os.path.join(user_image_path, "original")
    thumbnail_image_path = os.path.join(user_image_path, "thumbnail")
    os.makedirs(original_image_path, exist_ok=True)
    os.makedirs(thumbnail_image_path, exist_ok=True)
    original_image_path = os.path.join(original_image_path, task.image_name)
    thumbnail_image_path = os.path.join(thumbnail_image_path, task.image_name)

    # Save files to disk
    with open(original_image_path, 'wb') as original_file:
        file_bytes = await task.image_to_predict.read()
        original_file.write(file_bytes)
        log.debug(f"Saved image file {task.image_id} in {original_image_path} ")

    # TODO Read redundant
    # If Image.open cannot open the already saved image, we delete it from disk
    try:
        with Image.open(original_image_path) as im:
            im.thumbnail((600, 600))
            im.save(thumbnail_image_path)
            log.debug(f"Saved thumbnail file {task.image_id} in {thumbnail_image_path}")
            success = True
    except:
        print(f"Image {original_image_path} corrupted, deleting from disk...")
        os.remove(original_image_path)
        success = False

    task.image_to_predict = None  # This is no longer used and can be removed in order to save memory

    return success

def delete_image_from_disk(image_name: str, user_id: str, image_dir:str) -> None:
    # Create paths
    user_image_path = os.path.join(image_dir, user_id)
    original_image_path = os.path.join(user_image_path, "original")
    thumbnail_image_path = os.path.join(user_image_path, "thumbnail")
    original_image_path = os.path.join(original_image_path, image_name)
    thumbnail_image_path = os.path.join(thumbnail_image_path, image_name)

    os.remove(original_image_path)
    os.remove(thumbnail_image_path)    


def count_images_from_disk(user_id: str, image_dir:str) -> int:
    """
    List images of user_id stored in disk
    """
    # Create paths
    user_image_path = os.path.join(image_dir, user_id)
    original_image_path = os.path.join(user_image_path, "original")

    return len(glob.glob(f"{original_image_path}/*"))


def get_image_metadata(image_path: str) -> dict:
    metadata = {}

    with Image.open(image_path) as im:
        size = im.size
        metadata["image_size"] = size
        metadata["orientation"] = "landscape" if size[0] > size[1] else "portrait"
        metadata["colors"] = _get_image_colors(im)

    with Image.open(image_path.replace("original", "thumbnail")) as im:
        metadata["thumbnail_size"] = im.size

    return metadata


def _get_image_colors(image: Image.Image, num_colors=10) -> List[Tuple[int]]:
    """
    Returns a list of tuples with the RGB encoding of the *num_colors* dominat colors.
    """
    # Based on https://github.com/makkoncept/colorpalette/blob/master/colorpalette/color.py
    small_image = image.resize((80, 80))
    converted = small_image.convert(
        "P", palette=Image.Palette.ADAPTIVE, colors=num_colors
    )
    # Find dominant colors
    palette = converted.getpalette()
    color_counts = sorted(converted.getcolors(), reverse=True)
    colors = list()
    for i in range(num_colors):
        palette_index = color_counts[i][1]
        dominant_color = palette[palette_index * 3: palette_index * 3 + 3]
        colors.append(str("#%02x%02x%02x" % tuple(dominant_color)))

    log.debug(f"Dominant colors: {colors}")
    return colors

# TODO: Something smarter than random
def reduce_colors(colors: list[str]) -> list[str]:
    k = len(colors) if len(colors)< AestheticsConfig.max_colors else AestheticsConfig.max_colors
    return random.sample(colors, k)
