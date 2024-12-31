const {
    Articulo,
    ArticuloRegular,
    ArticuloPoster 
} = require('../articulo.js');
const Revision = require('../revision.js');
const {Rol, Usuario} = require('../usuario.js');


let articulo_regular_test;
let autor_notificacion;
let revisor_test

beforeEach(() => {
    autor_notificacion = new Usuario(
        'Juan Pérez', 
        'UNLP',
        'jperez@unlp.edu.ar',
        '1234'
    );

    revisor_test = new Usuario(
        'Marisa Bernal', 
        'UCA',
        'mgarcia@uca.edu.ar',
        '1234'
    );
    revisor_test.agregarRol(Rol.REVISOR);

    articulo_regular_test = new ArticuloRegular(
        'Título del artículo 1',
        'http://www.articulo1.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test.'
    );
    articulo_regular_test.agregarRevisor(revisor_test);


});


test('crear_revision_con_puntaje_positivo_valido', () => {
    const revision = new Revision(revisor_test, articulo_regular_test, 'Este es el comentario de la revisión', 3);
    
    expect(revision.getArticulo()).toBe(articulo_regular_test);
    expect(revision.getRevisor()).toBe(revisor_test);
    expect(revision.getComentario()).toBe('Este es el comentario de la revisión');
    expect(revision.getPuntaje()).toBe(3);
});


test('crear_revision_con_puntaje_negativo_valido', () => {
    const revision = new Revision(revisor_test, articulo_regular_test, 'Este es el comentario de la revisión', -3);
    
    expect(revision.getArticulo()).toBe(articulo_regular_test);
    expect(revision.getRevisor()).toBe(revisor_test);
    expect(revision.getComentario()).toBe('Este es el comentario de la revisión');
    expect(revision.getPuntaje()).toBe(-3);
});


test('crear_revision_con_puntaje_entero_fuera_de_rango', () => {
    expect(() => {
        new Revision(revisor_test, articulo_regular_test, 'Este es el comentario de la revisión', 4);
    }).toThrow("El puntaje debe ser un número entero entre -3 y 3");
});


test('crear_revision_con_puntaje_decimal', () => {
    expect(() => {
        new Revision(revisor_test, articulo_regular_test, 'Este es el comentario de la revisión', 3.5);
    }).toThrow("El puntaje debe ser un número entero entre -3 y 3");
});


test('crear_revision_con_puntaje_string', () => {
    expect(() => {
        new Revision(revisor_test, articulo_regular_test, 'Este es el comentario de la revisión', '3');
    }).toThrow("El puntaje debe ser un número entero entre -3 y 3");
});


test('crear_revision_con_revisor_con_rol_distinto_a_revisor', () => {
    expect(() => {
        new Revision(autor_notificacion, articulo_regular_test, 'Este es el comentario de la revisión', 0);
    }).toThrow("El revisor debe ser un Usuario con rol de revisor");
});



