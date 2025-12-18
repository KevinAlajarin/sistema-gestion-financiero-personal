# Personal Finance Manager (Local Edition)

Sistema de gestión financiera multi-perfil diseñado para uso personal avanzado.
Desarrollado con Node.js, SQL Server y React + Vite.

## 🚀 Características Implementadas

1.  **Multi-Tenancy Local:** Gestión separada de perfiles (ej: Personal, Hogar, Negocio) en una sola instancia.
2.  **Dashboard Analítico:** KPIs en tiempo real, desglose de gastos y tendencias.
3.  **Motor de Cuotas (Installments):** Gestión avanzada de compras con tarjeta de crédito en cuotas, impacto mensual automático y control de límites.
4.  **Presupuestos:** Control visual (semáforo) de gastos vs planificado por categoría.
5.  **Metas de Ahorro:** Tracking de objetivos financieros con barras de progreso.
6.  **Reportes:** Exportación de datos a CSV para análisis externo.

## 🛠 Stack Tecnológico

-   **Backend:** Node.js, Express, MSSQL (driver nativo).
-   **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons.
-   **Database:** Microsoft SQL Server 2022.

## 📦 Instalación y Ejecución

### 1. Base de Datos
```bash
docker-compose up -d