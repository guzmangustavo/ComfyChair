const EtapaSesion = Object.freeze({
    RECEPCION: "Recepción",
    BIDDING: "Bidding",
    REVISION: "Asignación y Revisión",
    SELECCION: "Selección"
  });
const {InteresEnArticulo, Bid} = require('./bid.js');


class EstrategiaSeleccion {
    constructor() {
        if (this.constructor === EstrategiaSeleccion) {
            throw new Error("No se puede instanciar una clase abstracta: EstrategiaSeleccion");
        }
    }

    seleccionarArticulos(sesion) {
        throw new Error("El método debe ser implementado por las sublclases");
    }
}


class EstrategiaCorteFijo extends EstrategiaSeleccion {
    constructor(porcentaje) {
        super();
        this._porcentaje = porcentaje;
    }

    seleccionarArticulos(sesion) {
        const articulos = sesion.getArticulos();

        if (articulos.length === 0) {
            throw new Error("No hay artículos para seleccionar");
        }

        const cantArticulosSeleccionados = Math.floor(articulos.length * this._porcentaje / 100);
        
        articulos.sort((a, b) => b.sumarPuntajeRevisiones() - a.sumarPuntajeRevisiones());

        return articulos.slice(0, cantArticulosSeleccionados);
    }
}


class EstrategiaUmbral extends EstrategiaSeleccion {
    constructor(puntajeMinimo) {
        super();
        this._puntajeMinimo = puntajeMinimo;
    }

    seleccionarArticulos(sesion) {
        const articulos = sesion.getArticulos();

        if (articulos.length === 0) {
            throw new Error("No hay artículos para seleccionar");
        }

        const maxAceptados = sesion.getMaximaCantidadArticulosAceptados();

        articulos.sort((a, b) => b.sumarPuntajeRevisiones() - a.sumarPuntajeRevisiones());

        return articulos
            .filter(articulo => articulo.sumarPuntajeRevisiones() >= this._puntajeMinimo)
            .slice(0, maxAceptados);
    }
}


class Sesion{
    constructor(fechaLimiteRecepcion, maxCantArticulosAceptados) {
        if (new.target === Sesion) {
            throw new Error("No se puede instanciar una clase abstracta: Sesion");
        }
        this._fecha_limite_recepcion = fechaLimiteRecepcion;
        this._max_cant_articulos_aceptados = maxCantArticulosAceptados;
        this._articulos = [];
        this._etapa = EtapaSesion.RECEPCION;
        this._estrategia_seleccion = new EstrategiaUmbral(0);
    }

    getFechaLimiteRecepcion() {
        return new Date(this._fecha_limite_recepcion);
    }

    getArticulos() {
        return this._articulos;
    }

    getEtapa() {
        return this._etapa;
    }

    getMaximaCantidadArticulosAceptados() {
        return this._max_cant_articulos_aceptados;
    }

    setEtapa(etapa) {
        let fecha_hoy = new Date();
        fecha_hoy.setHours(0,0,0,0);

        if (etapa === EtapaSesion.BIDDING && fecha_hoy < this.getFechaLimiteRecepcion()){
            throw new Error("La etapa de bidding no puede comenzar antes de la fecha límite de recepción");
        }

        if(etapa === EtapaSesion.REVISION && this.getEtapa() !== EtapaSesion.BIDDING){
            throw new Error("La etapa de revisión no puede comenzar antes de la etapa de bidding");
        }

        this._etapa = etapa;
    }

    setEstrategiaSeleccion(estrategia) {
        if (!(estrategia instanceof EstrategiaSeleccion)) {
            throw new Error("La estrategia debe ser una instancia de EstrategiaSeleccion");
        }
        this._estrategia_seleccion = estrategia;
    }

    getEstrategiaSeleccion() {
        return this._estrategia_seleccion;
    }

    estaAbierta() {
        let fecha_hoy = new Date();
        fecha_hoy.setHours(0,0,0,0);

        return fecha_hoy <= this.getFechaLimiteRecepcion();
    }

    enviarArticulo(articulo) {
        if (!this.estaAbierta()) {
            throw new Error("La sesión no está abierta");
        }
        if (this.getArticulos().length === this.getMaximaCantidadArticulosAceptados()) {
            throw new Error("La cantidad máxima de artículos aceptados ha sido alcanzada");
        }
        this._articulos.push(articulo);
    }

    aceptarArticulo(articulo) {
        return articulo.validarArticulo();
    }

    agregarBid(articulo, usuario, InteresEnArticulo) {
        if (this.getEtapa() !== EtapaSesion.BIDDING) {
            throw new Error("La etapa de bidding no está activa");
        }
        articulo.agregarBid(usuario, InteresEnArticulo);
    }

    agregarRevisionPorArticulo(articulo, revision) {
        if (this.getEtapa() !== EtapaSesion.REVISION) {
            throw new Error("La etapa de revisión no está activa");
        }
        articulo.agregarRevision(revision);
    }

    seleccionarArticulos() {
        if (this.getEtapa() !== EtapaSesion.SELECCION) {
            throw new Error("Los artículos solo se pueden seleccionar en la etapa de selección");
        }

        return this.getEstrategiaSeleccion().seleccionarArticulos(this);
    }

    _obtenerTodosRevisores() {
        const revisores = new Set();
        for (const articulo of this._articulos) {
            for (const bid of articulo.getBids().values()) {
                revisores.add(bid.getRevisor());
            }
        }

        return Array.from(revisores);
    }

    _calcularRevisionesPorRevisor() {
        const totalArticulos = this.getArticulos().length;
        const totalRevisores = this._obtenerTodosRevisores().length;
        
        if (totalRevisores === 0) {
            throw new Error("No hay revisores disponibles para asignar");
        }
        
        const totalRevisiones = totalArticulos * 3;

        const revisionesPorRevisorBase = Math.floor(totalRevisiones / totalRevisores);
        const revisionesAdicionales = totalRevisiones % totalRevisores;

        return {
            revisionesPorRevisorBase,
            revisionesAdicionales
        };
    }

    _asignarRevisores() {
        if (this.getEtapa() !== EtapaSesion.REVISION) {
            throw new Error("La etapa de revisión no está activa");
        }

        const {revisionesPorRevisorBase, revisionesAdicionales } = this._calcularRevisionesPorRevisor();
        const totalRevisores = this._obtenerTodosRevisores()
        const revisoresDisponibles = new Map();
        
        for (const revisor of totalRevisores) {
            revisoresDisponibles.set(revisor, revisionesPorRevisorBase);
        }
        
        let revisionesAdicionalesAsignadas = 0;

        for (const [revisor] of revisoresDisponibles) {
            if (revisionesAdicionalesAsignadas < revisionesAdicionales) {
                revisoresDisponibles.set(revisor, revisoresDisponibles.get(revisor) + 1);
                revisionesAdicionalesAsignadas++;
            }
        }

        for (const articulo of this._articulos) {
            const revisoresAsignados = new Set();

            this._asignarRevisoresPorNivel(articulo, InteresEnArticulo.INTERESADO, revisoresDisponibles, revisoresAsignados);
            this._asignarRevisoresPorNivel(articulo, InteresEnArticulo.QUIZAS, revisoresDisponibles, revisoresAsignados);
            this._asignarRevisoresPorNivel(articulo, InteresEnArticulo.NO_INTERESADO, revisoresDisponibles, revisoresAsignados);
            this._asignarRevisoresPorNivel(articulo, InteresEnArticulo.SIN_BID, revisoresDisponibles, revisoresAsignados);

            if (revisoresAsignados.size !== 3) {
                throw new Error(`No se pudieron asignar 3 revisores al artículo ${articulo.getTitulo()}`);
            }

            for (const revisor of revisoresAsignados) {
                articulo.agregarRevisor(revisor);
                revisoresDisponibles.set(revisor, revisoresDisponibles.get(revisor) - 1);
            }
        }
    }

    _asignarRevisoresPorNivel(articulo, nivelInteres, revisoresDisponibles, revisoresAsignados) {
        if (revisoresAsignados.size >= 3) return;

        for (const bid of articulo.getBids().values()) {
            if (bid.getInteres() === nivelInteres && revisoresDisponibles.get(bid.getRevisor()) > 0) {
                revisoresAsignados.add(bid.getRevisor());
                if (revisoresAsignados.size === 3) break;
            }
        }
    }
}


class SesionRegular extends Sesion {
    enviarArticulo(articulo) {
        if (!articulo.esArticuloRegular()) {
            throw new Error("Solo se pueden enviar artículos regulares a una sesión regular.");
        }
        super.enviarArticulo(articulo);
    }
}

class SesionWorkshop extends Sesion {
    enviarArticulo(articulo) {
        if (!articulo.esArticuloRegular() && !articulo.esArticuloPoster()) {
            throw new Error("Solo se pueden enviar artículos regulares o posters a una sesión de workshop");
        }
        super.enviarArticulo(articulo);
    }
}

class SesionPoster extends Sesion {
    enviarArticulo(articulo) {
        if (!articulo.esArticuloPoster()) {
            throw new Error("Solo se pueden enviar posters a una sesión de posters.");
        }
        super.enviarArticulo(articulo);
    }
}

module.exports = {
    EtapaSesion,
    EstrategiaSeleccion,
    EstrategiaCorteFijo,
    EstrategiaUmbral,
    Sesion,
    SesionRegular,
    SesionWorkshop,
    SesionPoster
};
