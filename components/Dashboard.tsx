import React from 'react';
import { useStore } from '../context/StoreContext';
import { Icons } from '../constants';
import { ProductType } from '../types';

const Dashboard: React.FC = () => {
  const { data } = useStore();

  // Calculations
  const today = new Date().toISOString().split('T')[0];
  const salesToday = data.sales.filter(s => s.date.startsWith(today));
  const totalSalesToday = salesToday.reduce((acc, curr) => acc + curr.total, 0);

  const lowStockProducts = data.products.filter(p => {
    const totalStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
    return totalStock <= p.minStock;
  });

  const expiringBatches = data.products.flatMap(p => 
    p.batches.filter(b => {
      const expiry = new Date(b.expiryDate);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 90 && diffDays > 0; // Expiring in next 90 days
    }).map(b => ({ ...b, productName: p.name }))
  );

  const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
    <div className={`p-6 rounded-xl shadow-sm border border-slate-100 bg-white flex items-center space-x-4`}>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas de Hoy" 
          value={`$${totalSalesToday.toFixed(2)}`} 
          icon={<Icons.POS />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Transacciones" 
          value={salesToday.length} 
          icon={<Icons.Reports />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Bajo Stock" 
          value={lowStockProducts.length} 
          icon={<Icons.Alert />} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Por Caducar (90 días)" 
          value={expiringBatches.length} 
          icon={<Icons.Inventory />} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
            <span className="text-amber-500"><Icons.Alert /></span>
            Alerta de Reabastecimiento
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2">Stock Actual</th>
                  <th className="px-4 py-2">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.slice(0, 5).map(p => {
                  const currentStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium">{p.name}</td>
                      <td className="px-4 py-2 text-rose-600 font-bold">{currentStock}</td>
                      <td className="px-4 py-2">{p.minStock}</td>
                    </tr>
                  );
                })}
                {lowStockProducts.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-4 text-slate-400">Todo en orden</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiring Batches */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
            <span className="text-rose-500"><Icons.Inventory /></span>
            Lotes Próximos a Caducar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2">Lote</th>
                  <th className="px-4 py-2">Caducidad</th>
                </tr>
              </thead>
              <tbody>
                {expiringBatches.slice(0, 5).map((b, idx) => (
                  <tr key={`${b.id}-${idx}`} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{b.productName}</td>
                    <td className="px-4 py-2">{b.batchNumber}</td>
                    <td className="px-4 py-2 text-rose-600">{b.expiryDate}</td>
                  </tr>
                ))}
                 {expiringBatches.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-4 text-slate-400">Sin lotes por caducar</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;