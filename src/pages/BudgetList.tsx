
import React, { useState, useEffect } from 'react';
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
import { Eye, FileText, Plus, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { Database } from '@/integrations/supabase/types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type BudgetInsert = Database['public']['Tables']['budget_docs']['Insert'];

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

interface NewBudgetFormValues {
  name: string;
  projectId: string;
}

const BudgetList = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useToastNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const form = useForm<NewBudgetFormValues>({
    defaultValues: {
      name: 'Sin nombre',
      projectId: '00000000-0000-0000-0000-000000000001',
    }
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
  
  const handleCreateBudget = async (values: NewBudgetFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Creating budget with:", {
        project_id: values.projectId,
        name: values.name,
        status: 'draft'
      });
      
      const { data, error } = await supabase
        .from('budget_docs')
        .insert<BudgetInsert>({
          project_id: values.projectId,
          name: values.name,
          status: 'draft'
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error creating budget:', error);
        setErrorMessage(`Error: ${error.message}`);
        notifyError(error.message);
        throw error;
      }
      
      notifySuccess('Presupuesto creado exitosamente');
      setIsDialogOpen(false);
      navigate(`/presupuesto/${data.id}`);
    } catch (e) {
      console.error('Error creating budget:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Error al crear presupuesto');
    } finally {
      setIsLoading(false);
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo presupuesto</DialogTitle>
            <DialogDescription>
              Complete los datos para crear un nuevo presupuesto.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateBudget)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del Proyecto</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creando...' : 'Crear Presupuesto'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetList;
