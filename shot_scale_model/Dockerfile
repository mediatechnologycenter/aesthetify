# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

FROM nvidia/cuda:11.3.0-runtime-ubuntu20.04 as base
# Build the base image, including required system packages & gitlab ssh keys


# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

ENV TZ=Europe/Zurich
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

SHELL ["/bin/bash", "-c"]
WORKDIR /app

# Update & install packages
RUN apt-get update --fix-missing && \
    apt-get install -y bash curl wget git ca-certificates openssh-client gpg tzdata python3-pip && \
    apt-get clean
    # Make sure google-cloud-sdk-gke-gcloud-auth-plugin is installed, because it won't be included in later releases

FROM base as build
# Project specific build stage -> Install dependencies, copy source files, etc.

COPY requirements.txt .
RUN pip install -r requirements.txt


# Copy remaining source files
COPY . ./shot_scale_model

RUN ln -s /usr/bin/python3.8 /usr/bin/python

FROM build as prod
# Only ever start one worker, parallelize with horizontally scaling containers
CMD [ "gunicorn", "-c", "./shot_scale_model/gunicorn.conf.py", "--chdir", "./shot_scale_model", "-k", "uvicorn.workers.UvicornWorker", "app:app" ]
