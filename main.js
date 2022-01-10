const express = require ("express");
const Contenedor = require ("./contenedor.js");
const Producto = require ("./producto.js");
const app = express();
const PORT = 8080;

app.get("/",(req, res) => {
    res.end (`<p>Por favor ingrese a la ruta <a href="./productos">/productos</a> o <a href="./productoRandom">./productoRandom</a><br>Gracias</p>`);
});

app.get("/productoRandom", (req,res) => {
    new Contenedor("./productos.txt").getAll().then(promiseResolve => {
            let indice = Math.floor(Math.random() * promiseResolve.length);
            res.send(promiseResolve[indice]);
    });
});

app.get("/productos", (req,res) => {
    const contenedor = new Contenedor("./productos.txt");    
    contenedor.getAll().then(promiseResolve => res.send({
                                productos: promiseResolve}));
});

const server = app.listen(PORT, () => {
    console.log(`Servidor arrancado en puerto ${server.address().port}`);
});
server.on("error", error => {
    console.log(error.message);
});
