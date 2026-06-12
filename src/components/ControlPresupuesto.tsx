import { ProgressBar } from 'primereact/progressbar';
import { formatearMoneda } from '../helpers/helpers';
import type { ControlPresupuestoProps } from '../models/ControlPresupuestoProps';

export const ControlPresupuesto = ({ presupuesto, restante }: ControlPresupuestoProps) => {
  const gastado = presupuesto - restante;
  const porcentajeGastado = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;

  const colorProgreso = porcentajeGastado > 90 ? '#ef4444' : porcentajeGastado > 75 ? '#f59e0b' : '#22c55e';

  return (
    <div className="control-presupuesto">
      <div className="control-stats">
        <div className="control-stat">
          <span className="label">Presupuesto</span>
          <span className="valor">{formatearMoneda(presupuesto)}</span>
        </div>
        <div className="control-stat">
          <span className="label">Gastado</span>
          <span className="valor money-spent">{formatearMoneda(gastado)}</span>
        </div>
        <div className="control-stat">
          <span className="label">Restante</span>
          <span className={`valor ${restante < 0 ? 'money-negative' : 'money-positive'}`}>
            {formatearMoneda(restante)}
          </span>
        </div>
      </div>

      <div>
        <ProgressBar
          value={Math.min(porcentajeGastado, 100)}
          showValue={false}
          color={colorProgreso}
          style={{ height: '10px' }}
        />
        <div className="progreso-info">
          <span>{porcentajeGastado.toFixed(1)}% utilizado</span>
          <span>{Math.max(100 - porcentajeGastado, 0).toFixed(1)}% disponible</span>
        </div>
      </div>
    </div>
  );
};
