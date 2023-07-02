## Author: Suresh Koduri ##
# Name the node stage "builder"
FROM 797179711938.dkr.ecr.ap-south-1.amazonaws.com/riajava:node16 AS builder
#FROM node:16 AS builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
ARG ENV
ENV ENV $ENV
COPY package.json package-lock.json ./
RUN echo "Environment: ${ENV}"
# install node modules and build assets
RUN npm i --legacy-peer-deps
COPY . .
# RUN npm install -g @angular/cli
RUN npm run build-${ENV} -- --output-path=./dist/RIA

# nginx state for serving content
FROM 797179711938.dkr.ecr.ap-south-1.amazonaws.com/riajava:nginxalpine
#FROM nginx:alpine
#!/bin/sh
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
COPY ./.nginx/nginx.conf /etc/nginx/conf.d/default.conf


#COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/dist/RIA .
# Containers run nginx with global directives and daemon off

EXPOSE 80 4200

ENTRYPOINT ["nginx", "-g", "daemon off;"]
