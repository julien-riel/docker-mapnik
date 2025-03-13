FROM node:20-bullseye

# Installation des dépendances système pour Mapnik
RUN apt-get update && apt-get install -y \
    build-essential \
    libboost-all-dev \
    libicu-dev \
    zlib1g-dev \
    libfreetype6-dev \
    libharfbuzz-dev \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    libwebp-dev \
    libproj-dev \
    libcairo2-dev \
    pkg-config \
    postgresql-client \
    libpq-dev \
    libgdal-dev \
    libsqlite3-dev \
    libxml2-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et installation des dépendances
COPY package*.json ./
RUN npm install mapnik

# Copie des scripts de test
COPY test-mapnik.js .
COPY mapnik-demo.js .

# Commande par défaut
CMD ["node", "test-mapnik.js"]
