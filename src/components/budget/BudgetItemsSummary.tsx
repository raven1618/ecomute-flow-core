
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { BudgetItem } from '@/types/budget';

interface BudgetItemsSummaryProps {
  items: BudgetItem[];
  formatCurrency: (value: number) => string;
}

const BudgetItemsSummary: React.FC<BudgetItemsSummaryProps> = ({ items, formatCurrency }) => {
  const subtotal = items.reduce((sum, item) => sum + item.total_gs, 0);
  const iva = subtotal * 0.1;
  const total = subtotal + iva;

  return (
    <div className="flex justify-end">
      <div className="w-64 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-medium">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Descuento:</span>
          <span>Gs. 0</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (10%):</span>
          <span>
            {formatCurrency(iva)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetItemsSummary;
