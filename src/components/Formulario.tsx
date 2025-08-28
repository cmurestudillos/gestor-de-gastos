import { useState, FormEvent } from 'react';
import { Error } from './Error';
import type { FormularioProps } from '../models/FormularioProps';

const categorias = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Ropa', 'Otros'];

export const Formulario = ({ onAgregarGasto, restante }: FormularioProps) => {
  const [nombre, setNombre] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validarFormulario = () => {
    if (!nombre.trim()) {
      return 'El nombre del gasto es obligatorio';
    }

    if (nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    const cantidadNum = Number(cantidad);

    if (!cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
      return 'La cantidad debe ser un número mayor a 0';
    }

    if (cantidadNum > restante) {
      return `La cantidad no puede ser mayor al presupuesto restante (€${restante.toFixed(2)})`;
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

    // Crear el gasto
    const nuevoGasto = {
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      categoria,
    };

    onAgregarGasto(nuevoGasto);

    // Resetear formulario
    setNombre('');
    setCantidad('');
    setCategoria('');
    setError('');
  };

  const manejarCambioCantidad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // Solo permitir números y punto decimal
    if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
      setCantidad(valor);
      if (error) setError('');
    }
  };

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if (error) setError('');
  };

  const manejarCambioCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value);
    if (error) setError('');
  };

  return (
    <form onSubmit={manejarSubmit}>
      <h2>Añade tus gastos aquí</h2>

      {error && <Error mensaje={error} />}

      <div className="campo">
        <label htmlFor="nombre-gasto">Nombre del Gasto</label>
        <input
          id="nombre-gasto"
          type="text"
          className="u-full-width"
          placeholder="Ej. Cena en restaurante"
          value={nombre}
          onChange={manejarCambioNombre}
          maxLength={50}
        />
      </div>

      <div className="campo">
        <label htmlFor="cantidad-gasto">Cantidad (€)</label>
        <input
          id="cantidad-gasto"
          type="text"
          className="u-full-width"
          placeholder="Ej. 25.50"
          value={cantidad}
          onChange={manejarCambioCantidad}
        />
      </div>

      <div className="campo">
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" className="u-full-width" value={categoria} onChange={manejarCambioCategoria}>
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="campo info-restante">
        <small>
          Presupuesto restante: <strong>€{restante.toFixed(2)}</strong>
        </small>
      </div>

      <button
        type="submit"
        className="button-primary u-full-width"
        disabled={!nombre.trim() || !cantidad || !categoria}>
        Añadir Gasto
      </button>
    </form>
  );
};
