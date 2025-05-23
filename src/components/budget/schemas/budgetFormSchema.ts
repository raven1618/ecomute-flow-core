
import { z } from "zod";

export const budgetFormSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  projectId: z.string().uuid("ID de proyecto debe ser un UUID válido"),
  client: z.string().min(1, "Cliente es requerido"),
  version: z.number().int().positive().default(1)
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
