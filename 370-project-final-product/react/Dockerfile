# FROM node:8
# 
# WORKDIR /app/
# 
# # Install dependencies
# COPY package.json yarn.lock /app/
# RUN npm cache clean --force
# RUN npm install
# RUN npm rebuild node-sass
# # Add rest of the client code
# COPY ./react /app/
# 
# 
# EXPOSE 3000

# Use an official node runtime as a parent image
FROM mhart/alpine-node:8

WORKDIR /app/frontend/

# Install dependencies
COPY package.json yarn.lock /app/frontend/

RUN npm install
RUN npm rebuild node-sass

# Add rest of the client code
COPY . /app/frontend/

EXPOSE 3000

