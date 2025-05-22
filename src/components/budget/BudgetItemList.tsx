
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BudgetItemCategory from './BudgetItemCategory';
import BudgetItemsSummary from './BudgetItemsSummary';
import { BudgetItem, BudgetItemCategory as CategoryType } from '@/types/budget';
import { useBudget } from '@/contexts/BudgetContext';

// Categories for budget items
const CATEGORIES: CategoryType[] = [
  { value: 'corporeo', label: 'Letras Corpóreas' },
  { value: 'cartel', label: 'Carteles' },
  { value: 'material', label: 'Materiales' },
  { value: 'vinilo', label: 'Vinilos' },
  { value: 'otros', label: 'Otros' }
];

interface BudgetItemListProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

const BudgetItemList: React.FC<BudgetItemListProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { budget, updateBudgetItems, formatCurrency } = useBudget();
  const [editingItem, setEditingItem] = React.useState<BudgetItem | null>(null);
  const items = budget.items;

  const handleEdit = (item: BudgetItem) => {
    setEditingItem({...item});
  };

  const handleSave = async () => {
    if (editingItem) {
      try {
        // In a real implementation, we would update the item in the database
        // await supabase.from('budget_items').update(editingItem).eq('id', editingItem.id);
        
        const updatedItems = items.map(item => 
          item.id === editingItem.id ? editingItem : item
        );
        updateBudgetItems(updatedItems);
        setEditingItem(null);
        
        if (onSuccess) {
          onSuccess('Ítem actualizado correctamente');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        if (onError) {
          onError('Error al actualizar el ítem');
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    
    const { name, value } = e.target;
    const updatedItem = { ...editingItem, [name]: value };
    
    // Automatically calculate area and total
    if (['height_cm', 'width_cm', 'qty', 'unit_price', 'discount_pct'].includes(name)) {
      const height = name === 'height_cm' ? parseFloat(value) : editingItem.height_cm;
      const width = name === 'width_cm' ? parseFloat(value) : editingItem.width_cm;
      const area = (height * width) / 10000;
      
      // Calculate area_m2_ceil as per the trigger logic
      const areaCeil = Math.ceil(area * 4) / 4;
      
      const qty = name === 'qty' ? parseFloat(value) : editingItem.qty;
      const unitPrice = name === 'unit_price' ? parseFloat(value) : editingItem.unit_price;
      const discount = name === 'discount_pct' ? parseFloat(value) : editingItem.discount_pct;
      
      // Calculate total as per the trigger logic
      const total = qty * unitPrice * (1 - discount) * areaCeil / (area || 1);
      
      updatedItem.area_m2 = area;
      updatedItem.area_m2_ceil = areaCeil;
      updatedItem.total_gs = total;
    }
    
    setEditingItem(updatedItem);
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleAddItem = () => {
    const newItem: BudgetItem = {
      id: `new-${Date.now()}`,
      doc_id: budget.id,
      item_no: items.length + 1,
      description: '',
      category: 'otros',
      color: '',
      faces: 1,
      height_cm: 0,
      width_cm: 0,
      area_m2: 0,
      area_m2_ceil: 0,
      qty: 1,
      unit_price: 0,
      discount_pct: 0,
      total_gs: 0
    };
    
    updateBudgetItems([...items, newItem]);
    setEditingItem(newItem);
    
    if (onSuccess) {
      onSuccess('Nuevo ítem agregado');
    }
  };

  const handleDeleteItem = (id: string) => {
    updateBudgetItems(items.filter(item => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
    }
    
    if (onSuccess) {
      onSuccess('Ítem eliminado correctamente');
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, BudgetItem[]>);

  // Get the category label from the value
  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find(cat => cat.value === value)?.label || 'Otros';
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Ítems del Presupuesto</h3>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Ítem
        </Button>
      </div>
      
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <BudgetItemCategory
          key={category}
          category={category}
          categoryLabel={getCategoryLabel(category)}
          items={categoryItems}
          editingItem={editingItem}
          formatCurrency={formatCurrency}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleDeleteItem={handleDeleteItem}
          categories={CATEGORIES}
        />
      ))}
      
      <BudgetItemsSummary 
        items={items} 
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default BudgetItemList;
