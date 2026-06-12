import { useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { confirmDialog } from 'primereact/confirmdialog';
import { esNumeroValido, formatearMoneda } from '../helpers/helpers';
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
    onModificar(formEdicion.id, formEdicion.nombre.trim(), Number(formEdicion.cantidad));
    setEditando(null);
  };

  const confirmarEliminacion = (presupuesto: Presupuesto) => {
    const totalGastos = presupuesto.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    const mensaje =
      totalGastos > 0
        ? `Tiene ${presupuesto.gastos.length} gastos por un total de ${formatearMoneda(totalGastos)}. Esta acción no se puede deshacer.`
        : 'Esta acción no se puede deshacer.';

    confirmDialog({
      message: `¿Seguro que quieres eliminar "${presupuesto.nombre}"? ${mensaje}`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => onEliminar(presupuesto.id, presupuesto.nombre),
    });
  };

  const calcularEstadisticas = (presupuesto: Presupuesto) => {
    const totalGastos = presupuesto.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    const restante = presupuesto.cantidad - totalGastos;
    const porcentajeUsado = presupuesto.cantidad > 0 ? (totalGastos / presupuesto.cantidad) * 100 : 0;

    return { totalGastos, restante, porcentajeUsado };
  };

  const colorProgreso = (porcentajeUsado: number) => {
    if (porcentajeUsado > 90) return '#ef4444';
    if (porcentajeUsado > 75) return '#f59e0b';
    return '#22c55e';
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
        <i className="pi pi-wallet" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
        <h2>¡Bienvenido!</h2>
        <p>No tienes presupuestos creados aún.</p>
        <Button label="Crear Mi Primer Presupuesto" icon="pi pi-plus" onClick={onNuevo} />
      </div>
    );
  }

  return (
    <div className="gestor-presupuestos">
      <div className="header-gestor">
        <h2>Mis Presupuestos</h2>
        <Button label="Nuevo Presupuesto" icon="pi pi-plus" onClick={onNuevo} />
      </div>

      <div className="grid-presupuestos">
        {presupuestos.map(presupuesto => {
          const { totalGastos, restante, porcentajeUsado } = calcularEstadisticas(presupuesto);
          const esEditando = editando === presupuesto.id;

          return (
            <Card key={presupuesto.id} className={`tarjeta-presupuesto ${presupuesto.activo ? 'activo' : ''}`}>
              {esEditando ? (
                <div className="edicion-presupuesto">
                  <InputText
                    value={formEdicion.nombre}
                    onChange={e => setFormEdicion(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del presupuesto"
                  />
                  <InputNumber
                    value={formEdicion.cantidad === '' ? null : Number(formEdicion.cantidad)}
                    onValueChange={e => setFormEdicion(prev => ({ ...prev, cantidad: (e.value ?? '').toString() }))}
                    mode="currency"
                    currency="EUR"
                    locale="es-ES"
                    placeholder="Cantidad"
                  />
                  <div className="botones-edicion">
                    <Button
                      label="Guardar"
                      icon="pi pi-check"
                      severity="success"
                      disabled={!formEdicion.nombre.trim() || !esNumeroValido(formEdicion.cantidad)}
                      onClick={guardarEdicion}
                    />
                    <Button
                      label="Cancelar"
                      icon="pi pi-times"
                      severity="secondary"
                      outlined
                      onClick={cancelarEdicion}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="header-tarjeta">
                    <h3>{presupuesto.nombre}</h3>
                    {presupuesto.activo && <Tag value="Activo" icon="pi pi-star-fill" severity="info" />}
                  </div>

                  <div className="stats-presupuesto">
                    <div className="stat-row">
                      <span className="label">Presupuesto</span>
                      <span className="valor">{formatearMoneda(presupuesto.cantidad)}</span>
                    </div>
                    <div className="stat-row">
                      <span className="label">Gastado</span>
                      <span className="valor money-spent">{formatearMoneda(totalGastos)}</span>
                    </div>
                    <div className="stat-row">
                      <span className="label">Restante</span>
                      <span className={`valor ${restante < 0 ? 'money-negative' : 'money-positive'}`}>
                        {formatearMoneda(restante)}
                      </span>
                    </div>
                  </div>

                  <ProgressBar
                    value={Math.min(porcentajeUsado, 100)}
                    showValue={false}
                    color={colorProgreso(porcentajeUsado)}
                    style={{ height: '8px' }}
                  />

                  <div className="info-adicional">
                    <small>
                      {presupuesto.gastos.length} gastos • Creado el {formatearFecha(presupuesto.fechaCreacion)}
                    </small>
                  </div>

                  <div className="acciones-presupuesto">
                    <Button label="Gestionar" icon="pi pi-arrow-right" onClick={() => onSeleccionar(presupuesto)} />
                    <Button
                      icon="pi pi-pencil"
                      outlined
                      severity="secondary"
                      aria-label="Editar"
                      onClick={() => iniciarEdicion(presupuesto)}
                    />
                    <Button
                      icon="pi pi-trash"
                      outlined
                      severity="danger"
                      aria-label="Eliminar"
                      onClick={() => confirmarEliminacion(presupuesto)}
                    />
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      <div className="resumen-total">
        <h3>Resumen General</h3>
        <div className="stats-generales">
          <div className="stat-general">
            <span className="stat-label">Total Presupuestado</span>
            <span className="stat-value">
              {formatearMoneda(presupuestos.reduce((total, p) => total + p.cantidad, 0))}
            </span>
          </div>
          <div className="stat-general">
            <span className="stat-label">Total Gastado</span>
            <span className="stat-value money-spent">
              {formatearMoneda(
                presupuestos.reduce(
                  (total, p) => total + p.gastos.reduce((gastoTotal, g) => gastoTotal + g.cantidad, 0),
                  0
                )
              )}
            </span>
          </div>
          <div className="stat-general">
            <span className="stat-label">Total de Presupuestos</span>
            <span className="stat-value">{presupuestos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
