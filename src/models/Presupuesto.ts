import type { Gasto } from './Gasto';

export interface Presupuesto {
  id: string;
  nombre: string;
  cantidad: number;
  gastos: Gasto[];
  fechaCreacion: Date;
  activo: boolean;
}
