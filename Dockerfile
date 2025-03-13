FROM node:16-bullseye

# Installation des dépendances nécessaires pour compiler Mapnik
RUN apt-get update && apt-get install -y \
    build-essential \
    libboost-all-dev \
    libcairo2-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libwebp-dev \
    libproj-dev \
    libharfbuzz-dev \
    libicu-dev \
    libfreetype6-dev \
    libxml2-dev \
    python3 \
    python3-pip \
    git \
    curl \
    libmapnik-dev \
    mapnik-utils \
    libsqlite3-dev

# Configuration des variables d'environnement pour node-mapnik
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV JOBS=max

# Cloner une version spécifique de node-mapnik
WORKDIR /app
RUN git clone --branch v4.5.9 https://github.com/mapnik/node-mapnik.git

WORKDIR /app/node-mapnik

# Installation manuelle de node-mapnik
RUN npm install -g node-gyp && \
    npm install --ignore-scripts && \
    node-gyp configure && \
    node-gyp build

# Créer un script de test simple
COPY test.js /app/node-mapnik/

# Point d'entrée par défaut
CMD ["node", "test.js"]
