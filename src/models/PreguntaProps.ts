export interface PreguntaProps {
  onEstablecerPresupuesto: (nombre: string, cantidad: number) => void;
  onVolver?: () => void;
  esNuevo?: boolean;
}
