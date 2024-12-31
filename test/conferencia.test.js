const Conferencia = require('../conferencia.js');
const {
    Sesion,
    SesionRegular,
    SesionWorkshop,
    SesionPoster
} = require('../sesion.js');
const {Rol, Usuario} = require('../usuario.js');


let conferencia_test;
let sesion_regular_test;
let usuario_test;


beforeEach(() => {
    usuario_test = new Usuario(
        'Juan Pérez', 
        'UNLP',
        'jperez@unlp.edu.ar',
        '1234',
    );
    conferencia_test = new Conferencia();
    sesion_regular_test = new SesionRegular('2024-12-01', 5);

});


test('crear_conferencia', () => {
    const conferencia = new Conferencia();
    
    expect(conferencia._chairs).toEqual([]);
    expect(conferencia._revisores).toEqual([]);
    expect(conferencia._sesiones).toEqual([]);
});


test('agregar_chair_a_conferencia', () => {
    conferencia_test.agregarChair(usuario_test);

    expect(conferencia_test._chairs).toEqual([usuario_test]);
    expect(conferencia_test._revisores).toEqual([]);
    expect(conferencia_test._sesiones).toEqual([]);
});


test('agregar_revisor_a_conferencia', () => {
    conferencia_test.agregarRevisor(usuario_test);

    expect(conferencia_test._chairs).toEqual([]);
    expect(conferencia_test._revisores).toEqual([usuario_test]);
    expect(conferencia_test._sesiones).toEqual([]);    
});


test('agregar_sesion_a_conferencia', () => {
    conferencia_test.agregarSesion(sesion_regular_test);

    expect(conferencia_test._chairs).toEqual([]);
    expect(conferencia_test._revisores).toEqual([]);
    expect(conferencia_test._sesiones).toEqual([sesion_regular_test]);
});