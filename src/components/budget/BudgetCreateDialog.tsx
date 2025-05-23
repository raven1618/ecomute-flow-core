
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from '@/hooks/useToastNotifications';
import useProjects from '@/hooks/useProjects';

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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  projectId: z.string().uuid("ID de proyecto debe ser un UUID válido"),
  client: z.string().min(1, "Cliente es requerido"),
  version: z.number().int().positive().default(1)
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const BudgetCreateDialog: React.FC<BudgetCreateDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useToastNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [projectId, setProjectId] = useState('');
  const projects = useProjects();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Presupuesto nuevo',
      projectId: '',
      client: '',
      version: 1
    }
  });
  
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
      onOpenChange(false);
      form.reset();
      if (onSuccess) onSuccess();
      navigate(`/presupuesto/${budgetId}`);
    } catch (e) {
      console.error('Error creating budget:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Error al crear presupuesto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  <FormLabel>Proyecto</FormLabel>
                  <FormControl>
                    {projects.length === 0
                      ? <p className='text-sm text-muted-foreground'>No hay proyectos</p>
                      : <Select value={projectId} onValueChange={(value) => {
                          setProjectId(value);
                          field.onChange(value);
                        }}>
                          <SelectTrigger><SelectValue placeholder='Elegir proyecto' /></SelectTrigger>
                          <SelectContent>
                            {projects.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    }
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
                onOpenChange(false);
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
  );
};

export default BudgetCreateDialog;
