# Dépendances et Versions

Ce document liste les principales dépendances et leurs versions pour l'environnement Docker Mapnik.

## Environnement de base

- **OS**: Debian Bullseye (base de l'image Node.js)
- **Node.js**: 20.x

## Package Node.js

- **mapnik**: 4.0.0 (confirmé lors de l'exécution)

## Dépendances système principales

### Bibliothèques essentielles

- **build-essential**: Outils de compilation C/C++ supportant C++17
- **libboost-all-dev**: >= 1.73 (selon la disponibilité dans Debian Bullseye)
- **libicu-dev**: Support Unicode
- **zlib1g-dev**: Compression Zlib
- **libfreetype6-dev**: Support des polices
- **libharfbuzz-dev**: Moteur de rendu de texte OpenType

### Bibliothèques graphiques

- **libpng-dev**: Support PNG
- **libjpeg-dev**: Support JPEG
- **libtiff-dev**: Support TIFF
- **libwebp-dev**: Support WebP
- **libcairo2-dev**: Support PDF, PS, SVG
- **pkg-config**: Nécessaire pour Cairo

### Bibliothèques géospatiales

- **libproj-dev**: Bibliothèque de projections
- **libpq-dev** et **postgresql-client**: Support PostgreSQL/PostGIS
- **libgdal-dev**: Support GDAL/OGR
- **libsqlite3-dev**: Support SQLite
- **libxml2-dev**: Parser XML alternatif

## Remarques

- Cette configuration installe toutes les dépendances optionnelles pour garantir une fonctionnalité complète de Mapnik.
- Les versions exactes dépendent des packages disponibles dans Debian Bullseye.
- Pour optimiser la taille de l'image, on pourrait créer une version minimale en excluant certaines dépendances optionnelles.
- Si des versions spécifiques sont requises, il pourrait être nécessaire de compiler certaines bibliothèques à partir des sources.

## Utilisation

### Construction de l'image

```bash
docker build -t mapnik-node .
```

### Exécution des tests

```bash
docker run mapnik-node
```

### Exécution du script de démonstration

```bash
docker run mapnik-node node mapnik-demo.js
```

### Mode interactif

```bash
docker run -it mapnik-node bash
```
