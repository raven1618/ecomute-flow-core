
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from '@/integrations/supabase/types';

type BudgetDoc = Database['public']['Tables']['budget_docs']['Row'];

interface BudgetDocWithClient extends BudgetDoc {
  client?: string;
  version?: number;
  issue_date?: string;
  discount_doc?: number;
  iva_pct?: number;
  subtotal?: number;
  iva?: number;
  total?: number;
}

interface BudgetTableProps {
  budgets: BudgetDocWithClient[];
  formatCurrency: (value: number) => string;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ budgets, formatCurrency }) => {
  const navigate = useNavigate();
  
  const handleViewBudget = (id: string) => {
    navigate(`/presupuesto/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Versión</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
          <TableHead className="text-right">IVA</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget.id}>
            <TableCell className="font-medium">{budget.client || 'Sin cliente'}</TableCell>
            <TableCell>
              <Badge variant="outline">v{budget.version || 1}</Badge>
            </TableCell>
            <TableCell>{budget.issue_date ? new Date(budget.issue_date).toLocaleDateString() : '-'}</TableCell>
            <TableCell className="text-right">{budget.subtotal ? formatCurrency(budget.subtotal) : '-'}</TableCell>
            <TableCell className="text-right">{budget.iva ? formatCurrency(budget.iva) : '-'}</TableCell>
            <TableCell className="text-right font-medium">{budget.total ? formatCurrency(budget.total) : formatCurrency(0)}</TableCell>
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewBudget(budget.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BudgetTable;
