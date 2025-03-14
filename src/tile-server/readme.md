# Tile Server

A tile server serving VTS tiles.

A list of connexion strings to the databases is required in the `db_connexion_strings.json` file.

There's a mapping to tile to the database in the `tile_to_db.json` file (a tile may contains many layer form diffent source).

The express framework is used to serve the tiles.

Here's an example of a tile request:

https://my-server.com/vts-server/v1/{tileset}/12/1212/1462.pbf'
