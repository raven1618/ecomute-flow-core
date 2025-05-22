
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BudgetItemCategory from './BudgetItemCategory';
import BudgetItemsSummary from './BudgetItemsSummary';
import { BudgetItem, BudgetItemCategory as CategoryType } from '@/types/budget';

interface BudgetItemsProps {
  budgetId: string;
}

// Categories for budget items
const CATEGORIES: CategoryType[] = [
  { value: 'corporeo', label: 'Letras Corpóreas' },
  { value: 'cartel', label: 'Carteles' },
  { value: 'material', label: 'Materiales' },
  { value: 'vinilo', label: 'Vinilos' },
  { value: 'otros', label: 'Otros' }
];

// Mock data with categories
const MOCK_ITEMS: BudgetItem[] = [
  {
    id: '1',
    doc_id: '1',
    item_no: 1,
    description: 'Cartel Corporativo',
    category: 'cartel',
    color: 'Azul',
    faces: 2,
    height_cm: 200,
    width_cm: 300,
    area_m2: 6,
    area_m2_ceil: 6,
    qty: 1,
    unit_price: 5000000,
    discount_pct: 0,
    total_gs: 5000000
  },
  {
    id: '2',
    doc_id: '1',
    item_no: 2,
    description: 'Letras Corpóreas',
    category: 'corporeo',
    color: 'Plata',
    faces: 1,
    height_cm: 50,
    width_cm: 400,
    area_m2: 2,
    area_m2_ceil: 2,
    qty: 10,
    unit_price: 800000,
    discount_pct: 0.05,
    total_gs: 7600000
  }
];

const BudgetItems: React.FC<BudgetItemsProps> = ({ budgetId }) => {
  const [items, setItems] = useState<BudgetItem[]>(MOCK_ITEMS);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleEdit = (item: BudgetItem) => {
    setEditingItem({...item});
  };

  const handleSave = async () => {
    if (editingItem) {
      try {
        // In a real implementation, we would update the item in the database
        // await supabase.from('budget_items').update(editingItem).eq('id', editingItem.id);
        
        setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
        setEditingItem(null);
        
        toast({
          title: "Ítem actualizado",
          description: "El ítem ha sido actualizado correctamente.",
        });
      } catch (error) {
        console.error('Error updating item:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el ítem.",
          variant: "destructive",
        });
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
      doc_id: budgetId,
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
    
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
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

export default BudgetItems;
