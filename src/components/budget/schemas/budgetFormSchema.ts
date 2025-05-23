
import { z } from "zod";

export const budgetFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  projectId: z.string().uuid("ID de proyecto debe ser un UUID válido").min(1, "Debe seleccionar un proyecto"),
  client: z.string().min(1, "El cliente es requerido"),
  version: z.number().int("La versión debe ser un número entero").positive("La versión debe ser un número positivo").default(1)
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
