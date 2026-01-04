import React from 'react';
import { ViewState } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, toggleSidebar }) => {
  const NavItem = ({ view, label, icon }: { view: ViewState, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => { onChangeView(view); if(window.innerWidth < 1024) toggleSidebar(); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition mb-1
        ${currentView === view ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={toggleSidebar}></div>
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-xl">P</div>
          <h1 className="text-xl font-bold tracking-tight">PHARMA<span className="text-emerald-400">CLIC</span></h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2 pl-4">Operaciones</p>
          <NavItem view={ViewState.DASHBOARD} label="Panel Control" icon={<Icons.Dashboard />} />
          <NavItem view={ViewState.POS} label="Punto de Venta" icon={<Icons.POS />} />
          <NavItem view={ViewState.INVENTORY} label="Inventario" icon={<Icons.Inventory />} />
          
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2 mt-6 pl-4">Gestión</p>
          <NavItem view={ViewState.REPORTS} label="Reportes" icon={<Icons.Reports />} />
          <NavItem view={ViewState.CLIENTS} label="Clientes" icon={<Icons.Clients />} />
          <NavItem view={ViewState.DOCTORS} label="Médicos" icon={<Icons.Doctors />} />

          <p className="text-xs font-semibold text-slate-500 uppercase mb-2 mt-6 pl-4">Herramientas</p>
          <NavItem view={ViewState.AI_ASSISTANT} label="Asistente IA" icon={<Icons.AI />} />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800 rounded-lg p-3">
             <p className="text-xs text-slate-400">Usuario Actual</p>
             <p className="font-medium text-sm">Admin Farmacia</p>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;