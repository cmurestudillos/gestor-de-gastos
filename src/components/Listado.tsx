import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import type { ListadoProps } from '../models/ListadoProps';
import { Gasto } from './Gasto';
import { formatearMoneda } from '../helpers/helpers';

export const Listado = ({ gastos, onEliminarGasto }: ListadoProps) => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  // Obtener categorías únicas
  const categorias = [...new Set(gastos.map(gasto => gasto.categoria))];

  // Filtrar gastos por categoría
  const gastosFiltrados = filtroCategoria ? gastos.filter(gasto => gasto.categoria === filtroCategoria) : gastos;

  // Ordenar por fecha (más recientes primero)
  const gastosOrdenados = [...gastosFiltrados].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const totalGastos = gastosFiltrados.reduce((total, gasto) => total + gasto.cantidad, 0);

  if (gastos.length === 0) {
    return (
      <div className="gastos-realizados">
        <h2>Listado de Gastos</h2>
        <p className="sin-gastos">No hay gastos registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="gastos-realizados">
      <div className="listado-header">
        <h2>Listado de Gastos</h2>
        <p className="total-gastos">
          Total {filtroCategoria ? `en ${filtroCategoria}` : ''}: <strong>{formatearMoneda(totalGastos)}</strong>
        </p>
      </div>

      {categorias.length > 1 && (
        <div className="filtro-categoria">
          <label htmlFor="filtro">Filtrar por categoría</label>
          <Dropdown
            id="filtro"
            value={filtroCategoria}
            options={categorias}
            placeholder="Todas las categorías"
            showClear
            onChange={e => setFiltroCategoria(e.value ?? '')}
          />
        </div>
      )}

      <ul className="gastos-lista">
        {gastosOrdenados.map(gasto => (
          <Gasto key={gasto.id} gasto={gasto} onEliminar={onEliminarGasto} />
        ))}
      </ul>
    </div>
  );
};
