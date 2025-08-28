import type { ErrorProps } from '../models/ErrorProps';

export const Error = ({ mensaje }: ErrorProps) => (
  <div className="alert alert-danger error" role="alert">
    <strong>Error:</strong> {mensaje}
  </div>
);
