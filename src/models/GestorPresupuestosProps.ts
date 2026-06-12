import type { Presupuesto } from './Presupuesto';

export interface GestorPresupuestosProps {
  presupuestos: Presupuesto[];
  onSeleccionar: (presupuesto: Presupuesto) => void;
  onModificar: (id: string, nombre: string, cantidad: number) => void;
  onEliminar: (id: string, nombre: string) => void;
  onNuevo: () => void;
}
