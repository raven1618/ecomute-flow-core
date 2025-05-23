
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BudgetFormValues } from './schemas/budgetFormSchema';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { createBudget } from '@/services/budgetService';
import BudgetForm from './BudgetForm';

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

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
  
  const handleCreateBudget = async (values: BudgetFormValues) => {
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
      
      const { budgetId } = await createBudget(values);
      
      notifySuccess('Presupuesto creado exitosamente');
      onOpenChange(false);
      if (onSuccess) onSuccess();
      navigate(`/presupuesto/${budgetId}`);
    } catch (e) {
      console.error('Error creating budget:', e);
      setErrorMessage(e instanceof Error ? e.message : 'Error al crear presupuesto');
      notifyError(e instanceof Error ? e.message : 'Error al crear presupuesto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
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
        
        <BudgetForm
          onSubmit={handleCreateBudget}
          onCancel={handleCancel}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BudgetCreateDialog;
