const { connection }= require("./database/connection");
const express = require("express");
const cors = require("cors");
console.log("Node App started");

connection();

const app = express();

const port = 3000;

//ejecutamos cors antes de ejecutar una ruta para asegurarnos de que se transforme en un objeto javascript usable (antes lo
// unico que yo haca es parsear como json, pero a la persona de este tutorial le encanta poner modulos)
app.use(cors());

app.use(express.json());
//ahora tambien acepta params
app.use(express.urlencoded({extended:true}));

const rutas_prueba = require("./routers/articles");

app.use("/api", rutas_prueba);


app.listen(port, () =>{
    console.log("server running on port 3000");
});