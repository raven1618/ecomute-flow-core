
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { BudgetItem, BudgetItemCategory } from '@/types/budget';

interface BudgetItemFormProps {
  editingItem: BudgetItem;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSave: () => void;
  categories: BudgetItemCategory[];
}

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({
  editingItem,
  handleInputChange,
  handleSelectChange,
  handleSave,
  categories
}) => {
  return (
    <>
      <Input 
        name="description" 
        value={editingItem.description} 
        onChange={handleInputChange} 
        className="w-full"
      />
      <Input 
        name="color" 
        value={editingItem.color} 
        onChange={handleInputChange} 
        className="w-full"
      />
      <Input 
        name="faces" 
        type="number" 
        value={editingItem.faces} 
        onChange={handleInputChange} 
        className="w-20 mx-auto text-center"
      />
      <Input 
        name="height_cm" 
        type="number" 
        value={editingItem.height_cm} 
        onChange={handleInputChange} 
        className="w-24 ml-auto text-right"
      />
      <Input 
        name="width_cm" 
        type="number" 
        value={editingItem.width_cm} 
        onChange={handleInputChange} 
        className="w-24 ml-auto text-right"
      />
      <Input 
        name="qty" 
        type="number" 
        value={editingItem.qty} 
        onChange={handleInputChange} 
        className="w-20 ml-auto text-right"
      />
      <Input 
        name="unit_price" 
        type="number" 
        value={editingItem.unit_price} 
        onChange={handleInputChange} 
        className="w-32 ml-auto text-right"
      />
      <Input 
        name="discount_pct" 
        type="number"
        step="0.01"
        value={editingItem.discount_pct} 
        onChange={handleInputChange} 
        className="w-20 ml-auto text-right"
      />
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
    </>
  );
};

export default BudgetItemForm;
