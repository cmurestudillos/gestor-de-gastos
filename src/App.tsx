import { useState, useEffect, useCallback, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
// Componentes
import { Pregunta } from './components/Pregunta';
import { Formulario } from './components/Formulario';
import { Listado } from './components/Listado';
import { ControlPresupuesto } from './components/ControlPresupuesto';
import { GestorPresupuestos } from './components/GestorPresupuestos';
import type { Presupuesto } from './models/Presupuesto';
import type { Gasto } from './models/Gasto';

// Lee los presupuestos del localStorage y convierte las fechas de string a Date
const cargarPresupuestos = (): Presupuesto[] => {
  const presupuestosGuardados = localStorage.getItem('presupuestos');
  if (!presupuestosGuardados) return [];

  const presupuestosArray = JSON.parse(presupuestosGuardados) as Presupuesto[];
  return presupuestosArray.map(p => ({
    ...p,
    fechaCreacion: new Date(p.fechaCreacion),
    gastos: p.gastos.map(g => ({
      ...g,
      fecha: new Date(g.fecha),
    })),
  }));
};

function App() {
  const toast = useRef<Toast>(null);

  // Estados principales (inicializados de forma perezosa desde localStorage)
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>(cargarPresupuestos);

  const [presupuestoActivo, setPresupuestoActivo] = useState<Presupuesto | null>(() => {
    const presupuestoActivoId = localStorage.getItem('presupuestoActivoId');
    return presupuestos.find(p => p.id === presupuestoActivoId) ?? null;
  });

  const [vista, setVista] = useState<'lista' | 'crear' | 'gastos'>(() => (presupuestoActivo ? 'gastos' : 'lista'));

  // Guardar presupuestos en localStorage
  useEffect(() => {
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
  }, [presupuestos]);

  // Guardar presupuesto activo
  useEffect(() => {
    if (presupuestoActivo) {
      localStorage.setItem('presupuestoActivoId', presupuestoActivo.id);
    }
  }, [presupuestoActivo]);

  // Crear nuevo presupuesto
  const crearPresupuesto = useCallback((nombre: string, cantidad: number) => {
    const nuevoPresupuesto: Presupuesto = {
      id: crypto.randomUUID(),
      nombre,
      cantidad,
      gastos: [],
      fechaCreacion: new Date(),
      activo: true,
    };

    // Desactivar otros presupuestos
    setPresupuestos(previos => [...previos.map(p => ({ ...p, activo: false })), nuevoPresupuesto]);

    setPresupuestoActivo(nuevoPresupuesto);
    setVista('gastos');

    toast.current?.show({ severity: 'success', summary: 'Presupuesto creado', detail: `"${nombre}" está listo` });
  }, []);

  // Seleccionar presupuesto activo
  const seleccionarPresupuesto = useCallback((presupuesto: Presupuesto) => {
    // Actualizar estado activo
    setPresupuestos(prev =>
      prev.map(p => ({
        ...p,
        activo: p.id === presupuesto.id,
      }))
    );

    setPresupuestoActivo(presupuesto);
    setVista('gastos');
  }, []);

  // Modificar presupuesto
  const modificarPresupuesto = useCallback(
    (id: string, nuevoNombre: string, nuevaCantidad: number) => {
      setPresupuestos(prev =>
        prev.map(p => (p.id === id ? { ...p, nombre: nuevoNombre, cantidad: nuevaCantidad } : p))
      );

      // Si es el activo, también actualizarlo
      if (presupuestoActivo?.id === id) {
        setPresupuestoActivo(prev =>
          prev
            ? {
                ...prev,
                nombre: nuevoNombre,
                cantidad: nuevaCantidad,
              }
            : null
        );
      }

      toast.current?.show({ severity: 'success', summary: 'Presupuesto actualizado', detail: nuevoNombre });
    },
    [presupuestoActivo]
  );

  // Eliminar presupuesto
  const eliminarPresupuesto = useCallback(
    (id: string, nombre: string) => {
      setPresupuestos(prev => prev.filter(p => p.id !== id));

      // Si eliminamos el activo, resetear
      if (presupuestoActivo?.id === id) {
        setPresupuestoActivo(null);
        setVista('lista');
        localStorage.removeItem('presupuestoActivoId');
      }

      toast.current?.show({ severity: 'info', summary: 'Presupuesto eliminado', detail: nombre });
    },
    [presupuestoActivo]
  );

  // Agregar gasto al presupuesto activo
  const agregarGasto = useCallback(
    (nuevoGasto: Omit<Gasto, 'id' | 'fecha'>) => {
      if (!presupuestoActivo) return;

      const gastoCompleto: Gasto = {
        ...nuevoGasto,
        id: crypto.randomUUID(),
        fecha: new Date(),
      };

      const presupuestoActualizado = {
        ...presupuestoActivo,
        gastos: [...presupuestoActivo.gastos, gastoCompleto],
      };

      setPresupuestos(prev => prev.map(p => (p.id === presupuestoActivo.id ? presupuestoActualizado : p)));

      setPresupuestoActivo(presupuestoActualizado);

      toast.current?.show({ severity: 'success', summary: 'Gasto añadido', detail: gastoCompleto.nombre });
    },
    [presupuestoActivo]
  );

  // Eliminar gasto
  const eliminarGasto = useCallback(
    (gastoId: string) => {
      if (!presupuestoActivo) return;

      const presupuestoActualizado = {
        ...presupuestoActivo,
        gastos: presupuestoActivo.gastos.filter(g => g.id !== gastoId),
      };

      setPresupuestos(prev => prev.map(p => (p.id === presupuestoActivo.id ? presupuestoActualizado : p)));

      setPresupuestoActivo(presupuestoActualizado);

      toast.current?.show({ severity: 'info', summary: 'Gasto eliminado' });
    },
    [presupuestoActivo]
  );

  // Calcular restante del presupuesto activo
  const calcularRestante = () => {
    if (!presupuestoActivo) return 0;
    const totalGastos = presupuestoActivo.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    return presupuestoActivo.cantidad - totalGastos;
  };

  const volverALista = () => {
    setVista('lista');
    setPresupuestoActivo(null);
    localStorage.removeItem('presupuestoActivoId');
  };

  return (
    <div className="app-shell">
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />

      <header className="app-header">
        <i className="pi pi-wallet"></i>
        <div>
          <h1>Gestor de Gastos</h1>
          <p>Controla tus presupuestos y gastos de forma sencilla</p>
        </div>
      </header>

      <main>
        {vista === 'lista' && (
          <GestorPresupuestos
            presupuestos={presupuestos}
            onSeleccionar={seleccionarPresupuesto}
            onModificar={modificarPresupuesto}
            onEliminar={eliminarPresupuesto}
            onNuevo={() => setVista('crear')}
          />
        )}

        {vista === 'crear' && (
          <Pregunta onEstablecerPresupuesto={crearPresupuesto} onVolver={() => setVista('lista')} esNuevo={true} />
        )}

        {vista === 'gastos' && presupuestoActivo && (
          <>
            <div className="navegacion">
              <h2>{presupuestoActivo.nombre}</h2>
              <Button label="Volver" icon="pi pi-arrow-left" outlined onClick={volverALista} />
            </div>

            <div className="vista-gastos">
              <Formulario onAgregarGasto={agregarGasto} restante={calcularRestante()} />
              <div>
                <Listado gastos={presupuestoActivo.gastos} onEliminarGasto={eliminarGasto} />
                <ControlPresupuesto presupuesto={presupuestoActivo.cantidad} restante={calcularRestante()} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
