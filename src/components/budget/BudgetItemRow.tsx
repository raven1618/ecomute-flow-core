
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Trash2 } from 'lucide-react';
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
          <Input 
            name="description" 
            value={editingItem.description} 
            onChange={handleInputChange} 
            className="w-full"
          />
        ) : (
          item.description
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            name="color" 
            value={editingItem.color} 
            onChange={handleInputChange} 
            className="w-full"
          />
        ) : (
          item.color
        )}
      </TableCell>
      <TableCell className="text-center">
        {isEditing ? (
          <Input 
            name="faces" 
            type="number" 
            value={editingItem.faces} 
            onChange={handleInputChange} 
            className="w-20 mx-auto text-center"
          />
        ) : (
          item.faces
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input 
            name="height_cm" 
            type="number" 
            value={editingItem.height_cm} 
            onChange={handleInputChange} 
            className="w-24 ml-auto text-right"
          />
        ) : (
          item.height_cm
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input 
            name="width_cm" 
            type="number" 
            value={editingItem.width_cm} 
            onChange={handleInputChange} 
            className="w-24 ml-auto text-right"
          />
        ) : (
          item.width_cm
        )}
      </TableCell>
      <TableCell className="text-right">{item.area_m2.toFixed(2)}</TableCell>
      <TableCell className="text-right">{item.area_m2_ceil.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input 
            name="qty" 
            type="number" 
            value={editingItem.qty} 
            onChange={handleInputChange} 
            className="w-20 ml-auto text-right"
          />
        ) : (
          item.qty
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input 
            name="unit_price" 
            type="number" 
            value={editingItem.unit_price} 
            onChange={handleInputChange} 
            className="w-32 ml-auto text-right"
          />
        ) : (
          formatCurrency(item.unit_price)
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input 
            name="discount_pct" 
            type="number"
            step="0.01"
            value={editingItem.discount_pct} 
            onChange={handleInputChange} 
            className="w-20 ml-auto text-right"
          />
        ) : (
          `${(item.discount_pct * 100).toFixed(0)}%`
        )}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(item.total_gs)}
      </TableCell>
      <TableCell className="text-center">
        {isEditing ? (
          <div className="flex space-x-1 justify-center">
            <Button 
              size="sm" 
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Select 
              value={editingItem.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
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
        )}
      </TableCell>
    </TableRow>
  );
};

export default BudgetItemRow;
