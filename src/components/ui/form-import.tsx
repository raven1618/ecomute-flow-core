
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { supabase } from '@/integrations/supabase/client';

interface FormField {
  label: string;
  id: string;
  type: string;
  default?: number | string;
}

interface FormButton {
  text: string;
  onClick: string;
}

interface FormImportProps {
  title: string;
  fields: FormField[];
  buttons: FormButton[];
}

const FormImport: React.FC<FormImportProps> = ({ title, fields, buttons }) => {
  const { notifySuccess, notifyError } = useToastNotifications();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form values with default values
  React.useEffect(() => {
    const initialValues = fields.reduce((acc, field) => {
      if (field.default !== undefined) {
        acc[field.id] = field.default;
      }
      return acc;
    }, {} as Record<string, any>);
    
    setFormValues((prev) => ({ ...prev, ...initialValues }));
  }, [fields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value,
    }));
  };

  const executeFunction = async (fnString: string) => {
    try {
      setIsSubmitting(true);
      console.log("Executing function:", fnString);
      console.log("Form values:", formValues);
      
      // Replace placeholders in the onClick string with actual values
      if (fnString.startsWith('call supabase.rpc(')) {
        const matches = fnString.match(/call supabase\.rpc\('([^']+)',\{([^}]+)\}\)/);
        
        if (matches && matches.length >= 3) {
          const functionName = matches[1];
          const paramsString = matches[2];
          
          console.log("Function name:", functionName);
          console.log("Params string:", paramsString);
          
          // Parse parameters and replace with actual values
          const params: Record<string, any> = {};
          const paramPairs = paramsString.split(',');
          
          paramPairs.forEach(pair => {
            const [key, valueName] = pair.split(':');
            const trimmedKey = key.trim();
            const trimmedValueName = valueName.trim();
            
            // Access the formValues with the trimmed value name to get the actual value
            params[trimmedKey] = formValues[trimmedValueName];
            console.log(`Setting param ${trimmedKey} to:`, formValues[trimmedValueName]);
          });
          
          console.log("Final params:", params);
          
          // Use type assertion to avoid TypeScript errors
          const { data, error } = await (supabase as any).rpc(functionName, params);
          
          if (error) {
            console.error("RPC error:", error);
            throw error;
          }
          
          console.log("Function result:", data);
          notifySuccess(`Operación completada con éxito`);
          return data;
        } else {
          throw new Error('Formato de función no válido');
        }
      }
      
      // If we couldn't parse the function, show an error
      throw new Error('No se pudo ejecutar la función');
    } catch (error) {
      console.error('Error executing function:', error);
      notifyError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Complete los campos y presione el botón para importar datos desde CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              value={formValues[field.id] || ''}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2">
        {buttons.map((button, index) => (
          <Button 
            key={index} 
            onClick={() => executeFunction(button.onClick)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : button.text}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
};

export default FormImport;
