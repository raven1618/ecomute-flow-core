
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BudgetInfo from '@/components/budget/BudgetInfo';
import BudgetItems from '@/components/budget/BudgetItems';
import BudgetSummary from '@/components/budget/BudgetSummary';

const BudgetDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Presupuesto</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Presupuesto #{id}</CardTitle>
          <CardDescription>
            Visualización y edición del presupuesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="items">Ítems</TabsTrigger>
              <TabsTrigger value="summary">Resumen</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <BudgetInfo budgetId={id || ''} />
            </TabsContent>
            <TabsContent value="items">
              <BudgetItems budgetId={id || ''} />
            </TabsContent>
            <TabsContent value="summary">
              <BudgetSummary budgetId={id || ''} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetDetail;
