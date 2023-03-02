# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

FROM continuumio/miniconda3 as base
# Build the base image, including required system packages & gitlab ssh keys


# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

ENV TZ=Europe/Zurich

SHELL ["/bin/bash", "-c"]
WORKDIR /app

# Update & install packages
RUN apt-get update --fix-missing && \
    apt-get install -y bash curl wget git ca-certificates openssh-client gpg tzdata && \
    apt-get clean
    # Make sure google-cloud-sdk-gke-gcloud-auth-plugin is installed, because it won't be included in later releases


FROM base as build
# Project specific build stage -> Install dependencies, copy source files, etc.

COPY requirements.txt .
RUN pip install -r requirements.txt


# Copy remaining source files
COPY . ./api_backend

FROM build as prod
# Only ever start one worker, parallelize with horizontally scaling containers
CMD [ "gunicorn", "-c", "./api_backend/gunicorn.conf.py", "--chdir", "./api_backend", "-k", "uvicorn.workers.UvicornWorker", "app:app" ]
