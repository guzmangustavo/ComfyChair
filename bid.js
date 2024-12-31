const {
    Articulo,
    ArticuloRegular,
    ArticuloPoster 
} = require('./articulo.js');
const {Rol, Usuario} = require('./usuario.js');


// Se utiliza para simular un Enum en JavaScript
const InteresEnArticulo = Object.freeze({
    INTERESADO: 'Interesado',
    NO_INTERESADO: 'No interesado',
    QUIZAS: 'Quizás',
    SIN_BID: 'Sin bid'
  });


class Bid {
    constructor(revisor, articulo, interes) {
        if (!(revisor instanceof Usuario) || !revisor.esRevisor()) {
            throw new Error("El revisor debe ser un Usuario con rol de revisor");
        }

        if (!Object.values(InteresEnArticulo).includes(interes)) {
            throw new Error("Tipo de interés en artículo no válido");
        }

        this._articulo = articulo;
        this._interes = interes;
        this._revisor = revisor;
    }
        
    actualizarInteres(interes) {
        this._interes = interes;
    }

    getArticulo() {
        return this._articulo;
    }
    
    getInteres() {
        return this._interes;
    }
    
    getRevisor() {
        return this._revisor;
    }

}
    
    
module.exports = {
    InteresEnArticulo,
    Bid
};