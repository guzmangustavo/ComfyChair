const {
    Articulo,
    ArticuloRegular,
    ArticuloPoster 
} = require('../articulo.js');
const {InteresEnArticulo, Bid} = require('../bid.js');
const {Rol, Usuario} = require('../usuario.js');


let articulo_regular_test;
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
    autor_test.agregarRol(Rol.REVISOR);

    articulo_regular_test = new ArticuloRegular(
        'Título del artículo 1',
        'http://www.articulo1.com',
        autor_notificacion, 
        'Este es el abstract de un artículo regular de test.'
    );

    bid_test = new Bid(autor_test, articulo_regular_test, InteresEnArticulo.INTERESADO);
});


test('Crear un bid con un usuario no revisor', () => {
    const usuario_no_revisor = new Usuario(
        'Juan Pérez', 
        'UNLP',
        'jperez@unlp.edu.ar',
        '1234'
    );
    expect(() => {
        new Bid(usuario_no_revisor, articulo_regular_test, InteresEnArticulo.INTERESADO);
    }).toThrow("El revisor debe ser un Usuario con rol de revisor");
});


test('Crear un bid con un tipo de interés no válido', () => {
    expect(() => {
        new Bid(autor_test, articulo_regular_test, 'Indefinido');
    }).toThrow("Tipo de interés en artículo no válido");
});


test('Crear un bid con un usuario revisor y un tipo de interés válido', () => {
    const bid = new Bid(autor_test, articulo_regular_test, InteresEnArticulo.INTERESADO);
    expect(bid._revisor).toBe(autor_test);
    expect(bid._articulo).toBe(articulo_regular_test);
    expect(bid._interes).toBe(InteresEnArticulo.INTERESADO);
});


test('Actualizar el interés de un bid', () => {
    bid_test.actualizarInteres(InteresEnArticulo.QUIZAS);
    expect(bid_test._interes).toBe(InteresEnArticulo.QUIZAS);
});
