const {InteresEnArticulo, Bid} = require('./bid.js');
const {Rol, Usuario} = require('./usuario.js');


class Articulo {
    constructor(titulo, urlArchivo, autorNotificaciones) {
        if (this.constructor === Articulo) {
            throw new Error("No se puede instanciar una clase abstracta: Articulo");
        }

        if (!(autorNotificaciones instanceof Usuario)) {
            throw new Error("autorNotificaciones debe ser una instancia de la clase Usuario");
        }

        this._titulo = titulo;
        this._urlArchivo = urlArchivo;
        this._autorNotificaciones = autorNotificaciones;
        this._limite_revisiones = 3;
        this._autores = [autorNotificaciones];
        this._bids = new Map();
        this._revisores = new Set();
        this._revisiones = [];
    }

    getTitulo() {
        return this._titulo;
    }

    getUrlArchivo() {
        return this._urlArchivo;
    }

    getAutorNotificaciones() { 
        return this._autorNotificaciones;
    }   

    getLimiteRevisiones() {
        return this._limite_revisiones;
    }

    getAutores() {
        return this._autores;
    }

    getBids() {
        return this._bids;
    }

    getRevisores() {
        return this._revisores;
    }
    
    getRevisiones() {
        return this._revisiones;
    }

    setTitulo(titulo) {
        this._titulo = titulo;
    }

    setUrlArchivo(urlArchivo) {
        this._urlArchivo = urlArchivo;
    }

    setAutorNotificaciones(autorNotificaciones) {
        this._autorNotificaciones = autorNotificaciones;
    }

    agregarAutor(usuario) {
        this._autores.push(usuario);
    }

    agregarBid(revisor, interesEnArticulo) {
        if (this._bids.has(revisor._email)) {
            this._bids.get(revisor._email).actualizarInteres(interesEnArticulo);
        } else {
            this._bids.set(revisor._email, new Bid(revisor, this, interesEnArticulo));
        }
    }

    agregarRevisor(usuario) {
        this._revisores.add(usuario);
        usuario.agregarRol(Rol.REVISOR);

    }

    validarCantidadAutores(){
        return this._autores.length > 0;
    }

    validarTitulo(){
        if (!this._titulo) {
            return false;
        }

        if (this._titulo.trim() === "") {
            return false;
        }

        return true;
    }

    esArticuloRegular(){
        return this instanceof ArticuloRegular;
    }

    esArticuloPoster(){
        return this instanceof ArticuloPoster;
    }

    validarArticulo(){
        throw new Error("Debe ser implementado por las subclases");
    }

    agregarRevision(revision){
        if (this.getRevisiones().length == this.getLimiteRevisiones()){
            throw new Error("El artículo ya tiene la cantidad máxima de revisiones");
        }
        this._revisiones.push(revision);
    }

    sumarPuntajeRevisiones() {
        return this.getRevisiones().reduce((suma, revision) => suma + revision.getPuntaje(), 0);
    }
}


class ArticuloRegular extends Articulo {
    constructor(titulo, urlArchivo, autorNotificaciones, resumen) {
        super(titulo, urlArchivo, autorNotificaciones);
        this._resumen = resumen;
        this._limite_palabras = 300;
    }

    getResumen() {
        return this._resumen;
    }

    getLimitePalabras() {
        return this._limite_palabras;
    }

    validarArticulo() {
        return this.validarTitulo() && this.validarCantidadAutores() && this.validarResumen();
    }

    validarResumen() {
        if (!this._resumen) {
           return false
        }
        
        const palabras = this._resumen.trim().split(/\s+/);

        if (palabras.length === 0){
            return false;
        }
        
        if (palabras.length >= this._limite_palabras){
            return false
        }
        return true;
      }
}


class ArticuloPoster extends Articulo {
    constructor(titulo, urlArchivo, autorNotificaciones, urlArchivoFuente) {
        super(titulo, urlArchivo, autorNotificaciones);
        this._url_archivo_fuente = urlArchivoFuente;
    }

    getUrlArchivoFuente() {
        return this._url_archivo_fuente;
    }
    
    validarArticulo() {
        return this.validarTitulo() && this.validarCantidadAutores();
    }
}

module.exports = {
    Articulo,
    ArticuloRegular,
    ArticuloPoster
};