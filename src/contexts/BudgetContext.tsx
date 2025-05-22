
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BudgetItem } from '@/types/budget';

interface BudgetData {
  id: string;
  project_id: string;
  client: string;
  version: number;
  issue_date: string;
  discount_doc: number;
  iva_pct: number;
  items: BudgetItem[];
}

interface BudgetContextType {
  budget: BudgetData;
  setBudget: React.Dispatch<React.SetStateAction<BudgetData>>;
  formatCurrency: (value: number) => string;
  updateBudgetItems: (items: BudgetItem[]) => void;
  loading: boolean;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
  budgetId: string;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children, budgetId }) => {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<BudgetData>({
    id: budgetId,
    project_id: '1',
    client: 'Corporación ABC',
    version: 1,
    issue_date: '2023-05-15',
    discount_doc: 0,
    iva_pct: 0.1,
    items: [
      {
        id: '1',
        doc_id: budgetId,
        item_no: 1,
        description: 'Cartel Corporativo',
        category: 'cartel',
        color: 'Azul',
        faces: 2,
        height_cm: 200,
        width_cm: 300,
        area_m2: 6,
        area_m2_ceil: 6,
        qty: 1,
        unit_price: 5000000,
        discount_pct: 0,
        total_gs: 5000000
      },
      {
        id: '2',
        doc_id: budgetId,
        item_no: 2,
        description: 'Letras Corpóreas',
        category: 'corporeo',
        color: 'Plata',
        faces: 1,
        height_cm: 50,
        width_cm: 400,
        area_m2: 2,
        area_m2_ceil: 2,
        qty: 10,
        unit_price: 800000,
        discount_pct: 0.05,
        total_gs: 7600000
      }
    ]
  });

  // In a real implementation, this would fetch data from the API
  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // In a real implementation, we would fetch budget data from Supabase
    // const fetchBudget = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('budget_docs')
    //       .select('*, budget_items(*)')
    //       .eq('id', budgetId)
    //       .single();
    //     
    //     if (error) throw error;
    //     
    //     setBudget({
    //       ...data,
    //       items: data.budget_items || []
    //     });
    //   } catch (error) {
    //     console.error('Error fetching budget:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // 
    // fetchBudget();
  }, [budgetId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };

  const updateBudgetItems = (items: BudgetItem[]) => {
    setBudget(prev => ({
      ...prev,
      items
    }));
  };

  const value = {
    budget,
    setBudget,
    formatCurrency,
    updateBudgetItems,
    loading
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
