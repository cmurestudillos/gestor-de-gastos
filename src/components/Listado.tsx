import { useState } from 'react';
import type { ListadoProps } from '../models/ListadoProps';
import { Gasto } from './Gasto';

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
          Total {filtroCategoria ? `en ${filtroCategoria}` : ''}:<strong> €{totalGastos.toFixed(2)}</strong>
        </p>
      </div>

      {categorias.length > 1 && (
        <div className="filtro-categoria">
          <label htmlFor="filtro">Filtrar por categoría:</label>
          <select id="filtro" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
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
