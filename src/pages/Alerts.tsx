
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertOctagon, Check, Clock, Filter } from 'lucide-react';

interface Alert {
  id: string;
  item_id: string;
  msg: string;
  level: 'info' | 'warning' | 'critical';
  created_at: string;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    item_id: '2',
    msg: 'Stock-out VIN-001: 45 u.',
    level: 'critical',
    created_at: '2023-06-15T14:30:00Z'
  },
  {
    id: '2',
    item_id: '4',
    msg: 'Stock-out LED-001: 15 u.',
    level: 'critical',
    created_at: '2023-06-14T10:15:00Z'
  },
  {
    id: '3',
    item_id: '3',
    msg: 'Orden de compra #123 pendiente de aprobación',
    level: 'warning',
    created_at: '2023-06-13T09:45:00Z'
  },
  {
    id: '4',
    item_id: '1',
    msg: 'Precio de ALU-001 aumentó un 5%',
    level: 'info',
    created_at: '2023-06-12T16:20:00Z'
  },
  {
    id: '5',
    item_id: '5',
    msg: 'Orden de trabajo #45 retrasada',
    level: 'warning',
    created_at: '2023-06-11T11:30:00Z'
  }
];

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<string>('all');
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.level === filter);
  
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Check className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Crítico</span>;
      case 'warning':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Advertencia</span>;
      case 'info':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Info</span>;
      default:
        return null;
    }
  };
  
  const handleResolveAlert = (id: string) => {
    // In a real app, this would call an API to mark as resolved
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Alertas</h1>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>
      
      <div className="flex space-x-4">
        <Card 
          className={`w-40 cursor-pointer ${filter === 'all' ? 'ring-2 ring-ecomute-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{alerts.length}</p>
            <p className="text-sm text-gray-500">Todas</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 cursor-pointer ${filter === 'critical' ? 'ring-2 ring-ecomute-500' : ''}`}
          onClick={() => setFilter('critical')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.level === 'critical').length}
            </p>
            <p className="text-sm text-gray-500">Críticas</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 cursor-pointer ${filter === 'warning' ? 'ring-2 ring-ecomute-500' : ''}`}
          onClick={() => setFilter('warning')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => a.level === 'warning').length}
            </p>
            <p className="text-sm text-gray-500">Advertencias</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 cursor-pointer ${filter === 'info' ? 'ring-2 ring-ecomute-500' : ''}`}
          onClick={() => setFilter('info')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {alerts.filter(a => a.level === 'info').length}
            </p>
            <p className="text-sm text-gray-500">Informativas</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{getAlertIcon(alert.level)}</TableCell>
                <TableCell className="font-medium">{alert.msg}</TableCell>
                <TableCell>{getLevelBadge(alert.level)}</TableCell>
                <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Resolver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Alerts;
