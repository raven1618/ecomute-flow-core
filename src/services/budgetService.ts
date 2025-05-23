
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { BudgetFormValues } from '@/components/budget/schemas/budgetFormSchema';

export const createBudget = async (values: BudgetFormValues) => {
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
    throw error;
  }
  
  return { budgetId, data };
};
