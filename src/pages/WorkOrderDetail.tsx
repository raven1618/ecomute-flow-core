
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
import WorkOrderInfo from '@/components/workorder/WorkOrderInfo';
import WorkOrderLines from '@/components/workorder/WorkOrderLines';
import WorkOrderCosts from '@/components/workorder/WorkOrderCosts';

const WorkOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orden de Trabajo</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orden de Trabajo #{id}</CardTitle>
          <CardDescription>
            Visualización y edición de la orden de trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Datos</TabsTrigger>
              <TabsTrigger value="lines">Líneas</TabsTrigger>
              <TabsTrigger value="costs">Costos</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <WorkOrderInfo workOrderId={id || ''} />
            </TabsContent>
            <TabsContent value="lines">
              <WorkOrderLines workOrderId={id || ''} />
            </TabsContent>
            <TabsContent value="costs">
              <WorkOrderCosts workOrderId={id || ''} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrderDetail;
