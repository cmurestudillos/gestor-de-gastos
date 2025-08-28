export interface ControlPresupuestoProps {
  presupuesto: number;
  restante: number;
  onResetear: () => void;
  esMultiple?: boolean;
}
