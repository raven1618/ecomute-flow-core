
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
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
import { Eye, FileText, Plus, AlertCircle, Loader2 } from 'lucide-react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type BudgetInsert = Database['public']['Tables']['budget_docs']['Insert'];
type BudgetDoc = Database['public']['Tables']['budget_docs']['Row'];

interface BudgetDocWithClient extends BudgetDoc {
  client?: string;
  version?: number;
  issue_date?: string;
  discount_doc?: number;
  iva_pct?: number;
  subtotal?: number;
  iva?: number;
  total?: number;
}

const formSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  projectId: z.string().uuid("ID de proyecto debe ser un UUID válido"),
  client: z.string().min(1, "Cliente es requerido"),
  version: z.number().int().positive().default(1)
});

type FormValues = z.infer<typeof formSchema>;

const BudgetList = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useToastNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<BudgetDocWithClient[]>([]);
  const [fetchingBudgets, setFetchingBudgets] = useState(true);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Presupuesto nuevo',
      projectId: '00000000-0000-0000-0000-000000000001',
      client: '',
      version: 1
    }
  });
  
  useEffect(() => {
    fetchBudgets();
  }, []);
  
  const fetchBudgets = async () => {
    setFetchingBudgets(true);
    try {
      // In a real implementation, replace with actual database fetch
      const { data, error } = await supabase
        .from('budget_docs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching budgets:', error);
        notifyError('Error al cargar presupuestos: ' + error.message);
        throw error;
      }
      
      // For demo purposes, we'll add the client info manually
      // In a real implementation, you would join with a clients table
      const enhancedData = data.map(budget => ({
        ...budget,
        client: 'Cliente ' + budget.id.substring(0, 4),
        version: 1,
        issue_date: new Date().toISOString(),
        discount_doc: 0,
        iva_pct: 0.1,
        subtotal: 150000000,
        iva: 15000000,
        total: 165000000
      }));
      
      setBudgets(enhancedData);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setFetchingBudgets(false);
    }
  };
  
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
  
  const handleCreateBudget = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Creating budget with:", {
        project_id: values.projectId,
        name: values.name,
        status: 'draft',
        client: values.client,
        version: values.version
      });
      
      const budgetId = uuidv4();
      
      const { data, error } = await supabase
        .from('budget_docs')
        .insert({
          id: budgetId,
          project_id: values.projectId,
          name: values.name,
          status: 'draft'
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating budget:', error);
        setErrorMessage(`Error: ${error.message}`);
        notifyError(error.message);
        throw error;
      }
      
      notifySuccess('Presupuesto creado exitosamente');
      setIsDialogOpen(false);
      form.reset();
      fetchBudgets(); // Refresh the list
      navigate(`/presupuesto/${budgetId}`);
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
        {fetchingBudgets ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Cargando presupuestos...</span>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No hay presupuestos</h3>
            <p>Cree un nuevo presupuesto para comenzar</p>
          </div>
        ) : (
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
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.client || 'Sin cliente'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">v{budget.version || 1}</Badge>
                  </TableCell>
                  <TableCell>{budget.issue_date ? new Date(budget.issue_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">{budget.subtotal ? formatCurrency(budget.subtotal) : '-'}</TableCell>
                  <TableCell className="text-right">{budget.iva ? formatCurrency(budget.iva) : '-'}</TableCell>
                  <TableCell className="text-right font-medium">{budget.total ? formatCurrency(budget.total) : formatCurrency(0)}</TableCell>
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
        )}
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
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versión</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
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
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  form.reset();
                }}>
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
