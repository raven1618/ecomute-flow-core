
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { supabase } from '@/integrations/supabase/client';

interface BudgetDoc {
  id: string;
  project_id: string;
  client: string;
  version: number;
  issue_date: string;
  discount_doc: number;
  iva_pct: number;
  subtotal: number;
  iva: number;
  total: number;
}

const MOCK_BUDGETS: BudgetDoc[] = [
  {
    id: '1',
    project_id: '1',
    client: 'Corporación ABC',
    version: 1,
    issue_date: '2023-05-15',
    discount_doc: 0,
    iva_pct: 0.1,
    subtotal: 150000000,
    iva: 15000000,
    total: 165000000
  },
  {
    id: '2',
    project_id: '2',
    client: 'Desarrolladora XYZ',
    version: 2,
    issue_date: '2023-06-20',
    discount_doc: 5000000,
    iva_pct: 0.1,
    subtotal: 250000000,
    iva: 24500000,
    total: 269500000
  },
  {
    id: '3',
    project_id: '3',
    client: 'Inmobiliaria Plaza',
    version: 1,
    issue_date: '2023-07-25',
    discount_doc: 0,
    iva_pct: 0.1,
    subtotal: 350000000,
    iva: 35000000,
    total: 385000000
  }
];

const BudgetList = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useToastNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBudget, setNewBudget] = useState({
    project_id: '',
    client: '',
    name: '',
    description: ''
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  const handleViewBudget = (id: string) => {
    navigate(`/presupuesto/${id}`);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewBudget(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCreateBudget = async () => {
    try {
      setIsSubmitting(true);
      console.log("Creating budget with data:", newBudget);
      
      // Validate required fields
      if (!newBudget.project_id || !newBudget.client || !newBudget.name) {
        throw new Error('Por favor complete todos los campos requeridos.');
      }

      // Create budget in Supabase
      const { data, error } = await supabase
        .from('budget_docs')
        .insert({
          project_id: newBudget.project_id,
          name: newBudget.name,
          description: newBudget.description || null,
          total_amount: 0, // Initial total amount
          status: 'draft',
          client: newBudget.client
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log("Budget created:", data);
      notifySuccess("Presupuesto creado exitosamente");
      
      // Close dialog and navigate to the new budget
      setIsDialogOpen(false);
      if (data?.id) {
        navigate(`/presupuesto/${data.id}`);
      }
      
    } catch (error) {
      console.error("Error creating budget:", error);
      notifyError(error instanceof Error ? error.message : 'Error al crear presupuesto');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Presupuesto
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Versión</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">IVA</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_BUDGETS.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.client}</TableCell>
                <TableCell>
                  <Badge variant="outline">v{budget.version}</Badge>
                </TableCell>
                <TableCell>{new Date(budget.issue_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{formatCurrency(budget.subtotal)}</TableCell>
                <TableCell className="text-right">{formatCurrency(budget.iva)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(budget.total)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewBudget(budget.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Budget Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Presupuesto</DialogTitle>
            <DialogDescription>
              Complete los datos para crear un nuevo presupuesto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_id" className="text-right">
                Proyecto ID
              </Label>
              <Input
                id="project_id"
                value={newBudget.project_id}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Cliente
              </Label>
              <Input
                id="client"
                value={newBudget.client}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newBudget.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                value={newBudget.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleCreateBudget} disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Presupuesto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetList;
