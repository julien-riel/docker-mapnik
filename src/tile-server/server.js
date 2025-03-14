const express = require("express");
const path = require("path");
const fs = require("fs");
const { TileGenerator } = require("./tile-generator");

// Chargement des fichiers de configuration
const tileConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tile_to_db.json"), "utf8")
);
const dbConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db_connexion_strings.json"), "utf8")
);

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialisation du générateur de tuiles
const tileGenerator = new TileGenerator(tileConfig, dbConfig);

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send({
    status: "ok",
    message: "Serveur de tuiles vectorielles opérationnel",
    tilesets: Object.keys(tileConfig),
  });
});

// Route pour les tuiles vectorielles
app.get("/vts-server/v1/:tileset/:z/:x/:y.pbf", async (req, res) => {
  const { tileset, z, x, y } = req.params;

  // Vérifier si le tileset existe
  if (!tileConfig[tileset]) {
    return res.status(404).send({ error: `Tileset '${tileset}' non trouvé` });
  }

  try {
    const tileData = await tileGenerator.generateTile(
      tileset,
      parseInt(z),
      parseInt(x),
      parseInt(y)
    );

    // Configurer les en-têtes pour une tuile vectorielle PBF
    res.set({
      "Content-Type": "application/x-protobuf",
      "Content-Encoding": "gzip",
      "Cache-Control": "public, max-age=3600",
    });

    res.send(tileData);
  } catch (error) {
    console.error(
      `Erreur lors de la génération de la tuile ${tileset}/${z}/${x}/${y}:`,
      error
    );
    res.status(500).send({ error: "Erreur lors de la génération de la tuile" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur de tuiles démarré sur le port ${PORT}`);
  console.log(`Tilesets disponibles: ${Object.keys(tileConfig).join(", ")}`);
});
