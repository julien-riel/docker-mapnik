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
    unzip

# Installatoin des polices de caractères.
# Utiliser les zip de Google fonts
# https://fonts.google.com/download?family=Open+Sans
COPY fonts/* /tmp/fonts/
RUN unzip /tmp/fonts/Open_Sans.zip -d /tmp/fonts/open-sans \
    && mkdir -p /usr/share/fonts/truetype/open-sans/ \
    && cp /tmp/fonts/open-sans/static/*.ttf /usr/share/fonts/truetype/open-sans/ \
    && rm -rf /var/lib/apt/lists/*

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et installation des dépendances
COPY package*.json ./
RUN npm install mapnik

# Copie du code source
COPY src/ src/

# Commande par défaut
CMD ["node", "src/test-mapnik.js"]
