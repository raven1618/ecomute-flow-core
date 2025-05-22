
import React from 'react';
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
import { Skeleton } from "@/components/ui/skeleton";
import BudgetInfo from '@/components/budget/BudgetInfo';
import BudgetItems from '@/components/budget/BudgetItems';
import BudgetSummary from '@/components/budget/BudgetSummary';
import { BudgetProvider, useBudget } from '@/contexts/BudgetContext';

const BudgetContent = () => {
  const { loading } = useBudget();
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="info">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="items">Ítems</TabsTrigger>
        <TabsTrigger value="summary">Resumen</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <BudgetInfo />
      </TabsContent>
      <TabsContent value="items">
        <BudgetItems />
      </TabsContent>
      <TabsContent value="summary">
        <BudgetSummary />
      </TabsContent>
    </Tabs>
  );
};

const BudgetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const budgetId = id || '';
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Presupuesto</h1>
      </div>
      
      <BudgetProvider budgetId={budgetId}>
        <Card>
          <CardHeader>
            <CardTitle>Presupuesto #{budgetId}</CardTitle>
            <CardDescription>
              Visualización y edición del presupuesto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetContent />
          </CardContent>
        </Card>
      </BudgetProvider>
    </div>
  );
};

export default BudgetDetail;
