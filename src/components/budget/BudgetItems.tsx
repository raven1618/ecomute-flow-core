
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BudgetItemsProps {
  budgetId: string;
}

interface BudgetItem {
  id: string;
  doc_id: string;
  item_no: number;
  description: string;
  category: string;
  color: string;
  faces: number;
  height_cm: number;
  width_cm: number;
  area_m2: number;
  area_m2_ceil: number;
  qty: number;
  unit_price: number;
  discount_pct: number;
  total_gs: number;
}

// Categories for budget items
const categories = [
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
    return categories.find(cat => cat.value === value)?.label || 'Otros';
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
        <div key={category} className="space-y-4 mb-8">
          <h4 className="font-medium text-md">{getCategoryLabel(category)}</h4>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Nº</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-center">Caras</TableHead>
                  <TableHead className="text-right">Alto (cm)</TableHead>
                  <TableHead className="text-right">Ancho (cm)</TableHead>
                  <TableHead className="text-right">Área (m²)</TableHead>
                  <TableHead className="text-right">Área Redon.</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Desc. %</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item_no}</TableCell>
                    <TableCell>
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                      {editingItem && editingItem.id === item.id ? (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
      
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">
              {formatCurrency(items.reduce((sum, item) => sum + item.total_gs, 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Descuento:</span>
            <span>Gs. 0</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (10%):</span>
            <span>
              {formatCurrency(items.reduce((sum, item) => sum + item.total_gs, 0) * 0.1)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>
              {formatCurrency(items.reduce((sum, item) => sum + item.total_gs, 0) * 1.1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetItems;
