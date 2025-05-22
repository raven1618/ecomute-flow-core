
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { BudgetItem } from '@/types/budget';

interface BudgetItemActionsProps {
  item: BudgetItem;
  handleEdit: (item: BudgetItem) => void;
  handleDeleteItem: (id: string) => void;
}

const BudgetItemActions: React.FC<BudgetItemActionsProps> = ({
  item,
  handleEdit,
  handleDeleteItem
}) => {
  return (
    <div className="flex space-x-1 justify-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => handleEdit(item)}
      >
        Editar
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-red-500"
        onClick={() => handleDeleteItem(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BudgetItemActions;
