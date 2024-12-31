const {
    Articulo,
    ArticuloRegular,
    ArticuloPoster 
} = require('./articulo.js');
const {Rol, Usuario} = require('./usuario.js');


class Revision {
    constructor(revisor, articulo, comentario, puntaje) {
        if (!(revisor instanceof Usuario) || !revisor.esRevisor()) {
            throw new Error("El revisor debe ser un Usuario con rol de revisor");
        }
        if (!(articulo instanceof ArticuloRegular) && !(articulo instanceof ArticuloPoster)) {
            throw new Error("El artículo debe ser una instancia de ArticuloRegular o ArticuloPoster");
        }
        if (!Number.isInteger(puntaje) || puntaje < -3 || puntaje > 3) {
            throw new Error("El puntaje debe ser un número entero entre -3 y 3");
        }

        this._revisor = revisor;
        this._articulo = articulo;
        this._comentario = comentario;
        this._puntaje = puntaje;
    }

    getRevisor() { 
        return this._revisor; 
    }
    getArticulo() {
        return this._articulo;
    }
    getComentario() {
        return this._comentario;
    }
    getPuntaje() {
        return this._puntaje;
    }
}

module.exports = Revision;