
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from 'react-hook-form';
import useProjects from '@/hooks/useProjects';

interface FormProjectSelectorProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const FormProjectSelector = ({
  control,
  name,
  label = "Proyecto",
  placeholder = 'Elegir proyecto',
  disabled = false,
  required = true,
  className,
}: FormProjectSelectorProps) => {
  const projects = useProjects();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}{required && <span className="text-destructive"> *</span>}</FormLabel>}
          <FormControl>
            {projects.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No hay proyectos</p>
            ) : (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className={field.value === "" ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormProjectSelector;
