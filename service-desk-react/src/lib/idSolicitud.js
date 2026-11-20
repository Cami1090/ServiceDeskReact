const entero = /^[1-9][0-9]{0,17}$/;

export function idValido(id) {
  return typeof id === 'string' && entero.test(id);
}