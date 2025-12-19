# Sistema de Gestión Financiero Personal

Sistema completo de gestión financiera personal desarrollado con **React** y **Node.js**, diseñado para ayudar a los usuarios a controlar sus ingresos, gastos, presupuestos, tarjetas de crédito y metas de ahorro.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Decisiones Técnicas Clave](#-decisiones-técnicas-clave)
- [Dashboard](#-dashboard)
- [Roadmap y Mejoras Futuras](#-roadmap-y-mejoras-futuras)
- [Contribución](#-contribución)

## Características Principales

### Dashboard Inteligente
- **Resumen Financiero**: Visualización completa de ingresos, gastos y balance del mes actual
- **KPIs en Tiempo Real**: Métricas clave como balance total, ingresos, gastos y ahorro
- **Gráficos Interactivos**: Visualización de gastos por categoría y tendencias mensuales
- **Transacciones Recientes**: Lista de movimientos más recientes con filtros y búsqueda
- **Fecha Actual**: Muestra el día actual en formato legible (ej: "Miércoles 17 / Diciembre / 2026")

<img width="1898" height="799" alt="image" src="https://github.com/user-attachments/assets/4e03e8a0-3de0-49c2-817e-a69c0ec39667" />

### Gestión de Tarjetas y Cuotas
- **Gestión Completa de Tarjetas**: Agregar, editar y eliminar tarjetas de crédito/débito
- **Información Detallada**: Número completo, nombre del titular, CVV, fecha de vencimiento
- **Sistema de Cuotas**: Registro de compras en cuotas con seguimiento automático
- **Procesamiento Mensual**: Simulación del paso del tiempo para generar gastos de cuotas pendientes
- **Límites y Alertas**: Visualización de uso de crédito con alertas cuando se acerca al límite

<img width="1631" height="418" alt="image" src="https://github.com/user-attachments/assets/0fbb5e6c-9279-4a9b-848e-8ed726fe595c" />

### Configuración de Sueldo
- **Configuración Automática**: Define tu sueldo neto y día de cobro
- **Generación Automática**: El sistema agrega automáticamente tu sueldo como ingreso cada mes
- **Categorización**: Asignación automática a categoría de ingresos
- **Procesamiento Manual**: Opción para procesar el sueldo manualmente si es necesario

<img width="655" height="672" alt="image" src="https://github.com/user-attachments/assets/43f7b34a-1836-4f35-bcf4-05f32b773d7b" />

### Presupuestos
- **Presupuestos por Categoría**: Define límites de gasto para cada categoría mensualmente
- **Seguimiento en Tiempo Real**: Visualización del porcentaje gastado vs. presupuestado
- **Alertas Visuales**: Indicadores de color cuando te acercas o superas el presupuesto
- **Navegación Temporal**: Navega entre meses para ver presupuestos históricos
- **Gestión Completa**: Crear, editar y eliminar presupuestos

<img width="1643" height="319" alt="image" src="https://github.com/user-attachments/assets/a82abefa-eb91-42dc-8c66-b3e46027fe34" />

### Metas de Ahorro
- **Definición de Metas**: Crea objetivos financieros con monto objetivo y fecha límite
- **Seguimiento de Progreso**: Barra de progreso visual con porcentaje completado
- **Gestión de Fondos**: Sumar y retirar dinero de las metas con validación
- **Validación Inteligente**: No permite retirar más de lo disponible
- **Edición Completa**: Modifica nombre y fecha de las metas
- **Eliminación Segura**: Elimina metas con confirmación

<img width="1637" height="337" alt="image" src="https://github.com/user-attachments/assets/f42038e6-ed56-4974-afe4-99511151ebee" />

### Transacciones
- **CRUD Completo**: Crear, leer, actualizar y eliminar transacciones
- **Categorización**: Asignación de categorías a ingresos y gastos
- **Filtros Avanzados**: Por tipo, categoría, rango de fechas
- **Búsqueda**: Búsqueda por descripción
- **Formulario Rápido**: Agregar transacciones desde cualquier página

<img width="1637" height="814" alt="image" src="https://github.com/user-attachments/assets/e3700d4c-cfae-48f6-9bee-53523a1e09c1" />

### Reportes
- **Análisis Financiero**: Reportes detallados de ingresos y gastos
- **Filtros Temporales**: Análisis por mes, trimestre o año
- **Exportación**: Preparado para exportar datos (futuro)

<img width="948" height="384" alt="image" src="https://github.com/user-attachments/assets/2e83255c-da26-436f-800b-09f153db201d" />

## Stack Tecnológico

### Frontend
- **React 18.2.0**: Biblioteca principal para la interfaz de usuario
- **React Router DOM 6.20.0**: Enrutamiento de la aplicación
- **Vite 5.0.0**: Build tool y dev server ultra-rápido
- **Tailwind CSS 3.3.5**: Framework de utilidades CSS
- **Recharts 2.10.0**: Biblioteca de gráficos para React
- **Lucide React 0.292.0**: Iconos modernos y ligeros
- **Axios 1.6.0**: Cliente HTTP para comunicación con la API
- **date-fns 2.30.0**: Utilidades para manejo de fechas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express 4.18.2**: Framework web minimalista
- **MSSQL 10.0.1**: Driver para SQL Server
- **Express Validator 7.0.1**: Validación de datos
- **CORS 2.8.5**: Manejo de políticas CORS
- **dotenv 16.3.1**: Gestión de variables de entorno

### Base de Datos
- **Microsoft SQL Server**: Base de datos relacional

## Estructura del Proyecto

```
sistema-gestion-financiero/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuración (DB, constantes, settings)
│   │   ├── controllers/       # Controladores REST
│   │   ├── domain/            # Modelos de dominio
│   │   ├── middleware/        # Middleware (error handling, validación)
│   │   ├── repositories/     # Capa de acceso a datos
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio
│   │   ├── scripts/          # Scripts SQL y seeds
│   │   ├── app.js            # Configuración Express
│   │   └── server.js         # Punto de entrada
│   ├── package.json
│   └── README_BACKEND.md
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React reutilizables
│   │   │   ├── alerts/       # Componentes de alertas
│   │   │   ├── budgets/      # Componentes de presupuestos
│   │   │   ├── cards/        # Componentes de tarjetas
│   │   │   ├── common/       # Componentes comunes (modales, notificaciones)
│   │   │   ├── dashboard/   # Componentes del dashboard
│   │   │   ├── layout/       # Layout (Header, Sidebar)
│   │   │   ├── salary/       # Configuración de sueldo
│   │   │   ├── savings/      # Metas de ahorro
│   │   │   └── transactions/ # Componentes de transacciones
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # Servicios API
│   │   ├── utils/            # Utilidades (formatters)
│   │   ├── context/          # Context API
│   │   ├── hooks/            # Custom hooks
│   │   ├── App.jsx           # Componente raíz
│   │   └── main.jsx          # Punto de entrada
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```

## Instalación

### Prerrequisitos

- **Node.js** >= 16.x
- **npm** >= 8.x
- **SQL Server** (local o remoto) o **Docker** para usar el contenedor

### Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd sistema-gestion-financiero
```

### Paso 2: Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend/`:

```env
DB_SERVER=localhost
DB_DATABASE=PersonalFinanceDB
DB_USER=sa
DB_PASSWORD=TuPasswordFuerte123!
DB_PORT=1433
DB_ENCRYPT=false
PORT=3000
```

### Paso 3: Configurar la Base de Datos

#### Opción A: SQL Server Local

1. Crear la base de datos `PersonalFinanceDB`
2. Ejecutar los scripts SQL en orden:
   ```sql
   -- 1. Crear tablas
   backend/src/scripts/sql/01_create_tables.sql
   
   -- 2. Seed de categorías
   backend/src/scripts/sql/02_seed_categories.sql
   
   -- 3. Datos de ejemplo (opcional)
   backend/src/scripts/sql/03_seed_realistic_data.sql
   
   -- 4. Configuración de sueldo
   backend/src/scripts/sql/04_add_salary_config.sql
   
   -- 5. Campos adicionales de tarjetas
   backend/src/scripts/sql/05_add_card_fields.sql
   
   -- 6. Fix de constraints de tarjetas
   backend/src/scripts/sql/06_fix_card_delete_constraints.sql
   ```

#### Opción B: Docker (Recomendado para desarrollo)

```bash
cd frontend
docker-compose up -d
```

Esto iniciará SQL Server en un contenedor. Ajusta las credenciales en `docker-compose.yml` y `.env` según necesites.

### Paso 4: Configurar el Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend/` (opcional, si el backend está en otro puerto):

```env
VITE_API_URL=http://localhost:3000
```

### Paso 5: Iniciar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## ⚙️ Configuración

### Variables de Entorno del Backend

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DB_SERVER` | Servidor de SQL Server | `localhost` |
| `DB_DATABASE` | Nombre de la base de datos | `PersonalFinanceDB` |
| `DB_USER` | Usuario de SQL Server | `sa` |
| `DB_PASSWORD` | Contraseña de SQL Server | - |
| `DB_PORT` | Puerto de SQL Server | `1433` |
| `DB_ENCRYPT` | Habilitar encriptación | `false` |
| `PORT` | Puerto del servidor Express | `3000` |

### Variables de Entorno del Frontend

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del backend API | `http://localhost:3000` |

## 🏗 Arquitectura

### Patrón de Arquitectura

El proyecto sigue una **arquitectura en capas** con separación clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌──────────┐  ┌─────────────────┐  │
│  │  Pages   │  │   Components    │  │
│  └────┬─────┘  └────────┬────────┘  │
│       │                 │            │
│  ┌────▼─────────────────▼────────┐   │
│  │      Services (API Client)    │   │
│  └──────────────┬────────────────┘   │
└─────────────────┼────────────────────┘
                  │ HTTP/REST
┌─────────────────▼────────────────────┐
│      Backend (Node.js/Express)        │
│  ┌─────────────────────────────────┐ │
│  │        Routes                    │ │
│  └──────────────┬──────────────────┘ │
│  ┌──────────────▼──────────────────┐ │
│  │      Controllers                │ │
│  └──────────────┬──────────────────┘ │
│  ┌──────────────▼──────────────────┐ │
│  │      Services (Business Logic)  │ │
│  └──────────────┬──────────────────┘ │
│  ┌──────────────▼──────────────────┐ │
│  │      Repositories (Data Access) │ │
│  └──────────────┬──────────────────┘ │
└─────────────────┼────────────────────┘
                  │
┌─────────────────▼────────────────────┐
│      SQL Server Database             │
└──────────────────────────────────────┘
```

### Capas del Backend

1. **Routes**: Define los endpoints y asocia controladores
2. **Controllers**: Maneja las peticiones HTTP, valida entrada, llama a servicios
3. **Services**: Contiene la lógica de negocio (validaciones, cálculos, reglas)
4. **Repositories**: Acceso a datos, queries SQL, abstracción de la base de datos
5. **Domain**: Modelos de dominio (opcional, para validaciones adicionales)

### Componentes del Frontend

- **Pages**: Páginas principales de la aplicación (Dashboard, Transacciones, etc.)
- **Components**: Componentes reutilizables organizados por funcionalidad
- **Services**: Clientes API para comunicación con el backend
- **Utils**: Utilidades (formateo de moneda, fechas, etc.)
- **Context**: Estado global de la aplicación (si es necesario)

## Decisiones Técnicas Clave

### 1. **Repository Pattern**
- **Decisión**: Implementar un `BaseRepository` con métodos comunes
- **Razón**: Reduce duplicación de código, facilita mantenimiento y testing
- **Beneficio**: Cambios en la estructura de datos se centralizan

### 2. **Single Profile System**
- **Decisión**: Sistema simplificado con un solo perfil por defecto (ID: 1)
- **Razón**: Simplifica la arquitectura para uso personal/local
- **Implementación**: `DEFAULT_PROFILE_ID = 1` en todos los repositorios

### 3. **Currency: ARS (Pesos Argentinos)**
- **Decisión**: Moneda única fija en ARS
- **Razón**: Optimizado para el mercado argentino
- **Implementación**: Formateo consistente con `Intl.NumberFormat`

### 4. **SQL Server como Base de Datos**
- **Decisión**: Usar SQL Server en lugar de PostgreSQL/MySQL
- **Razón**: Requisito del proyecto, compatibilidad con ecosistema Microsoft
- **Beneficio**: Transacciones ACID, integridad referencial robusta

### 5. **Foreign Keys con SET NULL**
- **Decisión**: Usar `ON DELETE SET NULL` para relaciones opcionales
- **Razón**: Permite eliminar entidades padre sin perder datos históricos
- **Ejemplo**: Eliminar una tarjeta no elimina las transacciones, solo las desvincula

### 6. **Validación en Frontend y Backend**
- **Decisión**: Validación en ambas capas
- **Razón**: Mejor UX (feedback inmediato) + seguridad (validación en servidor)
- **Implementación**: Validación en formularios React + Express Validator

### 7. **Componentes Modales Reutilizables**
- **Decisión**: Modales genéricos (`ConfirmDialog`, `Notification`)
- **Razón**: Consistencia UI, menos código duplicado
- **Beneficio**: Fácil mantenimiento y actualización de estilos

### 8. **Notificaciones Elegantes**
- **Decisión**: Reemplazar `alert()` y `prompt()` nativos
- **Razón**: Mejor UX, diseño consistente, auto-cierre
- **Implementación**: Componente `Notification` con tipos (success, error, info, warning)

## Dashboard

El Dashboard es el corazón de la aplicación, proporcionando una vista completa del estado financiero.

### Componentes del Dashboard

1. **KPI Summary**
   - Balance Total del mes
   - Ingresos Totales
   - Gastos Totales
   - Ahorro (Ingresos - Gastos)

2. **Expense by Category Chart**
   - Gráfico de barras mostrando gastos por categoría
   - Colores diferenciados por categoría
   - Tooltips con montos exactos

3. **Recent Transactions**
   - Lista de las últimas transacciones
   - Filtros por tipo (Ingreso/Gasto)
   - Búsqueda por descripción
   - Acciones rápidas (editar, eliminar)

4. **Fecha Actual**
   - Muestra el día actual en formato legible
   - Ejemplo: "Miércoles 17 / Diciembre / 2026"

### Procesamiento Automático

- **Sueldo Automático**: Si está configurado, el sistema verifica y procesa el sueldo al cargar el dashboard
- **Cuotas Pendientes**: El sistema puede procesar cuotas de tarjetas automáticamente

## 🗺 Roadmap y Mejoras Futuras

### Mejoras Inmediatas
- Exportación de reportes a PDF/Excel
- Filtros avanzados en transacciones (múltiples categorías)
- Notificaciones push para alertas de presupuesto
- Modo oscuro

### Funcionalidades Avanzadas
- Sistema de etiquetas/tags para transacciones
- Recurrencia automática de transacciones
- Proyecciones financieras (forecasting)
- Integración con APIs bancarias (Open Banking)
- App móvil (React Native)

### Inteligencia Artificial
- Categorización automática de transacciones (ML)
- Predicción de gastos futuros
- Recomendaciones personalizadas de ahorro
- Detección de patrones de gasto

Desarollado por Kevin Alajarin - 2025
