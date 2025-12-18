import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, CreditCard, PieChart, PiggyBank, Bell, FileText } from 'lucide-react';
import { clsx } from 'clsx';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1",
        isActive 
          ? "bg-primary text-white shadow-md" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <PieChart className="text-primary" />
          MisCuentas
        </h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/transactions" icon={Receipt} label="Movimientos" />
        <NavItem to="/cards" icon={CreditCard} label="Tarjetas & Cuotas" />
        <NavItem to="/budgets" icon={PieChart} label="Presupuestos" />
        <NavItem to="/savings" icon={PiggyBank} label="Metas Ahorro" />
        <NavItem to="/reports" icon={FileText} label="Reportes" />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-400 text-center">
          v1.0.0 - Local Edition
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;