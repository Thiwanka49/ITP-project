import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  supplierId: string;
  quantity: number;
  price: number;
  status: 'available' | 'maintenance' | 'out-of-stock';
  purchaseDate: Date;
}

interface EquipmentContextType {
  suppliers: Supplier[];
  equipment: Equipment[];
  loading: boolean;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Promise<any>;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<any>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [suppliersRes, equipmentRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/suppliers`),
        axios.get(`${API_BASE_URL}/equipment`)
      ]);

      const mappedSuppliers = suppliersRes.data.map((s: any) => ({
        ...s,
        id: s._id,
        createdAt: new Date(s.createdAt)
      }));

      const mappedEquipment = equipmentRes.data.map((e: any) => ({
        ...e,
        id: e._id,
        supplierId: e.supplierId?._id || e.supplierId, // Handle populated or unpopulated
        purchaseDate: new Date(e.purchaseDate)
      }));

      setSuppliers(mappedSuppliers);
      setEquipment(mappedEquipment);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the backend server. Please ensure the server is running.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/suppliers`, supplier);
      await fetchData();
      toast({
        title: "Success",
        description: "Supplier added successfully",
      });
      return res.data; // Return the new supplier
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add supplier",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addEquipment = async (eq: Omit<Equipment, 'id'>) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/equipment`, eq);
      await fetchData();
      toast({
        title: "Success",
        description: "Equipment added successfully",
      });
      return res.data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add equipment",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSupplier = async (id: string, data: Partial<Supplier>) => {
    try {
      await axios.put(`${API_BASE_URL}/suppliers/${id}`, data);
      await fetchData();
      toast({
        title: "Updated",
        description: "Supplier updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive"
      });
    }
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    try {
      await axios.put(`${API_BASE_URL}/equipment/${id}`, data);
      await fetchData();
      toast({
        title: "Updated",
        description: "Equipment updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update equipment",
        variant: "destructive"
      });
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
      await fetchData();
      toast({
        title: "Deleted",
        description: "Supplier removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive"
      });
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/equipment/${id}`);
      await fetchData();
      toast({
        title: "Deleted",
        description: "Equipment removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete equipment",
        variant: "destructive"
      });
    }
  };

  return (
    <EquipmentContext.Provider value={{
      suppliers,
      equipment,
      loading,
      addSupplier,
      addEquipment,
      updateSupplier,
      updateEquipment,
      deleteSupplier,
      deleteEquipment,
      refreshData: fetchData
    }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within EquipmentProvider');
  }
  return context;
}
