export enum ProductType {
  GENERAL = 'General',
  ANTIBIOTIC = 'Antibiótico',
  CONTROLLED = 'Controlado (Psicotrópico)',
  MATERIAL = 'Material de Curación'
}

export interface Batch {
  id: string;
  batchNumber: string; // Numero de Lote
  expiryDate: string; // Fecha Caducidad
  quantity: number;
  cost: number;
}

export interface Product {
  id: string;
  code: string; // Barcode
  name: string;
  description: string;
  price: number; // Sale price
  type: ProductType;
  minStock: number;
  activeIngredient?: string; // Sustancia activa
  batches: Batch[];
}

export interface Doctor {
  id: string;
  name: string;
  licenseNumber: string; // Cedula Profesional
  specialty: string;
  phone: string;
}

export interface Client {
  id: string;
  name: string;
  rfc?: string;
  email: string;
  phone: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedBatchId?: string; // Which batch are we selling from (FIFO usually, but manual here for simplicity)
}

export interface Sale {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
  clientId?: string;
  doctorId?: string; // Required for Antibiotics/Controlled
  paymentMethod: 'CASH' | 'CARD' | 'OTHER';
}

export interface StoreData {
  products: Product[];
  clients: Client[];
  doctors: Doctor[];
  sales: Sale[];
  cashRegister: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  POS = 'POS',
  INVENTORY = 'INVENTORY',
  REPORTS = 'REPORTS',
  CLIENTS = 'CLIENTS',
  DOCTORS = 'DOCTORS',
  SETTINGS = 'SETTINGS',
  AI_ASSISTANT = 'AI_ASSISTANT'
}