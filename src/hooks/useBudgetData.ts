
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BudgetItem } from '@/types/budget';

export interface BudgetData {
  id: string;
  project_id: string;
  client: string;
  version: number;
  issue_date: string;
  discount_doc: number;
  iva_pct: number;
  items: BudgetItem[];
}

export interface UseBudgetDataResult {
  budget: BudgetData;
  setBudget: React.Dispatch<React.SetStateAction<BudgetData>>;
  loading: boolean;
  error: Error | null;
  formatCurrency: (value: number) => string;
  updateBudgetItems: (items: BudgetItem[]) => void;
}

export const useBudgetData = (budgetId: string): UseBudgetDataResult => {
  const [budget, setBudget] = useState<BudgetData>({
    id: budgetId,
    project_id: '1',
    client: 'Corporación ABC',
    version: 1,
    issue_date: '2023-05-15',
    discount_doc: 0,
    iva_pct: 0.1,
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from Supabase
        // const { data: budgetData, error: budgetError } = await supabase
        //   .from('budget_docs')
        //   .select('*')
        //   .eq('id', budgetId)
        //   .single();
        
        // if (budgetError) throw budgetError;
        
        // const { data: budgetItems, error: itemsError } = await supabase
        //   .from('budget_items')
        //   .select('*')
        //   .eq('budget_id', budgetId);
        
        // if (itemsError) throw itemsError;
        
        // setBudget({
        //   ...budgetData,
        //   items: budgetItems || []
        // });

        // Simulate API response with mock data
        setTimeout(() => {
          setBudget({
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
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    if (budgetId) {
      fetchBudget();
    } else {
      setLoading(false);
    }
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
    
    // In a real implementation, this would update the items in Supabase
    // const updateItems = async () => {
    //   try {
    //     // Loop through items and upsert them
    //     for (const item of items) {
    //       await supabase
    //         .from('budget_items')
    //         .upsert(item, { onConflict: 'id' });
    //     }
    //   } catch (err) {
    //     console.error('Error updating budget items:', err);
    //   }
    // };
    
    // updateItems();
  };

  return {
    budget,
    setBudget,
    loading,
    error,
    formatCurrency,
    updateBudgetItems
  };
};
