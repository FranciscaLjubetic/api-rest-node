const validator = require("validator");

const validador = (parametrosBody) => {
    let validar_titulo= !validator.isEmpty(parametrosBody.titulo) &&
                            validator.isLength(parametrosBody.titulo, {min:3, max: 255});
        let validar_contenido= !validator.isEmpty(parametrosBody.contenido);
        if(!validar_titulo || !validar_contenido){
            throw new Error("Data must be validated.")
        }
}

module.exports = {
    validador
}