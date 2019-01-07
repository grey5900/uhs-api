FROM mhart/alpine-node:6.1.0

# Install required dependencies (Alpine Linux packages)
RUN apk update && \
  apk add --no-cache \
    g++ \
    gcc \
    git \
    libev-dev \
    libevent-dev \
    libuv-dev \
    make \
    openssl-dev \
    perl \
    python

# Switch to directory for external dependencies (installed from source)
WORKDIR /external

# Install (global) NPM packages/dependencies
RUN npm install -g \
  node-gyp \
  pm2
# Switch to directory with sources
WORKDIR /src
ADD . /src/

# Copy package json and install dependencies
COPY package.json .

# Install (local) NPM and Bower packages/dependencies
RUN npm install

# Copy required stuff
ADD . .

# Expose API ports
EXPOSE 3050

# Specify default CMD
CMD ["pm2", "start", "ecosystem.json"]

