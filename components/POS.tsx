import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CartItem, ProductType, Sale } from '../types';
import { Icons } from '../constants';

const POS: React.FC = () => {
  const { data, addSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(data.clients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'PAYMENT'>('CART');

  // Search logic
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const lower = searchTerm.toLowerCase();
    return data.products.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.code.includes(lower) ||
      p.activeIngredient?.toLowerCase().includes(lower)
    );
  }, [searchTerm, data.products]);

  const addToCart = (product: Product) => {
    // Check stock across all batches
    const totalStock = product.batches.reduce((sum, b) => sum + b.quantity, 0);
    
    if (totalStock <= 0) {
      alert("Producto agotado");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= totalStock) return prev; // Cannot exceed stock
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      
      // Auto-select first batch with stock for simplicity, logic can be enhanced for strict batch selection
      const validBatch = product.batches.find(b => b.quantity > 0);
      return [...prev, { ...product, quantity: 1, selectedBatchId: validBatch?.id }];
    });
    setSearchTerm('');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const product = data.products.find(p => p.id === productId);
        const totalStock = product?.batches.reduce((sum, b) => sum + b.quantity, 0) || 0;
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= totalStock) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Compliance Check
  const requiresPrescription = cart.some(item => 
    item.type === ProductType.ANTIBIOTIC || item.type === ProductType.CONTROLLED
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (requiresPrescription && !selectedDoctorId) {
      setShowDoctorModal(true);
      return;
    }
    
    const newSale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      total: cartTotal,
      items: [...cart],
      clientId: selectedClientId,
      doctorId: requiresPrescription ? selectedDoctorId : undefined,
      paymentMethod: 'CASH' // Simplified
    };

    addSale(newSale);
    setCart([]);
    setSelectedDoctorId('');
    setCheckoutStep('CART');
    alert('Venta realizada con éxito. Ticket generado.');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Buscar producto (Nombre, Código, Sustancia)..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map(product => {
                const stock = product.batches.reduce((s, b) => s + b.quantity, 0);
                return (
                  <div key={product.id} 
                    onClick={() => addToCart(product)}
                    className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition flex justify-between items-center group">
                    <div>
                      <h4 className="font-semibold text-slate-800">{product.name}</h4>
                      <p className="text-xs text-slate-500">{product.activeIngredient}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">${product.price}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${stock > 0 ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600'}`}>
                          Stock: {stock}
                        </span>
                      </div>
                      {product.type !== ProductType.GENERAL && (
                         <span className="mt-1 inline-block text-[10px] px-1.5 py-0.5 border border-amber-200 text-amber-700 bg-amber-50 rounded">
                           ⚠️ {product.type}
                         </span>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 text-emerald-600">
                      <Icons.Plus />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Icons.Search />
              <p className="mt-2">Busca productos para comenzar la venta</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart / Sidebar */}
      <div className="w-full lg:w-96 bg-white flex flex-col rounded-xl shadow-lg border border-slate-200 h-[calc(100vh-140px)] sticky top-4">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Icons.POS /> Ticket de Venta
          </h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-slate-400 mt-10 italic">El carrito está vacío</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-white border border-slate-100 rounded shadow-sm">
                <div className="flex-1">
                   <p className="font-medium text-sm truncate">{item.name}</p>
                   <p className="text-xs text-slate-500">${item.price} x {item.quantity}</p>
                   {(item.type === ProductType.ANTIBIOTIC || item.type === ProductType.CONTROLLED) && (
                     <span className="text-[10px] text-amber-600 font-bold">Requiere Receta</span>
                   )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100 rounded">-</button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100 rounded">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-2"><Icons.Trash /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-emerald-800">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-500 uppercase">Cliente</label>
             <select 
              value={selectedClientId} 
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full p-2 text-sm border border-slate-300 rounded bg-white"
             >
               {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
          </div>

          {requiresPrescription && (
             <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
               ⚠️ Esta venta incluye medicamentos controlados. Se requerirá seleccionar médico.
             </div>
          )}

          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
            Cobrar
          </button>
        </div>
      </div>

      {/* Doctor Selection Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-red-600">Control de Antibióticos</h3>
            <p className="mb-4 text-sm text-slate-600">Seleccione el médico que prescribe para cumplir con la normativa COFEPRIS.</p>
            
            <label className="block text-sm font-medium mb-1">Médico</label>
            <select 
              className="w-full p-2 border rounded mb-4"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Seleccione un médico...</option>
              {data.doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} - Ced: {d.licenseNumber}</option>
              ))}
            </select>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDoctorModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
              <button 
                onClick={() => {
                  if(selectedDoctorId) {
                    setShowDoctorModal(false);
                    handleCheckout(); // Retry checkout
                  }
                }}
                disabled={!selectedDoctorId} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;