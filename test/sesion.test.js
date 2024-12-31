const {
    Articulo,
    ArticuloRegular,
    ArticuloPoster 
} = require('../articulo.js');
const {InteresEnArticulo, Bid} = require('../bid.js');
const Revision = require('../revision.js');
const {
    EtapaSesion,
    EstrategiaSeleccion,
    EstrategiaCorteFijo,
    EstrategiaUmbral,
    Sesion,
    SesionRegular,
    SesionWorkshop,
    SesionPoster
} = require('../sesion.js');
const {Rol, Usuario} = require('../usuario.js');


let articulo_poster_test;
let articulo_regular_test;
let autor_test;
let autor_notificacion;
let estrategia_seleccion_umbral_test;
let estrategia_seleccion_corte_fijo_test;
let sesion_regular_cerrada_test;
let sesion_regular_abierta_test;
let sesion_regular_abierta_fecha_limite_hoy;
let sesion_workshop_abierta_fecha_limite_hoy;
let revision_articulo_regular_test_1;
let revision_articulo_regular_test_2;
let revision_articulo_regular_test_3;
let revision_articulo_poster_test_1;
let revision_articulo_poster_test_2;
let revision_articulo_poster_test_3;
let revisor_test_1;
let revisor_test_2;
let revisor_test_3;


beforeEach(() => {
    autor_notificacion = new Usuario(
        'Juan Pérez', 
        'UNLP',
        'jperez@unlp.edu.ar',
        '1234'
    );

    autor_test = new Usuario(
        'María García', 
        'UBA',
        'mgarcia@uba.edu.ar',
        '1234'
    );

    revisor_test_1 = new Usuario(
        'Marisa Bernal', 
        'UCA',
        'mbernal@uca.edu.ar',
        '1234'
    );
    revisor_test_1.agregarRol(Rol.REVISOR);

    revisor_test_2 = new Usuario(
        'Martín Bernal', 
        'UP',
        'mbernal@up.edu.ar',
        '1234'
    );
    revisor_test_2.agregarRol(Rol.REVISOR);

    revisor_test_3 = new Usuario(
        'Mariana Bernal', 
        'UNTREF',
        'mbernal@untref.edu.ar',
        '1234'
    );
    revisor_test_3.agregarRol(Rol.REVISOR);

    articulo_regular_test = new ArticuloRegular(
        'Título del artículo 1',
        'http://www.articulo1.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test.'
    );

    articulo_poster_test = new ArticuloPoster(
        'Título del póster 1',
        'http://www.poster1.com',
        autor_notificacion,
        'http://www.fuente-poster1.com'
    );
    
    sesion_regular_cerrada_test = new SesionRegular('2024-12-01', 5);
    sesion_regular_abierta_test = new SesionRegular('2025-12-01', 2);

    let fecha_limite_recepcion = new Date();
    fecha_limite_recepcion.setHours(0, 0, 0, 0);
    sesion_regular_abierta_fecha_limite_hoy = new SesionRegular(
        fecha_limite_recepcion,
        5
    );

    sesion_workshop_abierta_fecha_limite_hoy = new SesionWorkshop(
        fecha_limite_recepcion,
        5
    );

    revision_articulo_regular_test_1 = new Revision(revisor_test_1, articulo_regular_test, 'Este es el comentario de la revisión', 2);
    revision_articulo_regular_test_2 = new Revision(revisor_test_2, articulo_regular_test, 'Este es el comentario de la revisión', 2);
    revision_articulo_regular_test_3 = new Revision(revisor_test_3, articulo_regular_test, 'Este es el comentario de la revisión', 2);
    revision_articulo_poster_test_1 = new Revision(revisor_test_1, articulo_poster_test, 'Este es el comentario de la revisión', 3);
    revision_articulo_poster_test_2 = new Revision(revisor_test_2, articulo_poster_test, 'Este es el comentario de la revisión', 3);
    revision_articulo_poster_test_3 = new Revision(revisor_test_3, articulo_poster_test, 'Este es el comentario de la revisión', 3);

    estrategia_seleccion_umbral_test = new EstrategiaUmbral(6);
    estrategia_seleccion_corte_fijo_test = new EstrategiaCorteFijo(50);
});


test('crear_sesion', () => {
    try {
        const sesion = new Sesion('2024-12-01', 5);
    } catch (error) {
        expect(error.message).toBe("No se puede instanciar una clase abstracta: Sesion");
    }
});


test('crear_sesion_regular', () => {
    const sesion = new SesionRegular('2024-12-01', 5);

    expect(sesion.getFechaLimiteRecepcion().toISOString().split('T')[0]).toBe('2024-12-01');
    expect(sesion.getMaximaCantidadArticulosAceptados()).toBe(5);
    expect(sesion.getArticulos()).toEqual([]);
    expect(sesion.getEtapa()).toBe(EtapaSesion.RECEPCION);
});


test('crear_sesion_workshop', () => {
    const sesion = new SesionWorkshop('2024-12-02', 2);

    expect(sesion.getFechaLimiteRecepcion().toISOString().split('T')[0]).toBe('2024-12-02');
    expect(sesion.getMaximaCantidadArticulosAceptados()).toBe(2);
    expect(sesion.getArticulos()).toEqual([]);
    expect(sesion.getEtapa()).toBe(EtapaSesion.RECEPCION);
});


test('crear_sesion_poster', () => {
    const sesion = new SesionPoster('2024-12-03', 3);

    expect(sesion.getFechaLimiteRecepcion().toISOString().split('T')[0]).toBe('2024-12-03');
    expect(sesion.getMaximaCantidadArticulosAceptados()).toBe(3);
    expect(sesion.getArticulos()).toEqual([]);
    expect(sesion.getEtapa()).toBe(EtapaSesion.RECEPCION);
});


test('enviar_articulo_sesion_regular_después_de_fecha_limite', () => {
    expect(() => {
        sesion_regular_cerrada_test.enviarArticulo(articulo_regular_test);
    }).toThrow("La sesión no está abierta");
    expect(sesion_regular_cerrada_test.getArticulos()).toEqual([]);
});


test('enviar_articulo_sesion_regular_antes_de_fecha_limite', () => {
    sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);

    expect(sesion_regular_abierta_test.getArticulos()).toEqual([articulo_regular_test]);
});


test('enviar_max_cantidad_permitida_de_articulo_a_sesion_regular_antes_de_fecha_limite', () => {
    sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);

    expect(sesion_regular_abierta_test.getArticulos().length).toBe(2);
});


test('enviar_mas_de_max_cantidad_permitida_de_articulo_a_sesion_regular_antes_de_fecha_limite', () => {
    sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);

    expect(() => {
        sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);
    }).toThrow("La cantidad máxima de artículos aceptados ha sido alcanzada");
    expect(sesion_regular_abierta_test.getArticulos().length).toBe(2);
});


test('aceptar_articulo_que_cumple_con_los_lineamientos', () => {
    sesion_regular_abierta_test.enviarArticulo(articulo_regular_test);

    expect(sesion_regular_abierta_test.aceptarArticulo(articulo_regular_test)).toBe(true);
}); 


test('iniciar_etapa_bidding_antes_de_fecha_limite_recepcion', () => {
    expect(() => {
        sesion_regular_abierta_test.setEtapa(EtapaSesion.BIDDING);
    }).toThrow("La etapa de bidding no puede comenzar antes de la fecha límite de recepción");
    expect(sesion_regular_abierta_test.getEtapa()).toBe(EtapaSesion.RECEPCION);
});


test('sesion_regular_pasa_de_recepcion_a_etapa_bidding', () => {
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);

    expect(sesion_regular_abierta_fecha_limite_hoy.getEtapa()).toBe(EtapaSesion.BIDDING);
});


test('sesion_regular_pasa_a_etapa_revision_sin_haber_pasado_por_bidding', () => {
    expect(() => {
        sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    }).toThrow("La etapa de revisión no puede comenzar antes de la etapa de bidding");
    
    expect(sesion_regular_abierta_fecha_limite_hoy.getEtapa()).toBe(EtapaSesion.RECEPCION);
});


test('sesion_regular_pasa_a_etapa_revision_después_de_haber_pasado_por_bidding', () => {
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);

    expect(sesion_regular_abierta_fecha_limite_hoy.getEtapa()).toBe(EtapaSesion.REVISION);
});


test('agregar_bid_a_articulo_en_sesion_regular', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);

    const articulo_sesion = sesion_regular_abierta_fecha_limite_hoy.getArticulos()[0];

    expect(sesion_regular_abierta_fecha_limite_hoy.getEtapa()).toBe(EtapaSesion.BIDDING);
    expect(articulo_sesion._bids.get(revisor_test_1._email)._articulo).toEqual(articulo_regular_test);
    expect(articulo_sesion._bids.get(revisor_test_1._email)._revisor).toEqual(revisor_test_1);
    expect(articulo_sesion._bids.get(revisor_test_1._email)._interes).toBe(InteresEnArticulo.INTERESADO);
});


test('agregar_bid_a_articulo_en_sesion_regular_sin_haber_pasado_por_bidding', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);

    expect(() => {
        sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);
    }).toThrow("La etapa de bidding no está activa");
});


test('agregar_bid_a_articulo_en_sesion_regular_con_etapa_revision_activa', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);

    expect(() => {
        sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);
    }).toThrow("La etapa de bidding no está activa");
});


test('asignar_revisor_en_etapa_distinta_de_revision', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);

    expect(() => {
        sesion_regular_abierta_fecha_limite_hoy._asignarRevisores();
    }).toThrow("La etapa de revisión no está activa");
});


test('consultar_revisores_de_sesion_regular_a_partir_del_bid', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);

    const revisores = sesion_regular_abierta_fecha_limite_hoy._obtenerTodosRevisores()
    
    expect(revisores.length).toBe(1);
    expect(revisores[0]).toEqual(revisor_test_1);
});


test('asignar_revisores_solo_hay_un_revisor', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);

    expect(() => {
        sesion_regular_abierta_fecha_limite_hoy._asignarRevisores();
    }).toThrow(`No se pudieron asignar 3 revisores al artículo ${articulo_regular_test.getTitulo()}`);
});

test('asignar_revisores_cada_revisor_tiene_1_revision', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_2, InteresEnArticulo.QUIZAS);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    sesion_regular_abierta_fecha_limite_hoy._asignarRevisores();

    expect(articulo_regular_test._revisores.size).toBe(3);
    expect(articulo_regular_test._revisores).toContain(revisor_test_1);
    expect(articulo_regular_test._revisores).toContain(revisor_test_2);
    expect(articulo_regular_test._revisores).toContain(revisor_test_3);
});


test('asignar_revisores_cada_revisor_tiene_2_articulos', () => {
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_poster_test);

    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    
    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    sesion_workshop_abierta_fecha_limite_hoy._asignarRevisores();

    expect(articulo_regular_test._revisores.size).toBe(3);
    expect(articulo_regular_test._revisores).toContain(revisor_test_1);
    expect(articulo_regular_test._revisores).toContain(revisor_test_2);
    expect(articulo_regular_test._revisores).toContain(revisor_test_3);

    expect(articulo_poster_test._revisores.size).toBe(3);
    expect(articulo_poster_test._revisores).toContain(revisor_test_1);
    expect(articulo_poster_test._revisores).toContain(revisor_test_2);
    expect(articulo_poster_test._revisores).toContain(revisor_test_3);
});


test('agregar_revision_a_articulo_en_sesion_regular', () => {
    sesion_regular_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.INTERESADO);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_2, InteresEnArticulo.QUIZAS);
    sesion_regular_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    sesion_regular_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    sesion_regular_abierta_fecha_limite_hoy._asignarRevisores();

    sesion_regular_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_1);

    expect(articulo_regular_test.getRevisiones().length).toBe(1);
    expect(articulo_regular_test.getRevisiones()).toEqual([revision_articulo_regular_test_1]);
    
});


test('sesion_tiene_estrategia_seleccion_por_defecto_umbral', () => {
    expect(sesion_regular_abierta_fecha_limite_hoy.getEstrategiaSeleccion()).toBeInstanceOf(EstrategiaUmbral);
});


test('asignar_estrategia_de_seleccion_invalida', () => {
    expect(() => {
        sesion_regular_abierta_fecha_limite_hoy.setEstrategiaSeleccion(articulo_regular_test);
    }).toThrow("La estrategia debe ser una instancia de EstrategiaSeleccion");
});


test('asignar_estrategia_de_seleccion_valida', () => {
    sesion_regular_abierta_fecha_limite_hoy.setEstrategiaSeleccion(new EstrategiaCorteFijo(3));

    expect(sesion_regular_abierta_fecha_limite_hoy.getEstrategiaSeleccion()).toBeInstanceOf(EstrategiaCorteFijo);
});


test('seleccionar_articulos_en_una_etapa_distinta_a_seleccion', () => {
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_poster_test);

    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    
    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    sesion_workshop_abierta_fecha_limite_hoy._asignarRevisores();
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_1);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_1);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_2);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_2);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_3);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_3);
        
    expect(() => {
        sesion_workshop_abierta_fecha_limite_hoy.seleccionarArticulos();
    }).toThrow("Los artículos solo se pueden seleccionar en la etapa de selección");

});


test('seleccionar_articulos_en_etapa_de_seleccion_estrategia_umbral', () => {
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_poster_test);

    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    
    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    sesion_workshop_abierta_fecha_limite_hoy._asignarRevisores();
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_1);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_1);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_2);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_2);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_3);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_3);
    
    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.SELECCION);
    sesion_workshop_abierta_fecha_limite_hoy.setEstrategiaSeleccion(estrategia_seleccion_umbral_test);
    
    const articulos_seleccionados = sesion_workshop_abierta_fecha_limite_hoy.seleccionarArticulos();

    expect(articulos_seleccionados.length).toBe(2);

});


test('seleccionar_articulos_en_etapa_de_seleccion_estrategia_corte_fijo', () => {
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_regular_test);
    sesion_workshop_abierta_fecha_limite_hoy.enviarArticulo(articulo_poster_test);

    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.BIDDING);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_regular_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_1, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_2, InteresEnArticulo.NO_INTERESADO);
    sesion_workshop_abierta_fecha_limite_hoy.agregarBid(articulo_poster_test, revisor_test_3, InteresEnArticulo.NO_INTERESADO);
    
    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.REVISION);
    sesion_workshop_abierta_fecha_limite_hoy._asignarRevisores();
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_1);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_1);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_2);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_2);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_regular_test, revision_articulo_regular_test_3);
    sesion_workshop_abierta_fecha_limite_hoy.agregarRevisionPorArticulo(articulo_poster_test, revision_articulo_poster_test_3);
    
    sesion_workshop_abierta_fecha_limite_hoy.setEtapa(EtapaSesion.SELECCION);
    sesion_workshop_abierta_fecha_limite_hoy.setEstrategiaSeleccion(estrategia_seleccion_corte_fijo_test);
    
    const articulos_seleccionados = sesion_workshop_abierta_fecha_limite_hoy.seleccionarArticulos();

    expect(articulos_seleccionados.length).toBe(1);
});