
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BudgetItemRow from './BudgetItemRow';
import { BudgetItem, BudgetItemCategory as CategoryType } from '@/types/budget';

interface BudgetItemCategoryProps {
  category: string;
  categoryLabel: string;
  items: BudgetItem[];
  editingItem: BudgetItem | null;
  formatCurrency: (value: number) => string;
  handleEdit: (item: BudgetItem) => void;
  handleSave: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDeleteItem: (id: string) => void;
  categories: CategoryType[];
}

const BudgetItemCategory: React.FC<BudgetItemCategoryProps> = ({
  category,
  categoryLabel,
  items,
  editingItem,
  formatCurrency,
  handleEdit,
  handleSave,
  handleInputChange,
  handleSelectChange,
  handleDeleteItem,
  categories
}) => {
  return (
    <div key={category} className="space-y-4 mb-8">
      <h4 className="font-medium text-md">{categoryLabel}</h4>
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
            {items.map((item) => (
              <BudgetItemRow
                key={item.id}
                item={item}
                editingItem={editingItem}
                formatCurrency={formatCurrency}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleDeleteItem={handleDeleteItem}
                categories={categories}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BudgetItemCategory;
