import { useState, FormEvent } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Error } from './Error';
import type { PreguntaProps } from '../models/PreguntaProps';

export const Pregunta = ({ onEstablecerPresupuesto, onVolver, esNuevo = false }: PreguntaProps) => {
  const [nombre, setNombre] = useState<string>('');
  const [cantidad, setCantidad] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones mejoradas
    if (!nombre.trim()) {
      setError('El nombre del presupuesto es obligatorio');
      return;
    }

    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (cantidad === null || cantidad <= 0) {
      setError('El presupuesto debe ser un número mayor a 0');
      return;
    }

    if (cantidad > 1000000) {
      setError('El presupuesto no puede ser mayor a €1,000,000');
      return;
    }

    // Si pasa las validaciones
    setError('');
    onEstablecerPresupuesto(nombre.trim(), cantidad);
  };

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if (error) setError('');
  };

  const manejarCambioCantidad = (valor: number | null) => {
    setCantidad(valor);
    if (error) setError('');
  };

  return (
    <Card title={esNuevo ? 'Crear Nuevo Presupuesto' : 'Presupuesto Mensual'}>
      {onVolver && (
        <Button
          label="Volver"
          icon="pi pi-arrow-left"
          outlined
          onClick={onVolver}
          style={{ marginBottom: '1.25rem' }}
        />
      )}

      {error && <Error mensaje={error} />}

      <form onSubmit={manejarSubmit}>
        <div className="campo">
          <label htmlFor="nombre-presupuesto">Nombre del presupuesto</label>
          <InputText
            id="nombre-presupuesto"
            placeholder="Ej. Presupuesto Enero, Gastos Casa, etc."
            value={nombre}
            onChange={manejarCambioNombre}
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="campo">
          <label htmlFor="cantidad-presupuesto">Cantidad del presupuesto</label>
          <InputNumber
            id="cantidad-presupuesto"
            placeholder="Ej. 1.500,50 €"
            value={cantidad}
            onValueChange={e => manejarCambioCantidad(e.value ?? null)}
            mode="currency"
            currency="EUR"
            locale="es-ES"
            min={0}
          />
        </div>

        <Button
          type="submit"
          label={esNuevo ? 'Crear Presupuesto' : 'Definir Presupuesto'}
          icon="pi pi-check"
          className="btn-full"
          disabled={!nombre.trim() || cantidad === null}
        />
      </form>
    </Card>
  );
};
