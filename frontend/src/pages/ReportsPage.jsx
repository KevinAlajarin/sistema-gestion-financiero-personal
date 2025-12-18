import React, { useState } from 'react';
import reportService from '../services/reportService';
import { FileDown, FileText, ShieldCheck } from 'lucide-react';

const ReportsPage = () => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await reportService.downloadTransactions();
        } catch (error) {
            alert("Error descargando reporte.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Reportes y Exportación</h2>
                <p className="text-slate-500 text-sm">Descarga tus datos para análisis externo o copias de seguridad</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Exportación CSV Completa</h3>
                        </div>
                        <p className="text-slate-300 max-w-md mb-6 leading-relaxed">
                            Obtén un archivo detallado con todas tus transacciones, incluyendo fechas, categorías, métodos de pago y descripciones. Compatible con Excel y Google Sheets.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <ShieldCheck size={14} />
                            <span>Datos seguros y encriptados localmente</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleDownload}
                        disabled={downloading}
                        className="bg-white text-slate-900 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap"
                    >
                        {downloading ? (
                            <span className="animate-pulse">Generando...</span>
                        ) : (
                            <>
                                <FileDown size={20} />
                                Descargar Reporte
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;