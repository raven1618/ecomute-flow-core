
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
import { Plus, Save, Trash2 } from 'lucide-react';

interface WorkOrderLinesProps {
  workOrderId: string;
}

interface WorkOrderLine {
  id: string;
  wo_id: string;
  code: string;
  description: string;
  unit: string;
  qty: number;
  unit_cost: number;
  total_cost: number;
}

const MOCK_LINES: WorkOrderLine[] = [
  {
    id: '1',
    wo_id: '1',
    code: 'INST-001',
    description: 'Instalación de estructura metálica',
    unit: 'horas',
    qty: 24,
    unit_cost: 100000,
    total_cost: 2400000
  },
  {
    id: '2',
    wo_id: '1',
    code: 'MAT-001',
    description: 'Perfiles de aluminio',
    unit: 'metros',
    qty: 50,
    unit_cost: 80000,
    total_cost: 4000000
  },
  {
    id: '3',
    wo_id: '1',
    code: 'MAT-002',
    description: 'Vinilo adhesivo',
    unit: 'm²',
    qty: 15,
    unit_cost: 120000,
    total_cost: 1800000
  }
];

const WorkOrderLines: React.FC<WorkOrderLinesProps> = ({ workOrderId }) => {
  const [lines, setLines] = useState<WorkOrderLine[]>(MOCK_LINES);
  const [editingLine, setEditingLine] = useState<WorkOrderLine | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleEdit = (line: WorkOrderLine) => {
    setEditingLine({...line});
  };

  const handleSave = () => {
    if (editingLine) {
      setLines(lines.map(line => line.id === editingLine.id ? editingLine : line));
      setEditingLine(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingLine) return;
    
    const { name, value } = e.target;
    const updatedLine = { ...editingLine, [name]: value };
    
    // Automatically calculate total cost
    if (['qty', 'unit_cost'].includes(name)) {
      const qty = name === 'qty' ? parseFloat(value) : editingLine.qty;
      const unitCost = name === 'unit_cost' ? parseFloat(value) : editingLine.unit_cost;
      
      updatedLine.total_cost = qty * unitCost;
    }
    
    setEditingLine(updatedLine);
  };

  const handleAddLine = () => {
    const newLine: WorkOrderLine = {
      id: `new-${Date.now()}`,
      wo_id: workOrderId,
      code: '',
      description: '',
      unit: '',
      qty: 1,
      unit_cost: 0,
      total_cost: 0
    };
    
    setLines([...lines, newLine]);
    setEditingLine(newLine);
  };

  const handleDeleteLine = (id: string) => {
    setLines(lines.filter(line => line.id !== id));
    if (editingLine && editingLine.id === id) {
      setEditingLine(null);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Líneas de la Orden de Trabajo</h3>
        <Button onClick={handleAddLine}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Línea
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Costo Unit.</TableHead>
              <TableHead className="text-right">Costo Total</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  {editingLine && editingLine.id === line.id ? (
                    <Input 
                      name="code" 
                      value={editingLine.code} 
                      onChange={handleInputChange} 
                      className="w-full"
                    />
                  ) : (
                    line.code
                  )}
                </TableCell>
                <TableCell>
                  {editingLine && editingLine.id === line.id ? (
                    <Input 
                      name="description" 
                      value={editingLine.description} 
                      onChange={handleInputChange} 
                      className="w-full"
                    />
                  ) : (
                    line.description
                  )}
                </TableCell>
                <TableCell>
                  {editingLine && editingLine.id === line.id ? (
                    <Input 
                      name="unit" 
                      value={editingLine.unit} 
                      onChange={handleInputChange} 
                      className="w-full"
                    />
                  ) : (
                    line.unit
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingLine && editingLine.id === line.id ? (
                    <Input 
                      name="qty" 
                      type="number" 
                      value={editingLine.qty} 
                      onChange={handleInputChange} 
                      className="w-24 ml-auto text-right"
                    />
                  ) : (
                    line.qty
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingLine && editingLine.id === line.id ? (
                    <Input 
                      name="unit_cost" 
                      type="number" 
                      value={editingLine.unit_cost} 
                      onChange={handleInputChange} 
                      className="w-32 ml-auto text-right"
                    />
                  ) : (
                    formatCurrency(line.unit_cost)
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(line.total_cost)}
                </TableCell>
                <TableCell className="text-center">
                  {editingLine && editingLine.id === line.id ? (
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(line)}
                    >
                      Editar
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => handleDeleteLine(line.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>
              {formatCurrency(lines.reduce((sum, line) => sum + line.total_cost, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderLines;
