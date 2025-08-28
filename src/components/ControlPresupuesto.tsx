import { obtenerClasePresupuesto } from '../helpers/helpers';
import type { ControlPresupuestoProps } from '../models/ControlPresupuestoProps';

export const ControlPresupuesto = ({
  presupuesto,
  restante,
  onResetear,
  esMultiple = false,
}: ControlPresupuestoProps) => {
  const gastado = presupuesto - restante;
  const porcentajeGastado = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;

  return (
    <div className="control-presupuesto">
      <div className="alert alert-primary">
        <strong>Presupuesto:</strong> €{presupuesto.toFixed(2)}
      </div>

      <div className={obtenerClasePresupuesto(presupuesto, restante)}>
        <strong>Restante:</strong> €{restante.toFixed(2)}
      </div>

      <div className="alert alert-info">
        <strong>Gastado:</strong> €{gastado.toFixed(2)} ({porcentajeGastado.toFixed(1)}%)
      </div>

      {/* Barra de progreso */}
      <div className="progreso">
        <div className="barra-progreso">
          <div
            className="progreso-fill"
            style={{
              width: `${Math.min(porcentajeGastado, 100)}%`,
              backgroundColor: porcentajeGastado > 75 ? '#dc3545' : porcentajeGastado > 50 ? '#ffc107' : '#28a745',
            }}
          />
        </div>
        <small>{porcentajeGastado.toFixed(1)}% del presupuesto utilizado</small>
      </div>

      {!esMultiple && (
        <button className="btn-resetear" onClick={onResetear} title="Resetear aplicación">
          Nuevo Presupuesto
        </button>
      )}
    </div>
  );
};
