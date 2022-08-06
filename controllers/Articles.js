const Article = require("../models/Articles");
const { validador } = require("../helpers/validador")
const fs = require("fs");
const path = require("path")

const test = (req, res) => {
    return res.status(200).json({
        mensaje: "soy un metodo de prueba"
    });
}

const curso = (req, res ) => {
    console.log("Se ha ejecutado el endpoint de cursos");
    return res.status(200).json([{
        curso: "Master en React",
        autor: "Victor Robles",
        url: "victorrrobles.es/master-react"
    },
    {
        curso: "Master en Typescript",
        autor: "Victor Robles",
        url: "victorrrobles.es/master-react"
    }]);

};

const createArticle = (req, res) => {
    let parametrosBody = req.body;
    try{
        validador(parametrosBody);
    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        });
    }
    const articulo = new Article(parametrosBody);
    articulo.save((error, articuloGuardado) =>{
        if(error || !articuloGuardado){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado."
            });
        }
        return res.status(201).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Guardado con éxito"
        });
    });
}

const updateArticle = (req, res) => {
    let id= req.params.id;
    let parametrosBody = req.body;
    try{
        validador(parametrosBody);
    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        });
    }
    const articulo = Article.findOneAndUpdate({_id: id}, parametrosBody, {new: true}, (error, articuloActualizado) => {
        if(error || !articuloActualizado){
            return res.status(500).json({
                status: "error",
                mensaje: "No results to update."
            });
        }
        return res.status(200).send({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "succesfully updated"
        });
    });
}

const deleteArticle = (req, res) => {
    let id= req.params.id;
    let consulta = Article.findOneAndDelete({_id: id}, (error, articuloBorrado) => {
        if(error || !articuloBorrado){
            return res.status(404).json({
                status: "error",
                mensaje: "No results to delete."
            });
        }
        return res.status(200).send({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "succesfully deleted"
        });
    });
    
}

const readArticles = (req, res) => {
    let last= req.params.ultimos;
    //if(last){ consulta.limit(last)} probé y este if no se necesita en lo mas minimo
    let consulta = Article.find({})
                            .limit(last)
                            .sort({fecha: -1})
                            .exec((error, articulos) => {
        if(error || !articulos){
            return res.status(404).json({
                status: "error",
                mensaje: "No results."
            });
        }

        return res.status(200).send({
            status: "success",
            parametro: last,
            contador: articulos.length,
            articulos
        });
    })
}

const findArticleById = (req, res) => {
    let id= req.params.id;
    let consulta = Article.findById(id, (error, articulo) => {
        if(error || !articulo){
            return res.status(404).json({
                status: "error",
                mensaje: "No results."
            });
        }
        return res.status(200).send({
            status: "success",
            parametro: id,
            articulo
        });
    });
}

const uploadImage = (req, res) =>{
    if(!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "Please provide an image"
        });
    }

    let fileName = req.file.originalname;
    let file_split = fileName.split("\.");
    let file_extension = file_split[1];

    if(file_extension != "png" 
        && file_extension != "jpg" 
        && file_extension != "jpeg" 
        && file_extension != "gif"){
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Invalid image"
            });
        })
    } else {
        let id= req.params.id;
    
        const articulo = Article.findOneAndUpdate({_id: id}, {imagen: req.file.filename}, {new: true}, (error, articuloActualizado) => {
            if(error || !articuloActualizado){
                return res.status(500).json({
                    status: "error",
                    mensaje: "No results to update."
                });
            } else {
                return res.status(200).send({
                    status: "success",
                    articulo: articuloActualizado,
                    mensaje: "succesfully updated"
                });
            }
        });
    }
}

const notFoundArticle = (req, res) => {
    return res.status(400).json({
        mensaje: "This page doesn`t exist. Please try again"
    });
}

const image = (req, res) => {
    let fichero = req.params.file;
    let physical_path = "./images/articles/" + fichero;
    //mucho ojo porque construimos un nuevo nombre de imagen con mas cosas que el nombre original con que fue cargada.
    fs.stat(physical_path, (error, exists) =>{
        if(exists){
            return res.sendFile(path.resolve(physical_path));
        } else {
            return res.status(500).json({
                status: "error",
                mensaje: "No results to show."
            });
        }
    })
}

const search = (req, res) => {
    let search = req.params.string;
    console.log(search)
    Article.find({"$or": [
        {"titulo": {"$regex": search, "$options": "i"}},
        {"contenido": {"$regex": search, "$options": "i"}},
    ] })
    .sort({fecha: -1})
    .exec((error, articulosEncontrados) => {
        if(error || !articulosEncontrados || articulosEncontrados.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: "No results to show."
            });
        } else {
            return res.status(200).send({
                status: "success",
                articulo: articulosEncontrados
            });
        }
    })
}

module.exports = {
    test,
    curso,
    createArticle,
    updateArticle,
    deleteArticle,
    readArticles,
    findArticleById,
    uploadImage,
    image,
    search
}