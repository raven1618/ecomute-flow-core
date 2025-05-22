
import React, { createContext, useContext, ReactNode } from 'react';
import { BudgetItem } from '@/types/budget';
import { useBudgetData, BudgetData } from '@/hooks/useBudgetData';

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
  const { budget, setBudget, loading, formatCurrency, updateBudgetItems } = useBudgetData(budgetId);

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
