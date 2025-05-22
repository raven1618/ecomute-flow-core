
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import BudgetItemList from './BudgetItemList';

const BudgetItems: React.FC = () => {
  const { toast } = useToast();

  // Set up toast message handlers for the toast notifications
  const notifySuccess = (message: string) => {
    toast({
      title: "Éxito",
      description: message,
    });
  };

  const notifyError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <BudgetItemList />
    </div>
  );
};

export default BudgetItems;
