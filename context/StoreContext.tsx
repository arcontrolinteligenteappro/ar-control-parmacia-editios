import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Client, Doctor, Sale, StoreData, Batch } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CLIENTS, INITIAL_DOCTORS } from '../constants';

interface StoreContextType {
  data: StoreData;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  addSale: (sale: Sale) => void;
  addClient: (client: Client) => void;
  addDoctor: (doctor: Doctor) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'PHARMACLIC_DB_V1';

const getInitialData = (): StoreData => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    products: INITIAL_PRODUCTS,
    clients: INITIAL_CLIENTS,
    doctors: INITIAL_DOCTORS,
    sales: [],
    cashRegister: 1500.00 // Start float
  };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StoreData>(getInitialData);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addProduct = (product: Product) => {
    setData(prev => ({ ...prev, products: [...prev.products, product] }));
  };

  const updateProduct = (updatedProduct: Product) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const addSale = (sale: Sale) => {
    setData(prev => {
      // Deduct stock
      const updatedProducts = [...prev.products];
      sale.items.forEach(item => {
        const prodIndex = updatedProducts.findIndex(p => p.id === item.id);
        if (prodIndex > -1) {
          const product = { ...updatedProducts[prodIndex] };
          // Logic to deduct from batches (FIFO or specific batch)
          // For this app, we will deduct from the specific batch selected in POS or the first available
          if (product.batches.length > 0) {
            const batchIndex = product.batches.findIndex(b => b.id === (item.selectedBatchId || product.batches[0].id));
            if (batchIndex > -1) {
               const newBatches = [...product.batches];
               newBatches[batchIndex] = {
                 ...newBatches[batchIndex],
                 quantity: newBatches[batchIndex].quantity - item.quantity
               };
               product.batches = newBatches;
               updatedProducts[prodIndex] = product;
            }
          }
        }
      });

      return {
        ...prev,
        sales: [sale, ...prev.sales],
        products: updatedProducts,
        cashRegister: prev.cashRegister + sale.total
      };
    });
  };

  const addClient = (client: Client) => {
    setData(prev => ({ ...prev, clients: [...prev.clients, client] }));
  };

  const addDoctor = (doctor: Doctor) => {
    setData(prev => ({ ...prev, doctors: [...prev.doctors, doctor] }));
  };

  const resetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData(getInitialData());
  };

  return (
    <StoreContext.Provider value={{ data, addProduct, updateProduct, addSale, addClient, addDoctor, resetData }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};