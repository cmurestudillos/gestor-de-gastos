import { useState, useEffect, useCallback } from 'react';
// Componentes
import { Pregunta } from './components/Pregunta';
import { Formulario } from './components/Formulario';
import { Listado } from './components/Listado';
import { ControlPresupuesto } from './components/ControlPresupuesto';
import { GestorPresupuestos } from './components/GestorPresupuestos';
import type { Presupuesto } from './models/Presupuesto';
import type { Gasto } from './models/Gasto';

function App() {
  // Estados principales
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [presupuestoActivo, setPresupuestoActivo] = useState<Presupuesto | null>(null);
  const [vista, setVista] = useState<'lista' | 'crear' | 'gastos'>('lista');

  // Cargar presupuestos del localStorage al iniciar
  useEffect(() => {
    const presupuestosGuardados = localStorage.getItem('presupuestos');
    const presupuestoActivoId = localStorage.getItem('presupuestoActivoId');

    if (presupuestosGuardados) {
      const presupuestosArray = JSON.parse(presupuestosGuardados) as Presupuesto[];
      // Convertir fechas de string a Date
      const presupuestosConFechas = presupuestosArray.map(p => ({
        ...p,
        fechaCreacion: new Date(p.fechaCreacion),
        gastos: p.gastos.map(g => ({
          ...g,
          fecha: new Date(g.fecha),
        })),
      }));

      setPresupuestos(presupuestosConFechas);

      if (presupuestoActivoId) {
        const activo = presupuestosConFechas.find(p => p.id === presupuestoActivoId);
        if (activo) {
          setPresupuestoActivo(activo);
          setVista('gastos');
        }
      }
    }
  }, []);

  // Guardar presupuestos en localStorage
  useEffect(() => {
    if (presupuestos.length > 0) {
      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
    }
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
    },
    [presupuestoActivo]
  );

  // Eliminar presupuesto
  const eliminarPresupuesto = useCallback(
    (id: string) => {
      setPresupuestos(prev => {
        const nuevosPresupuestos = prev.filter(p => p.id !== id);

        // Si eliminamos el activo, resetear
        if (presupuestoActivo?.id === id) {
          setPresupuestoActivo(null);
          setVista('lista');
          localStorage.removeItem('presupuestoActivoId');
        }

        return nuevosPresupuestos;
      });
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
    <div className="container">
      <header>
        <h1>Gestor de Gastos</h1>
        <hr></hr>
        <div className="contenido-principal contenido">
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
                <button className="btn-volver" onClick={volverALista}>
                  ← Volver
                </button>
              </div>

              <div className="row">
                <div className="one-half column">
                  <Formulario onAgregarGasto={agregarGasto} restante={calcularRestante()} />
                </div>
                <div className="one-half column">
                  <Listado gastos={presupuestoActivo.gastos} onEliminarGasto={eliminarGasto} />
                  <ControlPresupuesto
                    presupuesto={presupuestoActivo.cantidad}
                    restante={calcularRestante()}
                    onResetear={() => {}} // No usado en múltiples presupuestos
                    esMultiple={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
