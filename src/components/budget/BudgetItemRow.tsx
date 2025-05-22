
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import BudgetItemForm from './BudgetItemForm';
import BudgetItemActions from './BudgetItemActions';
import { BudgetItem, BudgetItemCategory } from '@/types/budget';

interface BudgetItemRowProps {
  item: BudgetItem;
  editingItem: BudgetItem | null;
  formatCurrency: (value: number) => string;
  handleEdit: (item: BudgetItem) => void;
  handleSave: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDeleteItem: (id: string) => void;
  categories: BudgetItemCategory[];
}

const BudgetItemRow: React.FC<BudgetItemRowProps> = ({
  item,
  editingItem,
  formatCurrency,
  handleEdit,
  handleSave,
  handleInputChange,
  handleSelectChange,
  handleDeleteItem,
  categories
}) => {
  const isEditing = editingItem && editingItem.id === item.id;
  
  return (
    <TableRow key={item.id}>
      <TableCell>{item.item_no}</TableCell>
      <TableCell>
        {isEditing ? (
          <BudgetItemForm 
            editingItem={editingItem}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSave={handleSave}
            categories={categories}
          />
        ) : (
          item.description
        )}
      </TableCell>
      <TableCell>{isEditing ? null : item.color}</TableCell>
      <TableCell className="text-center">{isEditing ? null : item.faces}</TableCell>
      <TableCell className="text-right">{isEditing ? null : item.height_cm}</TableCell>
      <TableCell className="text-right">{isEditing ? null : item.width_cm}</TableCell>
      <TableCell className="text-right">{item.area_m2.toFixed(2)}</TableCell>
      <TableCell className="text-right">{item.area_m2_ceil.toFixed(2)}</TableCell>
      <TableCell className="text-right">{isEditing ? null : item.qty}</TableCell>
      <TableCell className="text-right">{isEditing ? null : formatCurrency(item.unit_price)}</TableCell>
      <TableCell className="text-right">{isEditing ? null : `${(item.discount_pct * 100).toFixed(0)}%`}</TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(item.total_gs)}
      </TableCell>
      <TableCell className="text-center">
        {isEditing ? null : (
          <BudgetItemActions 
            item={item}
            handleEdit={handleEdit}
            handleDeleteItem={handleDeleteItem}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default BudgetItemRow;
