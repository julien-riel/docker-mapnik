const mapnik = require("mapnik");
const fs = require("fs");
const path = require("path");

// Enregistrer les plugins et datasources
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

// Créer un répertoire pour les sorties si nécessaire
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log("Démonstration des fonctionnalités de Mapnik");

// 1. Création d'une carte simple
function createSimpleMap() {
  console.log("\n1. Création d'une carte simple");

  // Initialiser une carte avec une taille définie
  const map = new mapnik.Map(800, 600);

  // Définir la projection (WGS84)
  map.srs = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

  // Créer un style simple
  const s = `
    <Map background-color="steelblue">
        <Style name="style">
            <Rule>
                <PolygonSymbolizer fill="#f2eff9" />
                <LineSymbolizer stroke="rgb(50,50,50)" stroke-width="0.5" />
            </Rule>
        </Style>
    </Map>`;

  // Charger le style
  map.fromStringSync(s);

  // Rendu en PNG
  const filename = path.join(outputDir, "simple_map.png");
  map.renderFileSync(filename);
  console.log(`Carte enregistrée: ${filename}`);
}

// 2. Création d'une carte avec des points
function createPointMap() {
  console.log("\n2. Création d'une carte avec des points");

  // Créer des données de point
  const geoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 0] },
        properties: { name: "Point central" },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [10, 10] },
        properties: { name: "Point nord-est" },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-10, -10] },
        properties: { name: "Point sud-ouest" },
      },
    ],
  };

  // Créer un objet de fonctionnalités à partir du GeoJSON
  const featureSet = new mapnik.FeatureSet();
  geoJSON.features.forEach((feature) => {
    const feat = new mapnik.Feature.fromJSON(JSON.stringify(feature));
    featureSet.add(feat);
  });

  // Créer une carte
  const map = new mapnik.Map(800, 600);
  map.srs = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

  // Ajouter un style pour les points
  const s = `
    <Map background-color="#b3d1ff">
        <Style name="points">
            <Rule>
                <MarkersSymbolizer fill="red" width="20" height="20" stroke="black" stroke-width="1" />
                <TextSymbolizer face-name="DejaVu Sans Book" size="12" fill="black" halo-radius="1" halo-fill="white">[name]</TextSymbolizer>
            </Rule>
        </Style>
    </Map>`;
  map.fromStringSync(s);

  // Créer une source de données et une couche
  const memoryDatasource = new mapnik.MemoryDatasource();
  memoryDatasource.add(featureSet);

  const layer = new mapnik.Layer("points");
  layer.srs = map.srs;
  layer.styles = ["points"];
  layer.datasource = memoryDatasource;

  map.add_layer(layer);

  // Définir l'étendue pour inclure tous les points
  map.zoomToBox([-15, -15, 15, 15]);

  // Rendu en PNG
  const filename = path.join(outputDir, "point_map.png");
  map.renderFileSync(filename);
  console.log(`Carte avec points enregistrée: ${filename}`);
}

// 3. Générer différents formats de sortie
function generateDifferentFormats() {
  console.log("\n3. Génération de différents formats de sortie");

  const map = new mapnik.Map(800, 600);
  map.srs = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

  // Style simple
  const s = `
    <Map background-color="#85c5d3">
        <Style name="style">
            <Rule>
                <PolygonSymbolizer fill="#f2eff9" />
                <LineSymbolizer stroke="rgb(50,50,50)" stroke-width="0.5" />
            </Rule>
        </Style>
    </Map>`;

  map.fromStringSync(s);

  // Rectangle comme exemple
  const geojson = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-10, -10],
          [10, -10],
          [10, 10],
          [-10, 10],
          [-10, -10],
        ],
      ],
    },
  };

  // Ajouter le rectangle à la carte
  const feature = new mapnik.Feature.fromJSON(JSON.stringify(geojson));
  const featureSet = new mapnik.FeatureSet();
  featureSet.add(feature);

  const memoryDatasource = new mapnik.MemoryDatasource();
  memoryDatasource.add(featureSet);

  const layer = new mapnik.Layer("rectangle");
  layer.srs = map.srs;
  layer.styles = ["style"];
  layer.datasource = memoryDatasource;

  map.add_layer(layer);
  map.zoomToBox([-12, -12, 12, 12]);

  // PNG
  map.renderFileSync(path.join(outputDir, "rectangle.png"));
  console.log("Format PNG généré");

  // JPEG
  map.renderFileSync(path.join(outputDir, "rectangle.jpg"), { format: "jpeg" });
  console.log("Format JPEG généré");

  // SVG
  map.renderFileSync(path.join(outputDir, "rectangle.svg"), { format: "svg" });
  console.log("Format SVG généré");

  // PDF (si supporté)
  try {
    map.renderFileSync(path.join(outputDir, "rectangle.pdf"), {
      format: "pdf",
    });
    console.log("Format PDF généré");
  } catch (e) {
    console.log("Format PDF non supporté dans cette installation");
  }
}

// 4. Démonstration des projections
function demonstrateProjections() {
  console.log("\n4. Démonstration des projections");

  // Créer une carte en projection Mercator
  const map = new mapnik.Map(800, 600);
  map.srs =
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over";

  // Créer une grille mondiale avec des lignes de longitude/latitude
  const features = [];

  // Lignes de longitude
  for (let lon = -180; lon <= 180; lon += 30) {
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: Array.from({ length: 181 }, (_, i) => [lon, -90 + i]),
      },
      properties: { type: "longitude", value: lon },
    });
  }

  // Lignes de latitude
  for (let lat = -90; lat <= 90; lat += 30) {
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: Array.from({ length: 361 }, (_, i) => [-180 + i, lat]),
      },
      properties: { type: "latitude", value: lat },
    });
  }

  // Créer une source de données à partir des traits
  const featureSet = new mapnik.FeatureSet();
  features.forEach((feature) => {
    const feat = new mapnik.Feature.fromJSON(JSON.stringify(feature));
    featureSet.add(feat);
  });

  const memoryDatasource = new mapnik.MemoryDatasource();
  memoryDatasource.add(featureSet);

  // Style pour les lignes
  const s = `
    <Map background-color="#a4c8ff">
        <Style name="lines">
            <Rule>
                <LineSymbolizer stroke="rgba(0,0,0,0.5)" stroke-width="1" />
            </Rule>
        </Style>
    </Map>`;

  map.fromStringSync(s);

  // Ajouter la couche
  const layer = new mapnik.Layer("grid");
  layer.srs = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  layer.styles = ["lines"];
  layer.datasource = memoryDatasource;

  map.add_layer(layer);

  // Définir l'étendue de la carte pour voir le monde entier
  const worldBounds = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];
  map.zoomToBox(worldBounds);

  // Rendu en PNG
  const filename = path.join(outputDir, "mercator_projection.png");
  map.renderFileSync(filename);
  console.log(`Carte en projection Mercator enregistrée: ${filename}`);
}

// Exécuter toutes les démonstrations
console.log("Dossier de sortie: " + outputDir);
createSimpleMap();
createPointMap();
generateDifferentFormats();
demonstrateProjections();

console.log("\nDémonstration terminée!");
