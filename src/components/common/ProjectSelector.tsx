
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useProjects from '@/hooks/useProjects';

interface ProjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const ProjectSelector = ({
  value,
  onChange,
  hasError,
  label,
  placeholder = 'Elegir proyecto',
  disabled = false,
  required = true,
  className,
}: ProjectSelectorProps) => {
  const projects = useProjects();
  
  return (
    <div className={className}>
      {label && <FormLabel className={required ? '' : 'font-normal'}>{label}{required && <span className="text-destructive"> *</span>}</FormLabel>}
      <FormControl>
        {projects.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No hay proyectos</p>
        ) : (
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={hasError ? "border-red-500" : ""}
            >
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
    </div>
  );
};

export default ProjectSelector;
