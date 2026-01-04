import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Reports: React.FC = () => {
  const { data } = useStore();

  // Prepare data for charts
  const salesByDay = data.sales.reduce((acc, sale) => {
    const date = sale.date.split('T')[0];
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(salesByDay).map(date => ({
    date,
    total: salesByDay[date]
  })).sort((a,b) => a.date.localeCompare(b.date)).slice(-7); // Last 7 days

  const topProducts = data.products.map(p => {
    const soldQty = data.sales.flatMap(s => s.items).filter(i => i.id === p.id).reduce((sum, i) => sum + i.quantity, 0);
    return { name: p.name, quantity: soldQty };
  }).sort((a,b) => b.quantity - a.quantity).slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Reportes y Estadísticas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="font-bold text-slate-600 mb-4">Ventas Últimos 7 Días</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="font-bold text-slate-600 mb-4">Productos Más Vendidos</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, bottom: 20, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
              <Tooltip />
              <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-600 mb-4">Últimas Transacciones</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">ID Venta</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.sales.slice(0, 10).map(sale => (
                <tr key={sale.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-2 font-mono">{sale.id.slice(-6)}</td>
                  <td className="px-4 py-2">{new Date(sale.date).toLocaleString()}</td>
                  <td className="px-4 py-2">{sale.items.length} productos</td>
                  <td className="px-4 py-2 font-bold">${sale.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;