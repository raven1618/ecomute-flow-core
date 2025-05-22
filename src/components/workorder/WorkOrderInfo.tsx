
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Save, FileText, Printer } from 'lucide-react';

interface WorkOrderInfoProps {
  workOrderId: string;
}

interface WorkOrderData {
  id: string;
  project_id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed';
  scheduled_start: string;
  scheduled_end: string;
}

const WorkOrderInfo: React.FC<WorkOrderInfoProps> = ({ workOrderId }) => {
  const [workOrder, setWorkOrder] = useState<WorkOrderData>({
    id: workOrderId,
    project_id: '1',
    name: 'Instalación Cartel Corporativo',
    status: 'in_progress',
    scheduled_start: '2023-06-01',
    scheduled_end: '2023-06-15'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value: 'draft' | 'in_progress' | 'completed') => {
    setWorkOrder(prev => ({
      ...prev,
      status: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to save the data
    alert('Datos actualizados correctamente');
  };
  
  return (
    <div className="space-y-6 py-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name"
                value={workOrder.name} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={workOrder.status} 
                onValueChange={(value: any) => handleStatusChange(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduled_start">Fecha de Inicio</Label>
              <Input 
                id="scheduled_start" 
                name="scheduled_start"
                type="date" 
                value={workOrder.scheduled_start} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="scheduled_end">Fecha de Finalización</Label>
              <Input 
                id="scheduled_end" 
                name="scheduled_end"
                type="date" 
                value={workOrder.scheduled_end} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Label htmlFor="notes">Notas</Label>
          <textarea
            id="notes"
            className="w-full p-2 border rounded-md h-32"
            placeholder="Ingrese notas o instrucciones adicionales..."
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-end space-x-4">
          <Button type="submit" className="bg-ecomute-600 hover:bg-ecomute-700">
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
          <Button type="button" variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button type="button" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkOrderInfo;
