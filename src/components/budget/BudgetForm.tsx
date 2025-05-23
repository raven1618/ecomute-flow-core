
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from 'lucide-react';

import { budgetFormSchema, BudgetFormValues } from './schemas/budgetFormSchema';
import useProjects from '@/hooks/useProjects';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface BudgetFormProps {
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading, 
  errorMessage 
}) => {
  const [projectId, setProjectId] = React.useState('');
  const projects = useProjects();
  
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: 'Presupuesto nuevo',
      projectId: '',
      client: '',
      version: 1
    }
  });
  
  const handleSubmit = async (values: BudgetFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Presupuesto'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BudgetForm;
