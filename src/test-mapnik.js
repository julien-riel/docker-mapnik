const mapnik = require("mapnik");

// Enregistrer les plugins et datasources
mapnik.register_default_fonts();
mapnik.register_system_fonts();
mapnik.register_default_input_plugins();

// Afficher la version de Mapnik
console.log("Version de Mapnik:", mapnik.versions.mapnik);
console.log("Version de Boost:", mapnik.versions.boost);
console.log("Version de Node:", process.versions.node);

// Vérifier les plugins chargés
console.log("\nPlugins d'entrée chargés:");
mapnik.datasources().forEach((plugin) => console.log(` - ${plugin}`));

console.log("Polices disponibles :");
mapnik.fonts().forEach((font) => console.log(` - ${font}`));
// console.log("Fichier des polices :", mapnik.fontFiles());

console.log(Object.keys(mapnik));

console.log("Settings", mapnik.settings);

// Créer une carte vide pour vérifier que la création d'objet fonctionne
const map = new mapnik.Map(256, 256);
console.log(
  "\nCréation de carte réussie avec dimensions:",
  map.width,
  "x",
  map.height
);

console.log("\nInstallation de Mapnik fonctionnelle!");
