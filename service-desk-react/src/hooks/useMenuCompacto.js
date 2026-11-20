import { useState } from 'react';

const CLAVE = 'servicedesk:menu-compacto:v1';

function leerPreferencia() {
  try {
    return window.localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
}

export function useMenuCompacto() {
  const [compacto, setCompacto] = useState(leerPreferencia);

  function alternar() {
    const siguiente = !compacto;
    setCompacto(siguiente);
    try {
      window.localStorage.setItem(CLAVE, siguiente ? '1' : '0');
    } catch {
      return;
    }
  }

  return { compacto, alternar };
}