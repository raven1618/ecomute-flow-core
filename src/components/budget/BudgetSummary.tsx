
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Printer, Send } from 'lucide-react';

interface BudgetSummaryProps {
  budgetId: string;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgetId }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  // Mock data for the summary
  const budgetData = {
    client: 'Corporación ABC',
    date: '15/05/2023',
    subtotal: 150000000,
    discount: 0,
    iva: 15000000,
    total: 165000000,
    items: [
      { description: 'Cartel Corporativo', qty: 1, total: 5000000 },
      { description: 'Letras Corpóreas', qty: 10, total: 7600000 }
    ]
  };
  
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
                <span>{budgetData.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span>{budgetData.date}</span>
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
                <span>{formatCurrency(budgetData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Descuento:</span>
                <span>{formatCurrency(budgetData.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IVA (10%):</span>
                <span>{formatCurrency(budgetData.iva)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(budgetData.total)}</span>
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
