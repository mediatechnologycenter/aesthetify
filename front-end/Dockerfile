# *  SPDX-License-Identifier: Apache-2.0
# *  © 2023 ETH Zurich and other contributors, see AUTHORS.txt for details

# pull official base image for the first build step
FROM node:16-alpine as base

# add `/app/node_modules/.bin` to $PATH
# Change the workdir to a seperate folder
WORKDIR /front-end
# Create an env variable for the node modules path
ENV PATH /front-end/node_modules/.bin:$PATH
# Add react envs to dockerfile
ARG REACT_APP_DEVELOPMENT
ENV REACT_APP_DEVELOPMENT $REACT_APP_DEVELOPMENT
ARG REACT_APP_THUMBNAIL_ACTIVE
ENV REACT_APP_THUMBNAIL_ACTIVE $REACT_APP_THUMBNAIL_ACTIVE
# install app dependencies by firstly copying them and installing them
COPY package.json yarn.lock ./

RUN yarn install --network-timeout=30000
COPY ./src ./src
COPY ./public ./public
RUN yarn build



FROM base as debug
CMD ["yarn", "start"]

FROM nginx:stable-alpine as production

# Copy the created build file to the ngnix folder
COPY --from=base /front-end/build /usr/share/nginx/html
# Copy the nginx config template file to be used in docker container
COPY deployment/default.conf.template /etc/nginx/templates/

# Add entrypoint to add env variables
COPY 00-config-entrypoint.sh /docker-entrypoint.d/00-config-entrypoint.sh
COPY 99-log-nginx-config.sh /docker-entrypoint.d/99-log-nginx-config.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]