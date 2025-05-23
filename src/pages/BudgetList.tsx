
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { Button } from "@/components/ui/button";
import BudgetTable from '@/components/budget/BudgetTable';
import EmptyBudgetState from '@/components/budget/EmptyBudgetState';
import LoadingState from '@/components/budget/LoadingState';
import BudgetCreateDialog from '@/components/budget/BudgetCreateDialog';
import { Database } from '@/integrations/supabase/types';

type BudgetDoc = Database['public']['Tables']['budget_docs']['Row'];

interface BudgetDocWithClient extends BudgetDoc {
  client?: string;
  version?: number;
  issue_date?: string;
  discount_doc?: number;
  iva_pct?: number;
  subtotal?: number;
  iva?: number;
  total?: number;
}

const BudgetList = () => {
  const { notifyError } = useToastNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [budgets, setBudgets] = useState<BudgetDocWithClient[]>([]);
  const [fetchingBudgets, setFetchingBudgets] = useState(true);
  
  useEffect(() => {
    fetchBudgets();
  }, []);
  
  const fetchBudgets = async () => {
    setFetchingBudgets(true);
    try {
      const { data, error } = await supabase
        .from('budget_docs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching budgets:', error);
        notifyError('Error al cargar presupuestos: ' + error.message);
        throw error;
      }
      
      // For demo purposes, we'll add the client info manually
      // In a real implementation, you would join with a clients table
      const enhancedData = data.map(budget => ({
        ...budget,
        client: 'Cliente ' + budget.id.substring(0, 4),
        version: 1,
        issue_date: new Date().toISOString(),
        discount_doc: 0,
        iva_pct: 0.1,
        subtotal: 150000000,
        iva: 15000000,
        total: 165000000
      }));
      
      setBudgets(enhancedData);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setFetchingBudgets(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Presupuesto
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {fetchingBudgets ? (
          <LoadingState />
        ) : budgets.length === 0 ? (
          <EmptyBudgetState />
        ) : (
          <BudgetTable 
            budgets={budgets} 
            formatCurrency={formatCurrency} 
          />
        )}
      </div>
      
      <BudgetCreateDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSuccess={fetchBudgets}
      />
    </div>
  );
};

export default BudgetList;
