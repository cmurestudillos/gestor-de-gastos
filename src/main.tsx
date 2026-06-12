import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-dark-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>
);
