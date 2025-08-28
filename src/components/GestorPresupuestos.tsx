import { useState } from 'react';
import type { GestorPresupuestosProps } from '../models/GestorPresupuestosProps';
import type { PresupuestoEnEdicion } from '../models/PresupuestoEnEdicion';
import type { Presupuesto } from '../models/Presupuesto';

export const GestorPresupuestos = ({
  presupuestos,
  onSeleccionar,
  onModificar,
  onEliminar,
  onNuevo,
}: GestorPresupuestosProps) => {
  const [editando, setEditando] = useState<string | null>(null);
  const [formEdicion, setFormEdicion] = useState<PresupuestoEnEdicion>({
    id: '',
    nombre: '',
    cantidad: '',
  });

  const iniciarEdicion = (presupuesto: Presupuesto) => {
    setEditando(presupuesto.id);
    setFormEdicion({
      id: presupuesto.id,
      nombre: presupuesto.nombre,
      cantidad: presupuesto.cantidad.toString(),
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setFormEdicion({ id: '', nombre: '', cantidad: '' });
  };

  const guardarEdicion = () => {
    const cantidad = Number(formEdicion.cantidad);

    if (!formEdicion.nombre.trim() || isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, ingresa datos válidos');
      return;
    }

    onModificar(formEdicion.id, formEdicion.nombre.trim(), cantidad);
    setEditando(null);
  };

  const confirmarEliminacion = (presupuesto: Presupuesto) => {
    const totalGastos = presupuesto.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    const mensaje =
      totalGastos > 0
        ? `¿Estás seguro de eliminar "${presupuesto.nombre}"? Tiene ${presupuesto.gastos.length} gastos por un total de €${totalGastos.toFixed(2)}.`
        : `¿Estás seguro de eliminar "${presupuesto.nombre}"?`;

    if (confirm(mensaje)) {
      onEliminar(presupuesto.id);
    }
  };

  const calcularEstadisticas = (presupuesto: Presupuesto) => {
    const totalGastos = presupuesto.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    const restante = presupuesto.cantidad - totalGastos;
    const porcentajeUsado = presupuesto.cantidad > 0 ? (totalGastos / presupuesto.cantidad) * 100 : 0;

    return { totalGastos, restante, porcentajeUsado };
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (presupuestos.length === 0) {
    return (
      <div className="gestor-vacio">
        <div className="mensaje-vacio">
          <h2>¡Bienvenido!</h2>
          <p>No tienes presupuestos creados aún.</p>
          <button className="button-primary" onClick={onNuevo}>
            Crear Mi Primer Presupuesto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gestor-presupuestos">
      <div className="header-gestor">
        <h2>Mis Presupuestos</h2>
        <button className="button-primary btn-nuevo" onClick={onNuevo}>
          + Nuevo Presupuesto
        </button>
      </div>

      <div className="grid-presupuestos">
        {presupuestos.map(presupuesto => {
          const { totalGastos, restante, porcentajeUsado } = calcularEstadisticas(presupuesto);
          const esEditando = editando === presupuesto.id;

          return (
            <div key={presupuesto.id} className={`tarjeta-presupuesto ${presupuesto.activo ? 'activo' : ''}`}>
              {esEditando ? (
                <div className="edicion-presupuesto">
                  <input
                    type="text"
                    value={formEdicion.nombre}
                    onChange={e =>
                      setFormEdicion(prev => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    className="input-edicion"
                    placeholder="Nombre del presupuesto"
                  />
                  <input
                    type="number"
                    value={formEdicion.cantidad}
                    onChange={e =>
                      setFormEdicion(prev => ({
                        ...prev,
                        cantidad: e.target.value,
                      }))
                    }
                    className="input-edicion"
                    placeholder="Cantidad"
                    step="0.01"
                    min="0.01"
                  />
                  <div className="botones-edicion">
                    <button className="btn-guardar" onClick={guardarEdicion}>
                      ✓
                    </button>
                    <button className="btn-cancelar" onClick={cancelarEdicion}>
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="header-tarjeta">
                    <h3>{presupuesto.nombre}</h3>
                    {presupuesto.activo && <span className="badge-activo">Activo</span>}
                  </div>

                  <div className="stats-presupuesto">
                    <div className="stat">
                      <span className="label">Presupuesto:</span>
                      <span className="valor">€{presupuesto.cantidad.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Gastado:</span>
                      <span className="valor gastado">€{totalGastos.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Restante:</span>
                      <span className={`valor ${restante < 0 ? 'negativo' : 'positivo'}`}>€{restante.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="progreso-mini">
                    <div
                      className="barra-progreso-mini"
                      style={{
                        width: `${Math.min(porcentajeUsado, 100)}%`,
                        backgroundColor:
                          porcentajeUsado > 90 ? '#dc3545' : porcentajeUsado > 75 ? '#ffc107' : '#28a745',
                      }}
                    />
                  </div>

                  <div className="info-adicional">
                    <small>
                      {presupuesto.gastos.length} gastos • Creado el {formatearFecha(presupuesto.fechaCreacion)}
                    </small>
                  </div>

                  <div className="acciones-presupuesto">
                    <button className="btn-accion btn-seleccionar" onClick={() => onSeleccionar(presupuesto)}>
                      Gestionar
                    </button>
                    <button className="btn-accion btn-editar" onClick={() => iniciarEdicion(presupuesto)}>
                      Editar
                    </button>
                    <button
                      className="btn-accion btn-eliminar-presupuesto"
                      onClick={() => confirmarEliminacion(presupuesto)}>
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="resumen-total">
        <h3>Resumen General</h3>
        <div className="stats-generales">
          <div className="stat-general">
            <strong>Total Presupuestado:</strong>
            <span>€{presupuestos.reduce((total, p) => total + p.cantidad, 0).toFixed(2)}</span>
          </div>
          <div className="stat-general">
            <strong>Total Gastado:</strong>
            <span>
              €
              {presupuestos
                .reduce((total, p) => total + p.gastos.reduce((gastoTotal, g) => gastoTotal + g.cantidad, 0), 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="stat-general">
            <strong>Presupuestos Activos:</strong>
            <span>{presupuestos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
