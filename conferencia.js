const {Rol, Usuario} = require('./usuario.js');


class Conferencia {
    constructor() {
        this._chairs = [];
        this._revisores = [];
        this._sesiones = [];
    }
    agregarChair(usuario) {
        usuario.agregarRol(Rol.CHAIR);
        this._chairs.push(usuario);
    }

    agregarRevisor(usuario) {
        usuario.agregarRol(Rol.REVISOR);
        this._revisores.push(usuario);
    }

    agregarSesion(sesion) {
        this._sesiones.push(sesion);
    }
}

module.exports = Conferencia;
