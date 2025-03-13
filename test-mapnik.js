const mapnik = require("mapnik");

// Enregistrer les plugins et datasources
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

// Afficher la version de Mapnik
console.log("Version de Mapnik:", mapnik.versions.mapnik);
console.log("Version de Boost:", mapnik.versions.boost);
console.log("Version de Node Mapnik:", mapnik.versions.node_mapnik);

// Vérifier les plugins chargés
console.log("\nPlugins d'entrée chargés:");
mapnik.datasources().forEach((plugin) => console.log(` - ${plugin}`));

// Vérifier les polices disponibles
console.log("\nRépertoires de polices:");
mapnik.fontDirs().forEach((dir) => console.log(` - ${dir}`));

// Créer une carte vide pour vérifier que la création d'objet fonctionne
const map = new mapnik.Map(256, 256);
console.log(
  "\nCréation de carte réussie avec dimensions:",
  map.width(),
  "x",
  map.height()
);

console.log("\nInstallation de Mapnik fonctionnelle!");
