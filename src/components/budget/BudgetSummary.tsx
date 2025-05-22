
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Printer, Send } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';

const BudgetSummary: React.FC = () => {
  const { budget, formatCurrency } = useBudget();
  const budgetId = budget.id;
  
  // Calculate totals from budget items
  const subtotal = budget.items.reduce((sum, item) => sum + item.total_gs, 0);
  const discount = budget.discount_doc || 0;
  const iva = subtotal * budget.iva_pct;
  const total = subtotal - discount + iva;
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resumen del Presupuesto</h3>
        <div className="space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Detalles del Presupuesto</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Cliente:</span>
                <span>{budget.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span>{new Date(budget.issue_date).toLocaleDateString('es-PY')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Número:</span>
                <span>PRES-{budgetId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Resumen Financiero</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Descuento:</span>
                <span>{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IVA ({budget.iva_pct * 100}%):</span>
                <span>{formatCurrency(iva)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4">Términos y Condiciones</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Este presupuesto es válido por 30 días a partir de la fecha de emisión.</p>
            <p>2. El 50% del valor total se abona por adelantado para iniciar los trabajos.</p>
            <p>3. El saldo restante se abona contra entrega del trabajo finalizado.</p>
            <p>4. Los precios incluyen IVA.</p>
            <p>5. No incluye costos de instalación salvo que se indique expresamente.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
