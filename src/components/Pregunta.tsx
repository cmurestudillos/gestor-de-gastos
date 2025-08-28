import { useState, FormEvent } from 'react';
import { Error } from './Error';
import type { PreguntaProps } from '../models/PreguntaProps';

export const Pregunta = ({ onEstablecerPresupuesto, onVolver, esNuevo = false }: PreguntaProps) => {
  const [nombre, setNombre] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [error, setError] = useState<string>('');

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cantidadNum = Number(cantidad);

    // Validaciones mejoradas
    if (!nombre.trim()) {
      setError('El nombre del presupuesto es obligatorio');
      return;
    }

    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (!cantidad.trim()) {
      setError('La cantidad es obligatoria');
      return;
    }

    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError('El presupuesto debe ser un número mayor a 0');
      return;
    }

    if (cantidadNum > 1000000) {
      setError('El presupuesto no puede ser mayor a €1,000,000');
      return;
    }

    // Si pasa las validaciones
    setError('');
    onEstablecerPresupuesto(nombre.trim(), cantidadNum);
  };

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if (error) setError('');
  };

  const manejarCambioCantidad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // Solo permitir números y punto decimal
    if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
      setCantidad(valor);
      if (error) setError('');
    }
  };

  return (
    <>
      {onVolver && (
        <button className="btn-volver" onClick={onVolver}>
          ← Volver
        </button>
      )}

      <h2>{esNuevo ? 'Crear Nuevo Presupuesto' : 'Presupuesto Mensual'}</h2>
      {error && <Error mensaje={error} />}

      <form onSubmit={manejarSubmit}>
        <div className="campo">
          <label htmlFor="nombre-presupuesto">Nombre del presupuesto</label>
          <input
            id="nombre-presupuesto"
            type="text"
            className="u-full-width"
            placeholder="Ej. Presupuesto Enero, Gastos Casa, etc."
            value={nombre}
            onChange={manejarCambioNombre}
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="campo">
          <label htmlFor="cantidad-presupuesto">Cantidad del presupuesto (€)</label>
          <input
            id="cantidad-presupuesto"
            type="text"
            className="u-full-width"
            placeholder="Ej. 1500.50"
            value={cantidad}
            onChange={manejarCambioCantidad}
          />
        </div>

        <button type="submit" className="button-primary u-full-width" disabled={!nombre.trim() || !cantidad.trim()}>
          {esNuevo ? 'Crear Presupuesto' : 'Definir Presupuesto'}
        </button>
      </form>
    </>
  );
};
