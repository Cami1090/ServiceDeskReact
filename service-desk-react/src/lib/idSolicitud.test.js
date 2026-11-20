import test from 'node:test';
import assert from 'node:assert/strict';
import { idValido } from './idSolicitud.js';

test('acepta identificadores enteros positivos como texto', () => {
  assert.equal(idValido('1'), true);
  assert.equal(idValido('24'), true);
  assert.equal(idValido('9'.repeat(18)), true);
});

test('rechaza entradas que no corresponden al contrato', () => {
  const invalidas = [undefined, null, 24, '', '0', '01', '-5', '12abc', ' 24 ', '1.5', '9'.repeat(19)];
  for (const entrada of invalidas) {
    assert.equal(idValido(entrada), false);
  }
});