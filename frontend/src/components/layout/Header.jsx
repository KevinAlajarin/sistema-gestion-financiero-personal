import React, { useState } from 'react';
import SalaryConfig from '../salary/SalaryConfig';
import { DollarSign } from 'lucide-react';

const Header = () => {
    const [showSalaryConfig, setShowSalaryConfig] = useState(false);

    return (
        <>
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-slate-700">
                    Panel de Control
                </h2>
                
                <button
                    onClick={() => setShowSalaryConfig(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors"
                >
                    <DollarSign size={18} />
                    <span className="hidden md:inline">Configuración de Sueldo</span>
                    <span className="md:hidden">Sueldo</span>
                </button>
            </header>

            {showSalaryConfig && (
                <SalaryConfig onClose={() => setShowSalaryConfig(false)} />
            )}
        </>
    );
};

export default Header;