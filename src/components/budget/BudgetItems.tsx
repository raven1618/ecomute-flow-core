
import React from 'react';
import BudgetItemList from './BudgetItemList';
import { useToastNotifications } from '@/hooks/useToastNotifications';

const BudgetItems: React.FC = () => {
  const { notifySuccess, notifyError } = useToastNotifications();

  return (
    <div className="space-y-6">
      <BudgetItemList 
        onSuccess={notifySuccess}
        onError={notifyError}
      />
    </div>
  );
};

export default BudgetItems;
