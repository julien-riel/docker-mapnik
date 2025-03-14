const mapnik = require("mapnik");
const { Pool } = require("pg");

// Enregistrer les plugins Mapnik
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

// Classe pour générer les tuiles vectorielles
class TileGenerator {
  constructor(tileConfig, dbConfig) {
    this.tileConfig = tileConfig;
    this.dbPools = {};

    // Initialiser les pools de connexion pour chaque base de données
    Object.keys(dbConfig).forEach((dbName) => {
      this.dbPools[dbName] = new Pool({
        connectionString: dbConfig[dbName],
      });
    });
  }

  // Convertir les coordonnées de la tuile en bbox (bounding box)
  tileToBox(x, y, z) {
    const size = 20037508.34 * 2;
    const resolution = size / Math.pow(2, z);

    const minX = -20037508.34 + x * resolution;
    const maxX = minX + resolution;
    const maxY = 20037508.34 - y * resolution;
    const minY = maxY - resolution;

    return { minX, minY, maxX, maxY };
  }

  // Générer une tuile vectorielle pour les coordonnées données
  async generateTile(tileset, z, x, y) {
    const tilesetConfig = this.tileConfig[tileset];
    if (!tilesetConfig) {
      throw new Error(`Tileset '${tileset}' non trouvé`);
    }

    // Calculer la bounding box pour cette tuile
    const { minX, minY, maxX, maxY } = this.tileToBox(x, y, z);

    // Créer un vecteur de tuile Mapnik
    const vt = new mapnik.VectorTile(z, x, y);

    // Filtrer les couches par zoom
    const layers = tilesetConfig.layers.filter(
      (layer) => z >= layer.minZoom && z <= layer.maxZoom
    );

    // Traiter chaque couche
    for (const layer of layers) {
      try {
        // Vérifier si la connexion à la base de données existe
        if (!this.dbPools[layer.db]) {
          console.warn(
            `Base de données '${layer.db}' non configurée pour la couche '${layer.name}'`
          );
          continue;
        }

        // Préparer la requête SQL avec les paramètres de bounding box
        const query = layer.query
          .replace(/\$minx/g, minX)
          .replace(/\$miny/g, minY)
          .replace(/\$maxx/g, maxX)
          .replace(/\$maxy/g, maxY);

        // Exécuter la requête
        const result = await this.dbPools[layer.db].query(query);

        if (result.rows.length > 0) {
          // Créer une source de données Mapnik à partir des résultats de la requête
          const geojsonFeatures = result.rows.map((row) => {
            const { geometry, ...properties } = row;
            return {
              type: "Feature",
              geometry: JSON.parse(geometry),
              properties,
            };
          });

          const geojson = {
            type: "FeatureCollection",
            features: geojsonFeatures,
          };

          // Ajouter les données à la tuile vectorielle
          const datasource = new mapnik.Datasource({
            type: "geojson",
            inline: JSON.stringify(geojson),
          });

          // Créer une couche Mapnik
          const mapnikLayer = new mapnik.Layer(layer.name);
          mapnikLayer.srs =
            "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over";
          mapnikLayer.datasource = datasource;

          // Ajouter la couche à la tuile
          vt.addLayer(mapnikLayer);
        }
      } catch (error) {
        console.error(
          `Erreur lors du traitement de la couche ${layer.name}:`,
          error
        );
      }
    }

    // Générer la tuile au format PBF
    return new Promise((resolve, reject) => {
      vt.getData({ compression: "gzip" }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  // Fermer proprement les connexions aux bases de données
  async close() {
    const closePromises = Object.values(this.dbPools).map((pool) => pool.end());
    return Promise.all(closePromises);
  }
}

module.exports = { TileGenerator };
