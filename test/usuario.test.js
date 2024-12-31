const {Rol, Usuario} = require('../usuario.js');

let usuario_test;
beforeEach(() => {
    usuario_test = new Usuario(
        'Juan Pérez', 
        'UNLP',
        'jperez@unlp.edu.ar',
        '1234'
    );
});


test('crear_usuario_rol', () => {
    const usuario = new Usuario(
        'Juan Pérez', 
        'UNLP',
        'jperez@unlp.edu.ar',
        '1234'
    );
    expect(usuario.getNombre()).toBe('Juan Pérez');
    expect(usuario.getAfiliacion()).toBe('UNLP');
    expect(usuario.getEmail()).toBe('jperez@unlp.edu.ar');
    expect(usuario.getContrasena()).toBe('1234');
    expect(usuario.getRol()).toBeInstanceOf(Set); 
    expect(usuario.getRol().size).toBe(0);
});


test('agregar_rol_a_usuario', () => {
    usuario_test.agregarRol(Rol.CHAIR);

    expect(usuario_test.getRol().size).toBe(1);
    expect(usuario_test.getRol().has(Rol.CHAIR)).toBe(true);
    expect(usuario_test.esRevisor()).toBe(false);
});


test('agregar_tres_roles_a_usuario', () => {
    usuario_test.agregarRol(Rol.AUTOR);
    usuario_test.agregarRol(Rol.CHAIR);
    usuario_test.agregarRol(Rol.REVISOR);

    expect(usuario_test.getRol().size).toBe(3);
    expect(usuario_test.getRol().has(Rol.AUTOR)).toBe(true);
    expect(usuario_test.getRol().has(Rol.CHAIR)).toBe(true);
    expect(usuario_test.getRol().has(Rol.REVISOR)).toBe(true);
    expect(usuario_test.esRevisor()).toBe(true);
});