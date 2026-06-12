// Formatear moneda
export const formatearMoneda = (cantidad: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cantidad);
};

// Validar que un string sea un número válido
export const esNumeroValido = (valor: string): boolean => {
  const numero = Number(valor);
  return !isNaN(numero) && numero > 0 && isFinite(numero);
};
