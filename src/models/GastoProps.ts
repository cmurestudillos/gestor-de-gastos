import type { Gasto as GastoType } from '../models/Gasto';

export interface GastoProps {
  gasto: GastoType;
  onEliminar: (id: string) => void;
}
