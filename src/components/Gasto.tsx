import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { formatearMoneda } from '../helpers/helpers';
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
          <span className="gasto-cantidad">{formatearMoneda(gasto.cantidad)}</span>
        </div>
        <div className="gasto-detalles">
          <Tag value={gasto.categoria} severity="info" />
          <span>{formatearFecha(gasto.fecha)}</span>
        </div>
      </div>
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        aria-label={`Eliminar gasto ${gasto.nombre}`}
        onClick={() => onEliminar(gasto.id)}
      />
    </li>
  );
};
