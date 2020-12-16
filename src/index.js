const express = require("express");
const morgan = require("morgan");
const server = express();

server.set("port", process.env.PORT || 3000);

/* Middelwars (No se ingles :v) */
server.use(morgan("dev"));

server.listen(server.get("port"), () => {
    console.log("Servidor listo en el puerto "+server.get("port")+" Go, ve a abrirlo :D!");
});
