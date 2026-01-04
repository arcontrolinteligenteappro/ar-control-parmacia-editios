import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductType, Product, Batch } from '../types';
import { Icons } from '../constants';

const Inventory: React.FC = () => {
  const { data, addProduct, updateProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    type: ProductType.GENERAL,
    batches: []
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        id: Date.now().toString(),
        type: ProductType.GENERAL,
        batches: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.price) return;

    const productToSave = formData as Product;
    
    if (editingProduct) {
      updateProduct(productToSave);
    } else {
      addProduct(productToSave);
    }
    setIsModalOpen(false);
  };

  const handleAddBatch = () => {
    const newBatch: Batch = {
      id: Date.now().toString(),
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      cost: 0
    };
    setFormData(prev => ({
      ...prev,
      batches: [...(prev.batches || []), newBatch]
    }));
  };

  const updateBatch = (index: number, field: keyof Batch, value: any) => {
    const newBatches = [...(formData.batches || [])];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setFormData({ ...formData, batches: newBatches });
  };

  const removeBatch = (index: number) => {
    const newBatches = [...(formData.batches || [])];
    newBatches.splice(index, 1);
    setFormData({ ...formData, batches: newBatches });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Inventario y Lotes</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Icons.Plus /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Total Stock</th>
              <th className="px-6 py-3">Lotes</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.products.map(product => {
              const totalStock = product.batches.reduce((sum, b) => sum + b.quantity, 0);
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs">{product.code}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.activeIngredient}</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-[10px] px-2 py-1 rounded-full border ${
                       product.type === ProductType.GENERAL ? 'bg-slate-100 border-slate-200' : 'bg-amber-50 border-amber-200 text-amber-700'
                     }`}>
                       {product.type}
                     </span>
                  </td>
                  <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={totalStock <= product.minStock ? 'text-red-600 font-bold' : 'text-emerald-600'}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {product.batches.length > 0 ? (
                      <div className="space-y-1">
                        {product.batches.map(b => (
                          <div key={b.id} className="flex gap-2">
                             <span className="font-mono bg-slate-100 px-1 rounded">{b.batchNumber}</span>
                             <span className={new Date(b.expiryDate) < new Date() ? 'text-red-500' : 'text-slate-500'}>
                               Exp: {b.expiryDate}
                             </span>
                             <span className="font-bold">({b.quantity})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-red-400">Sin Lotes</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:underline">Editar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
               <h3 className="font-bold text-xl">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Código de Barras</label>
                  <input required className="w-full border p-2 rounded" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Comercial</label>
                  <input required className="w-full border p-2 rounded" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sustancia Activa</label>
                  <input className="w-full border p-2 rounded" value={formData.activeIngredient || ''} onChange={e => setFormData({...formData, activeIngredient: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Venta</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Producto</label>
                  <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ProductType})}>
                    {Object.values(ProductType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
                  <input type="number" className="w-full border p-2 rounded" value={formData.minStock || ''} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} />
                </div>
              </div>

              {/* Batches Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-700">Lotes y Caducidades</h4>
                  <button type="button" onClick={handleAddBatch} className="text-sm text-emerald-600 hover:underline flex items-center gap-1"><Icons.Plus /> Agregar Lote</button>
                </div>
                
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  {formData.batches && formData.batches.length > 0 ? (
                    formData.batches.map((batch, idx) => (
                      <div key={batch.id || idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end border-b border-slate-200 pb-2 last:border-0">
                        <div>
                          <label className="text-xs text-slate-500">No. Lote</label>
                          <input required className="w-full p-1 text-sm border rounded" value={batch.batchNumber} onChange={e => updateBatch(idx, 'batchNumber', e.target.value)} />
                        </div>
                        <div>
                           <label className="text-xs text-slate-500">Caducidad</label>
                           <input required type="date" className="w-full p-1 text-sm border rounded" value={batch.expiryDate} onChange={e => updateBatch(idx, 'expiryDate', e.target.value)} />
                        </div>
                        <div>
                           <label className="text-xs text-slate-500">Cantidad</label>
                           <input required type="number" className="w-full p-1 text-sm border rounded" value={batch.quantity} onChange={e => updateBatch(idx, 'quantity', parseInt(e.target.value))} />
                        </div>
                        <div>
                           <label className="text-xs text-slate-500">Costo Unit.</label>
                           <input type="number" step="0.01" className="w-full p-1 text-sm border rounded" value={batch.cost} onChange={e => updateBatch(idx, 'cost', parseFloat(e.target.value))} />
                        </div>
                        <button type="button" onClick={() => removeBatch(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded text-xs">Eliminar</button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center">No hay lotes registrados.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;