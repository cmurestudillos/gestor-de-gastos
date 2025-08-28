import type { GastoProps } from '../models/GastoProps';

export const Gasto = ({ gasto, onEliminar }: GastoProps) => {
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <li className="gasto-item">
      <div className="gasto-info">
        <div className="gasto-header">
          <h4>{gasto.nombre}</h4>
          <span className="gasto-cantidad">€{gasto.cantidad.toFixed(2)}</span>
        </div>
        <div className="gasto-detalles">
          <small className="gasto-categoria">{gasto.categoria}</small>
          <small className="gasto-fecha">{formatearFecha(gasto.fecha)}</small>
        </div>
      </div>
      <button
        className="btn-accion btn-eliminar-pequeno"
        onClick={() => onEliminar(gasto.id)}
        title={`Eliminar gasto: ${gasto.nombre}`}
        aria-label={`Eliminar gasto ${gasto.nombre}`}>
        ✕
      </button>
    </li>
  );
};
