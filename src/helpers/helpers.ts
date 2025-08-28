// Determinar la clase CSS basada en el presupuesto restante
export const obtenerClasePresupuesto = (presupuesto: number, restante: number): string => {
  const porcentajeRestante = presupuesto > 0 ? (restante / presupuesto) * 100 : 0;

  if (porcentajeRestante < 25) {
    return 'alert alert-danger';
  } else if (porcentajeRestante < 50) {
    return 'alert alert-warning';
  } else {
    return 'alert alert-success';
  }
};

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

// Obtener resumen de gastos por categoría
export const obtenerResumenCategorias = (gastos: Array<{ categoria: string; cantidad: number }>) => {
  return gastos.reduce(
    (resumen, gasto) => {
      if (!resumen[gasto.categoria]) {
        resumen[gasto.categoria] = {
          total: 0,
          cantidad: 0,
        };
      }

      resumen[gasto.categoria].total += gasto.cantidad;
      resumen[gasto.categoria].cantidad += 1;

      return resumen;
    },
    {} as Record<string, { total: number; cantidad: number }>
  );
};

// Truncar texto si es muy largo
export const truncarTexto = (texto: string, longitudMaxima: number = 30): string => {
  return texto.length > longitudMaxima ? `${texto.substring(0, longitudMaxima)}...` : texto;
};
