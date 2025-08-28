import type { Gasto } from './Gasto';

export interface FormularioProps {
  onAgregarGasto: (gasto: Omit<Gasto, 'id' | 'fecha'>) => void;
  restante: number;
}
