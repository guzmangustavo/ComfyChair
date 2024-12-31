// Se utiliza para simular un Enum en JavaScript
const Rol = Object.freeze({
    AUTOR: 'Autor',
    CHAIR: 'Chair',
    REVISOR: 'Revisor',
  });


class Usuario {
    constructor(nombre, afiliacion, email, contrasena) {
        this._nombre = nombre;
        this._afiliacion = afiliacion;
        this._email = email;
        this._contrasena = contrasena;
        this._rol = new Set();
    }

    getNombre() {
        return this._nombre;
    }

    getAfiliacion() {
        return this._afiliacion;
    }

    getEmail() {
        return this._email;
    }

    getContrasena() {
        return this._contrasena;
    }

    getRol() {
        return this._rol;
    }

    agregarRol(rol) {
        this._rol.add(rol); //TO DO Agregar validación de rol
    }

    esRevisor() {
        return this._rol.has(Rol.REVISOR);
    }
}

module.exports = {
    Rol,
    Usuario,
};
