const mapnik = require("@mapnik/mapnik");

console.log("Mapnik version:", mapnik.versions.mapnik);
console.log("Mapnik version string:", mapnik.versions.mapnik_string);

// Test de création d'une carte simple
const map = new mapnik.Map(256, 256);
console.log("Map object created successfully");

console.log("Available fonts:", mapnik.fonts());
console.log("Available datasources:", mapnik.datasources());

// Créer une image simple pour tester le rendu
const img = new mapnik.Image(256, 256);
img.background = new mapnik.Color("steelblue");
img.premultiply();

// Enregistrer l'image
img.encode("png", function (err, buffer) {
  if (err) {
    console.error("Error encoding image:", err);
    process.exit(1);
  }

  const fs = require("fs");
  fs.writeFileSync("/app/test.png", buffer);
  console.log("Test image saved to /app/test.png");
});
