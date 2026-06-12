import { Message } from 'primereact/message';
import type { ErrorProps } from '../models/ErrorProps';

export const Error = ({ mensaje }: ErrorProps) => (
  <Message
    severity="error"
    text={mensaje}
    className="error"
    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '1rem' }}
  />
);
