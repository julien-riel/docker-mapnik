# Tile Server

Un serveur de tuiles vectorielles (VTS) basé sur Node.js, Express et Mapnik.

## Configuration

Le serveur utilise deux fichiers de configuration:

- `db_connexion_strings.json` : Contient les chaînes de connexion aux bases de données PostgreSQL
- `tile_to_db.json` : Configure le mapping entre les tilesets, les couches et les requêtes SQL

### Structure de db_connexion_strings.json

```json
{
  "nom_db": "postgresql://user:password@host:port/database"
}
```

### Structure de tile_to_db.json

```json
{
  "nom_tileset": {
    "description": "Description du tileset",
    "layers": [
      {
        "name": "nom_couche",
        "db": "nom_db",
        "minZoom": 0,
        "maxZoom": 20,
        "query": "SELECT geometry, propriete1, propriete2 FROM table WHERE geometry && ST_MakeEnvelope($minx, $miny, $maxx, $maxy, 3857)"
      }
    ]
  }
}
```

## Utilisation

### Démarrage du serveur

```bash
npm start
```

### Requête de tuile

Format de l'URL pour les tuiles:

```
https://my-server.com/vts-server/v1/{tileset}/{z}/{x}/{y}.pbf
```

Exemple:

```
https://my-server.com/vts-server/v1/basemap/12/1212/1462.pbf
```

## Fonctionnement

1. Le serveur charge les configurations au démarrage
2. Pour chaque requête de tuile, il:
   - Vérifie si le tileset demandé existe
   - Filtre les couches en fonction du niveau de zoom
   - Exécute les requêtes SQL avec les paramètres de bbox
   - Transforme les résultats en GeoJSON
   - Utilise Mapnik pour générer la tuile vectorielle au format PBF
   - Retourne la tuile avec les en-têtes appropriés

## Notes techniques

- Les tuiles sont générées à la demande (pas de mise en cache)
- Le système de coordonnées est EPSG:3857 (Web Mercator)
- Les tuiles sont compressées avec gzip
- Les variables $minx, $miny, $maxx et $maxy dans les requêtes SQL sont remplacées par les coordonnées de la bbox
