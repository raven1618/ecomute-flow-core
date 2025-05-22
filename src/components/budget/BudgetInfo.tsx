
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, FileText, Printer } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';

const BudgetInfo: React.FC = () => {
  const { budget, setBudget } = useBudget();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget(prev => ({
      ...prev,
      [name]: value
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
              <Label htmlFor="client">Cliente</Label>
              <Input 
                id="client" 
                name="client"
                value={budget.client} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="version">Versión</Label>
              <Input 
                id="version" 
                name="version"
                type="number" 
                value={budget.version.toString()} 
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="issue_date">Fecha de Emisión</Label>
              <Input 
                id="issue_date" 
                name="issue_date"
                type="date" 
                value={budget.issue_date} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="discount_doc">Descuento Global (Gs.)</Label>
              <Input 
                id="discount_doc" 
                name="discount_doc"
                type="number" 
                value={budget.discount_doc.toString()} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="iva_pct">Porcentaje de IVA</Label>
              <Input 
                id="iva_pct" 
                name="iva_pct"
                type="number" 
                step="0.01" 
                value={budget.iva_pct.toString()} 
                onChange={handleInputChange}
              />
            </div>
          </div>
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

export default BudgetInfo;
