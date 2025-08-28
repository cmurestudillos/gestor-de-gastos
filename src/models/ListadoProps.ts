import type { Gasto as GastoType } from '../models/Gasto';

export interface ListadoProps {
  gastos: GastoType[];
  onEliminarGasto: (id: string) => void;
}
