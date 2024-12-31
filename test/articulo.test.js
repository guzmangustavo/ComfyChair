const {
    Articulo,
    ArticuloRegular,
    ArticuloPoster 
} = require('../articulo.js');
const {InteresEnArticulo, Bid} = require('../bid.js');
const Revision = require('../revision.js');
const {Rol, Usuario} = require('../usuario.js');


let articulo_poster_test;
let articulo_regular_test;
let articulo_regular_con_revisor_test;
let articulo_regular_con_revisor_y_bid_test;
let autor_test;
let autor_notificacion;

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

    revisor_test = new Usuario(
        'Marisa Bernal', 
        'UCA',
        'mgarcia@uca.edu.ar',
        '1234'
    );

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

    articulo_regular_con_revisor_test = new ArticuloRegular(
        'Título del artículo con revisor',
        'http://www.articulo-con-revisor.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test con revisor.'
    );
    articulo_regular_con_revisor_test.agregarRevisor(revisor_test);

    articulo_regular_con_revisor_y_bid_test = new ArticuloRegular(
        'Título del artículo con revisor',
        'http://www.articulo-con-revisor.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test con revisor.'
    );
    articulo_regular_con_revisor_y_bid_test.agregarRevisor(revisor_test);
    articulo_regular_con_revisor_y_bid_test.agregarBid(revisor_test, InteresEnArticulo.QUIZAS);

    revision_test = new Revision(revisor_test, articulo_regular_test, 'Este es el comentario de la revisión', 2);
});


test('crear_articulo', () => {
    expect(() => {
        const articulo = new Articulo(
            'Título del artículo 1',
            'http://www.articulo1.com',
            autor_notificacion
        );
    }).toThrowError("No se puede instanciar una clase abstracta: Articulo");
});


test('crear_articulo_sin_autor_notificaciones', () => {
    expect(() => {
        const articulo = new ArticuloRegular(
            'Título del artículo 1',
            'http://www.articulo1.com',
            null, 
            'Este es el abstract de un artículo regular de test.'
        );
    }).toThrowError("autorNotificaciones debe ser una instancia de la clase Usuario");
});


test('crear_articulo_regular', () => {
    const articulo_regular = new ArticuloRegular(
        'Título del artículo 1',
        'http://www.articulo1.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test.'
    );

    expect(articulo_regular.getTitulo()).toBe('Título del artículo 1');
    expect(articulo_regular.getUrlArchivo()).toBe('http://www.articulo1.com');
    expect(articulo_regular.getAutorNotificaciones()).toBe(autor_notificacion);
    expect(articulo_regular.getLimiteRevisiones()).toBe(3);
    expect(articulo_regular.getLimitePalabras()).toBe(300);
    expect(articulo_regular.getResumen()).toBe('Este es el abstract de un artículo regular de test.');
    expect(articulo_regular.getAutores()).toEqual([autor_notificacion]);
    expect(articulo_regular.getRevisores().size).toBe(0);
    expect(articulo_regular.getRevisiones()).toEqual([]);

    expect(articulo_regular.validarArticulo()).toBe(true);
});


test ('agregar_autor_a_articulo_regular', () => {
    articulo_regular_test.agregarAutor(autor_test);
    expect(articulo_regular_test._autores).toEqual([autor_notificacion, autor_test]);
});


test('crear_articulo_regular_sin_titulo', () => {
    const articulo_regular = new ArticuloRegular(
        '',
        'http://www.articulo1.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test.'
    );

    expect(articulo_regular.getTitulo()).toBe('');
    expect(articulo_regular.getUrlArchivo()).toBe('http://www.articulo1.com');
    expect(articulo_regular.getAutorNotificaciones()).toBe(autor_notificacion);
    expect(articulo_regular.getLimiteRevisiones()).toBe(3);
    expect(articulo_regular.getLimitePalabras()).toBe(300);
    expect(articulo_regular.getResumen()).toBe('Este es el abstract de un artículo regular de test.');
    expect(articulo_regular.getAutores()).toEqual([autor_notificacion]);
    expect(articulo_regular.getRevisores().size).toBe(0);
    expect(articulo_regular.getRevisiones()).toEqual([]);

    expect(articulo_regular.validarTitulo()).toBe(false);
    expect(articulo_regular.validarCantidadAutores()).toBe(true);
    expect(articulo_regular.validarResumen()).toBe(true);

    expect(articulo_regular.validarArticulo()).toBe(false);
});


test('crear_articulo_regular_resumen_vacio', () => {
    const articulo_regular = new ArticuloRegular(
        'Título del artículo 1',
        'http://www.articulo1.com',
        autor_notificacion, 
        ''
    );

    expect(articulo_regular.getTitulo()).toBe('Título del artículo 1');
    expect(articulo_regular.getUrlArchivo()).toBe('http://www.articulo1.com');
    expect(articulo_regular.getAutorNotificaciones()).toBe(autor_notificacion);
    expect(articulo_regular.getLimiteRevisiones()).toBe(3);
    expect(articulo_regular.getLimitePalabras()).toBe(300);
    expect(articulo_regular.getResumen()).toBe('');
    expect(articulo_regular.getAutores()).toEqual([autor_notificacion]);
    expect(articulo_regular.getRevisores().size).toBe(0);
    expect(articulo_regular.getRevisiones()).toEqual([]);

    expect(articulo_regular.validarTitulo()).toBe(true);
    expect(articulo_regular.validarCantidadAutores()).toBe(true);
    expect(articulo_regular.validarResumen()).toBe(false);

    expect(articulo_regular.validarArticulo()).toBe(false);

});


test('crear_articulo_regular_resumen_300_palabras', () => {
    const articulo_regular = new ArticuloRegular(
        'Título del artículo 1',
        'http://www.articulo1.com',
        autor_notificacion, 
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus placeat facere placeat facere placeat facere placeat facere placeat facere placeat facere.'
    );

    expect(articulo_regular.getTitulo()).toBe('Título del artículo 1');
    expect(articulo_regular.getUrlArchivo()).toBe('http://www.articulo1.com');
    expect(articulo_regular.getAutorNotificaciones()).toBe(autor_notificacion);
    expect(articulo_regular.getLimiteRevisiones()).toBe(3);
    expect(articulo_regular.getLimitePalabras()).toBe(300);
    expect(articulo_regular.getResumen()).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus placeat facere placeat facere placeat facere placeat facere placeat facere placeat facere.');
    expect(articulo_regular.getAutores()).toEqual([autor_notificacion]);
    expect(articulo_regular.getRevisores().size).toBe(0);
    expect(articulo_regular.getRevisiones()).toEqual([]);

    expect(articulo_regular.validarTitulo()).toBe(true);
    expect(articulo_regular.validarCantidadAutores()).toBe(true);
    expect(articulo_regular.validarResumen()).toBe(false);

    expect(articulo_regular.validarArticulo()).toBe(false);

    expect(articulo_regular.esArticuloRegular()).toBe(true);
    expect(articulo_regular.esArticuloPoster()).toBe(false);

});


test('crear_articulo_poster', () => {
    const articulo_poster = new ArticuloPoster(
        'Título del póster 1',
        'http://www.poster1.com',
        autor_notificacion,
        'http://www.fuente-poster1.com'
    );

    expect(articulo_poster.getTitulo()).toBe('Título del póster 1');
    expect(articulo_poster.getUrlArchivo()).toBe('http://www.poster1.com');
    expect(articulo_poster.getAutorNotificaciones()).toBe(autor_notificacion);
    expect(articulo_poster.getLimiteRevisiones()).toBe(3);
    expect(articulo_poster._limite_palabras).toBe(undefined);
    expect(articulo_poster.getUrlArchivoFuente()).toBe('http://www.fuente-poster1.com');
    expect(articulo_poster.getAutores()).toEqual([autor_notificacion]);
    expect(articulo_poster.getRevisores().size).toBe(0);
    expect(articulo_poster.getRevisiones()).toEqual([]);

    expect(articulo_poster.validarArticulo()).toBe(true);

    expect(articulo_poster.esArticuloRegular()).toBe(false);
    expect(articulo_poster.esArticuloPoster()).toBe(true);
});


test ('agregar_autor_a_articulo_poster', () => {
    articulo_poster_test.agregarAutor(autor_test);
    
    expect(articulo_poster_test.getAutores()).toEqual([autor_notificacion, autor_test]);
});


test('agregar_revisor_a_articulo', () => {
    articulo_regular_test.agregarRevisor(revisor_test);

    expect(articulo_regular_test.getRevisores().size).toBe(1);
    expect(articulo_regular_test.getRevisores().has(revisor_test)).toBe(true);
    expect(revisor_test.getRol().has(Rol.REVISOR)).toBe(true);
});


test('agregar_bid_a_articulo_regular', () => {
    articulo_regular_con_revisor_test.agregarBid(revisor_test, InteresEnArticulo.INTERESADO);

    expect(articulo_regular_con_revisor_test._bids.size).toBe(1);
    expect(articulo_regular_con_revisor_test._bids.get(revisor_test._email)._articulo).toEqual(articulo_regular_con_revisor_test);
    expect(articulo_regular_con_revisor_test._bids.get(revisor_test._email)._revisor).toEqual(revisor_test);
    expect(articulo_regular_con_revisor_test._bids.get(revisor_test._email)._interes).toBe(InteresEnArticulo.INTERESADO);
    expect(articulo_regular_con_revisor_y_bid_test.getBids().size).toBe(1);
});


test('agregar_bid_a_articulo_regular_que_ya_tiene_bid', () => {
    articulo_regular_con_revisor_y_bid_test.agregarBid(revisor_test, InteresEnArticulo.INTERESADO);

    expect(articulo_regular_con_revisor_y_bid_test._bids.size).toBe(1);
    expect(articulo_regular_con_revisor_y_bid_test._bids.get(revisor_test._email)._articulo).toEqual(articulo_regular_con_revisor_y_bid_test);
    expect(articulo_regular_con_revisor_y_bid_test._bids.get(revisor_test._email)._revisor).toEqual(revisor_test);
    expect(articulo_regular_con_revisor_y_bid_test._bids.get(revisor_test._email)._interes).toBe(InteresEnArticulo.INTERESADO);

    expect(articulo_regular_con_revisor_y_bid_test.getBids().size).toBe(1);

    articulo_regular_con_revisor_y_bid_test.agregarBid(revisor_test, InteresEnArticulo.NO_INTERESADO);

    expect(articulo_regular_con_revisor_y_bid_test._bids.size).toBe(1);
    expect(articulo_regular_con_revisor_y_bid_test._bids.get(revisor_test._email)._articulo).toEqual(articulo_regular_con_revisor_y_bid_test);
    expect(articulo_regular_con_revisor_y_bid_test._bids.get(revisor_test._email)._revisor).toEqual(revisor_test);
    expect(articulo_regular_con_revisor_y_bid_test._bids.get(revisor_test._email)._interes).toBe(InteresEnArticulo.NO_INTERESADO);

    expect(articulo_regular_con_revisor_y_bid_test.getBids().size).toBe(1);
});


test('consultar_bid_de_articulo_regular_existente', () => {
    expect(articulo_regular_con_revisor_y_bid_test.getBids().size).toBe(1);
    expect(articulo_regular_con_revisor_y_bid_test.getBids().get(revisor_test._email)._interes).toBe(InteresEnArticulo.QUIZAS);
    expect(articulo_regular_con_revisor_y_bid_test.getBids().get(revisor_test._email)._articulo).toEqual(articulo_regular_con_revisor_y_bid_test);
    expect(articulo_regular_con_revisor_y_bid_test.getBids().get(revisor_test._email)._revisor).toEqual(revisor_test);
});


test('agregar_revision_a_articulo', () => {
    articulo_regular_con_revisor_test.agregarRevision(revision_test);

    expect(articulo_regular_con_revisor_test.getRevisiones().length).toBe(1);
    expect(articulo_regular_con_revisor_test.getRevisiones()[0]).toEqual(revision_test);
    expect(articulo_regular_con_revisor_test.sumarPuntajeRevisiones()).toBe(2);
});


test('agregar_revision_a_articulo_con_limite_alcanzado', () => {
    articulo_regular_con_revisor_test.agregarRevision(revision_test);
    articulo_regular_con_revisor_test.agregarRevision(revision_test);
    articulo_regular_con_revisor_test.agregarRevision(revision_test);

    expect(
        () => articulo_regular_con_revisor_test.agregarRevision(revision_test)
    ).toThrowError("El artículo ya tiene la cantidad máxima de revisiones");
    expect(articulo_regular_con_revisor_test.getRevisiones().length).toBe(3);
    expect(articulo_regular_con_revisor_test.sumarPuntajeRevisiones()).toBe(6);
});


test('sumar_puntaje_articulo_sin_revisiones', () => {
    expect(articulo_regular_test.sumarPuntajeRevisiones()).toBe(0);
});