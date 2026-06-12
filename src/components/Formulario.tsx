import { useState, FormEvent } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Error } from './Error';
import { formatearMoneda } from '../helpers/helpers';
import type { FormularioProps } from '../models/FormularioProps';

const categorias = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Ropa', 'Otros'];

export const Formulario = ({ onAgregarGasto, restante }: FormularioProps) => {
  const [nombre, setNombre] = useState<string>('');
  const [cantidad, setCantidad] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validarFormulario = () => {
    if (!nombre.trim()) {
      return 'El nombre del gasto es obligatorio';
    }

    if (nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (cantidad === null || cantidad <= 0) {
      return 'La cantidad debe ser un número mayor a 0';
    }

    if (cantidad > restante) {
      return `La cantidad no puede ser mayor al presupuesto restante (${formatearMoneda(restante)})`;
    }

    if (!categoria) {
      return 'Debes seleccionar una categoría';
    }

    return null;
  };

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    onAgregarGasto({
      nombre: nombre.trim(),
      cantidad: cantidad as number,
      categoria,
    });

    // Resetear formulario
    setNombre('');
    setCantidad(null);
    setCategoria('');
    setError('');
  };

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if (error) setError('');
  };

  const manejarCambioCantidad = (valor: number | null) => {
    setCantidad(valor);
    if (error) setError('');
  };

  const manejarCambioCategoria = (valor: string) => {
    setCategoria(valor);
    if (error) setError('');
  };

  return (
    <Card title="Añade tus gastos aquí">
      <form onSubmit={manejarSubmit}>
        {error && <Error mensaje={error} />}

        <div className="campo">
          <label htmlFor="nombre-gasto">Nombre del Gasto</label>
          <InputText
            id="nombre-gasto"
            placeholder="Ej. Cena en restaurante"
            value={nombre}
            onChange={manejarCambioNombre}
            maxLength={50}
          />
        </div>

        <div className="campo">
          <label htmlFor="cantidad-gasto">Cantidad</label>
          <InputNumber
            id="cantidad-gasto"
            placeholder="Ej. 25,50 €"
            value={cantidad}
            onValueChange={e => manejarCambioCantidad(e.value ?? null)}
            mode="currency"
            currency="EUR"
            locale="es-ES"
            min={0}
          />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoría</label>
          <Dropdown
            id="categoria"
            value={categoria}
            options={categorias}
            placeholder="Selecciona una categoría"
            onChange={e => manejarCambioCategoria(e.value)}
          />
        </div>

        <div className="info-restante">
          <span>Presupuesto restante</span>
          <strong className={restante < 0 ? 'money-negative' : 'money-positive'}>{formatearMoneda(restante)}</strong>
        </div>

        <Button
          type="submit"
          label="Añadir Gasto"
          icon="pi pi-plus"
          className="btn-full"
          disabled={!nombre.trim() || cantidad === null || !categoria}
        />
      </form>
    </Card>
  );
};
