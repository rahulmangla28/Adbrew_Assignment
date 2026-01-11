# set base image (host OS)
FROM python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update
RUN apt-get install -y curl nano wget nginx git

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install build dependencies for Python packages
RUN apt-get install -y python3-dev build-essential libssl-dev libffi-dev libpq-dev gcc g++ make

# Upgrade pip, setuptools, and wheel
RUN pip install --upgrade "pip<24.1" setuptools wheel

ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017

ENV PYTHONPATH=$PYTHONPATH:/src/

# Copy the dependencies file to the working directory
COPY src/requirements.txt .

# install dependencies
RUN pip install -r requirements.txt

# Copy source code
COPY src /src

# Install React dependencies
WORKDIR /src/app
RUN npm install

# Set working directory
WORKDIR /src
