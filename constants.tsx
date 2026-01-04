import React from 'react';
import { Product, ProductType, Client, Doctor } from './types';

// Icons as SVG components
export const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
  POS: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>,
  Inventory: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
  Reports: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
  Clients: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Doctors: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 0 0 5 2h14a.3.3 0 0 0 .2.3l-3.6 5a.3.3 0 0 1-.2.1H8.6a.3.3 0 0 1-.2-.1l-3.6-5Z" /><path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /><path d="M11 12h2" /><path d="M12 11v2" /></svg>,
  AI: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    code: '7501000001',
    name: 'Amoxicilina 500mg',
    description: 'Caja con 12 cápsulas',
    price: 85.00,
    type: ProductType.ANTIBIOTIC,
    activeIngredient: 'Amoxicilina',
    minStock: 10,
    batches: [
      { id: 'b1', batchNumber: 'A100', expiryDate: '2025-12-01', quantity: 50, cost: 40.00 },
      { id: 'b2', batchNumber: 'A102', expiryDate: '2024-06-01', quantity: 10, cost: 42.00 }
    ]
  },
  {
    id: '2',
    code: '7501000002',
    name: 'Paracetamol 500mg',
    description: 'Caja con 20 tabletas',
    price: 25.00,
    type: ProductType.GENERAL,
    activeIngredient: 'Paracetamol',
    minStock: 20,
    batches: [
      { id: 'b3', batchNumber: 'P200', expiryDate: '2026-01-15', quantity: 100, cost: 10.00 }
    ]
  },
  {
    id: '3',
    code: '7501000003',
    name: 'Clonazepam 2mg',
    description: 'Caja con 30 tabletas',
    price: 350.00,
    type: ProductType.CONTROLLED,
    activeIngredient: 'Clonazepam',
    minStock: 5,
    batches: [
      { id: 'b4', batchNumber: 'C300', expiryDate: '2025-08-20', quantity: 15, cost: 200.00 }
    ]
  },
  {
    id: '4',
    code: '7501000004',
    name: 'Vendas Elásticas 5cm',
    description: 'Paquete individual',
    price: 15.00,
    type: ProductType.MATERIAL,
    minStock: 10,
    batches: [
      { id: 'b5', batchNumber: 'V400', expiryDate: '2028-01-01', quantity: 40, cost: 5.00 }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Publico General', email: '', phone: '' },
  { id: 'c2', name: 'Juan Perez', email: 'juan@example.com', phone: '555-0123' },
];

export const INITIAL_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Simi Smith', licenseNumber: '12345678', specialty: 'General', phone: '555-9999' },
  { id: 'd2', name: 'Dra. House', licenseNumber: '87654321', specialty: 'Neurología', phone: '555-8888' },
];