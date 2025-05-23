
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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    },
    mode: "onBlur" // Validates on blur for better user experience
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
                <Input 
                  {...field} 
                  className={form.formState.errors.name ? "border-red-500" : ""}
                  aria-invalid={!!form.formState.errors.name}
                />
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
                  : <Select 
                      value={projectId} 
                      onValueChange={(value) => {
                        setProjectId(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger 
                        className={form.formState.errors.projectId ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder='Elegir proyecto' />
                      </SelectTrigger>
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
                <Input 
                  {...field} 
                  className={form.formState.errors.client ? "border-red-500" : ""}
                  aria-invalid={!!form.formState.errors.client}
                />
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
                  className={form.formState.errors.version ? "border-red-500" : ""}
                  aria-invalid={!!form.formState.errors.version}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || !form.formState.isValid && form.formState.isDirty}>
            {isLoading ? 'Creando...' : 'Crear Presupuesto'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BudgetForm;
