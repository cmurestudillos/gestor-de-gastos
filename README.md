# 💰 Gestor de Gastos Múltiples

Una aplicación web moderna y completa para gestionar múltiples presupuestos personales de forma inteligente y visual.

## 🎯 Características Principales

### 📊 Gestión Múltiple de Presupuestos
- **Múltiples presupuestos** - Crea y gestiona tantos presupuestos como necesites
- **Nombres personalizados** - "Presupuesto Enero", "Gastos Casa", "Vacaciones", etc.
- **Vista de panel** - Visualiza todos tus presupuestos en una interfaz intuitiva
- **Edición en línea** - Modifica nombre y cantidad directamente desde la lista
- **Eliminación segura** - Confirmación antes de eliminar presupuestos con gastos

### 💸 Control Inteligente de Gastos
- **Categorización automática** - Organiza gastos por tipo (Alimentación, Transporte, etc.)
- **Validación inteligente** - No permite gastos superiores al presupuesto restante
- **Filtros dinámicos** - Filtra gastos por categoría
- **Historial completo** - Todos los gastos con fecha y hora
- **Eliminación individual** - Borra gastos específicos con un click

### 📈 Visualización y Análisis
- **Barras de progreso** - Visualización del porcentaje de presupuesto usado
- **Alertas por colores** - Verde (seguro), Amarillo (precaución), Rojo (límite)
- **Resumen estadístico** - Total presupuestado, gastado y restante
- **Dashboard general** - Vista global de todos los presupuestos

### 💾 Persistencia y Usabilidad
- **Almacenamiento local** - Todos los datos se guardan automáticamente
- **Navegación fluida** - Interfaz intuitiva y fácil de usar
- **Diseño responsive** - Funciona perfectamente en móviles y escritorio
- **Experiencia optimizada** - Carga rápida y transiciones suaves
- **Notificaciones Toast** - Feedback visual inmediato al crear, editar o eliminar presupuestos y gastos
- **Confirmaciones seguras** - Diálogos de confirmación antes de cualquier acción destructiva

### 🎨 Interfaz Profesional
- **Tema oscuro "dark fintech"** - Basado en PrimeReact (`lara-dark-teal`) con acentos en verde teal
- **Semántica de color del dinero** - Verde para saldos positivos, rojo para gastos/saldos negativos, ámbar para avisos
- **Componentes PrimeReact** - Cards, Tags, ProgressBar, Dropdown, InputNumber con formato de moneda EUR
- **Tipografía Inter** - Look moderno y profesional en toda la aplicación

## 🚀 Demo en Vivo

[Ver Demo](https://gestor-de-gastos-multiples.vercel.app) | [Repositorio](https://github.com/cmurestudillos/gestor-de-gastos)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 con TypeScript
- **UI**: PrimeReact 10 (tema `lara-dark-teal`) + PrimeIcons
- **Build Tool**: Vite 8
- **Gestor de paquetes**: pnpm
- **Estilo**: CSS3 (Flexbox y Grid) sobre tema oscuro PrimeReact + tipografía Inter
- **Almacenamiento**: LocalStorage API
- **Validación**: Validación en tiempo real
- **UX**: Toast y ConfirmDialog (PrimeReact) para notificaciones y confirmaciones, diseño responsive y accesible

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 20+
- pnpm 11+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/cmurestudillos/gestor-de-gastos.git

# Navegar al directorio
cd gestor-de-gastos

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build
```

### Scripts Disponibles
```bash
pnpm dev            # Servidor de desarrollo
pnpm build          # Construir para producción
pnpm preview        # Vista previa de la build
pnpm lint           # Linter de código
pnpm lint:fix       # Corregir problemas de lint automáticamente
pnpm format         # Formatear con Prettier
pnpm format:check   # Verificar formato con Prettier
pnpm type-check     # Verificación de tipos TypeScript
```

## 🎮 Guía de Uso

### 1. Crear tu Primer Presupuesto
- Al abrir la aplicación, haz click en "Crear Mi Primer Presupuesto"
- Ingresa un nombre descriptivo (ej: "Presupuesto Febrero")
- Define la cantidad de dinero disponible
- ¡Listo para gestionar gastos!

### 2. Gestionar Múltiples Presupuestos
- Desde el panel principal, ve todos tus presupuestos
- Haz click en "Gestionar" para trabajar con un presupuesto específico
- Usa "Editar" para modificar nombre o cantidad
- "Eliminar" para borrar presupuestos (con confirmación de seguridad)

### 3. Agregar y Categorizar Gastos
- Completa el formulario con nombre, cantidad y categoría
- El sistema valida que no excedas tu presupuesto restante
- Cada gasto se registra con fecha y hora automáticamente
- Filtra por categoría para análisis específicos

### 4. Monitoreo Visual
- Las barras de progreso muestran el porcentaje usado
- Colores indican el estado: Verde (seguro), Amarillo (cuidado), Rojo (límite)
- El panel estadístico muestra totales y resúmenes
- Navegación intuitiva entre presupuestos

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── Pregunta.tsx           # Crear/editar presupuestos
│   ├── GestorPresupuestos.tsx # Panel principal
│   ├── Formulario.tsx         # Agregar gastos
│   ├── Listado.tsx            # Lista de gastos
│   ├── Gasto.tsx              # Item individual de gasto
│   ├── ControlPresupuesto.tsx # Estadísticas y control
│   └── Error.tsx              # Componente de errores
├── helpers/
│   └── helpers.ts             # Utilidades y funciones helper
├── App.tsx                    # Componente principal
└── main.tsx                   # Punto de entrada
```

## 🎯 Características Técnicas

### TypeScript Completo
- Tipado estricto en todos los componentes
- Interfaces definidas para todos los datos
- Autocompletado y detección de errores

### Optimización de Performance
- `useCallback` para evitar re-renders innecesarios
- Componentes optimizados y eficientes
- Lazy loading y code splitting listo

### Accesibilidad
- Etiquetas ARIA apropiadas
- Navegación por teclado
- Contraste y legibilidad optimizada

### Responsive Design
- Mobile-first approach
- Breakpoints para tablet y desktop
- Interacciones táctiles mejoradas

## 🔄 Próximas Características

- [ ] **Gráficos y análisis avanzados** con Chart.js
- [ ] **Exportación de datos** a CSV/Excel
- [ ] **Metas de ahorro** personalizables
- [ ] **Notificaciones push** para límites
- [ ] **Sincronización en la nube** (opcional)
- [ ] **Categorías personalizadas** por usuario
- [ ] **Reportes mensuales** automatizados

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Inspirado en la necesidad de gestión financiera personal eficiente
- Gracias a la comunidad de React y TypeScript por las mejores prácticas
- UI/UX basado en principios de diseño moderno y accesible

---

⭐ Si te gusta el proyecto, ¡dale una estrella en GitHub!

#React #TypeScript #Vite #PersonalFinance #BudgetTracker #WebApp