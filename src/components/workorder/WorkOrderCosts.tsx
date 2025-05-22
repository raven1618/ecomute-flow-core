
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface WorkOrderCostsProps {
  workOrderId: string;
}

const COLORS = ['#3730a3', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

const WorkOrderCosts: React.FC<WorkOrderCostsProps> = ({ workOrderId }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  // Mock data for cost analysis
  const categoryCosts = [
    { name: 'Materiales', value: 5800000 },
    { name: 'Mano de Obra', value: 2400000 },
    { name: 'Equipos', value: 800000 },
    { name: 'Transporte', value: 400000 },
    { name: 'Otros', value: 200000 }
  ];
  
  const monthlyCosts = [
    { name: 'Jun 01', planned: 2000000, actual: 1800000 },
    { name: 'Jun 05', planned: 3000000, actual: 3200000 },
    { name: 'Jun 10', planned: 4500000, actual: 4800000 },
    { name: 'Jun 15', planned: 6000000, actual: 5800000 },
  ];
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{payload[0].name}: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6 py-4">
      <h3 className="text-lg font-medium">Análisis de Costos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Distribución de Costos por Categoría</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryCosts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryCosts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Costos Planeados vs. Reales</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyCosts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="planned" name="Planeado" fill="#6366f1" />
                  <Bar dataKey="actual" name="Real" fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4">Resumen de Costos</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Costo Total</p>
                <p className="text-2xl font-bold">{formatCurrency(9600000)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Presupuesto Asignado</p>
                <p className="text-2xl font-bold">{formatCurrency(10000000)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Variación</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(400000)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">% Completado</p>
                <p className="text-2xl font-bold">80%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrderCosts;
