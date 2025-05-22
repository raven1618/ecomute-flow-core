
import React, { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved';
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setAlerts(data || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las alertas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchAlerts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.priority === filter);
  
  const getAlertIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertOctagon className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Check className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getLevelBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Crítico</span>;
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Alto</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medio</span>;
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Bajo</span>;
      default:
        return null;
    }
  };
  
  const handleResolveAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'resolved' })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Error",
        description: "No se pudo resolver la alerta",
        variant: "destructive",
      });
    }
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
          className={`w-40 cursor-pointer ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{alerts.length}</p>
            <p className="text-sm text-gray-500">Todas</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 cursor-pointer ${filter === 'critical' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setFilter('critical')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.priority === 'critical').length}
            </p>
            <p className="text-sm text-gray-500">Críticas</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 cursor-pointer ${filter === 'high' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setFilter('high')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.priority === 'high').length}
            </p>
            <p className="text-sm text-gray-500">Altas</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 cursor-pointer ${filter === 'medium' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setFilter('medium')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => a.priority === 'medium').length}
            </p>
            <p className="text-sm text-gray-500">Medias</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando alertas...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay alertas disponibles
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id} className={alert.status === 'resolved' ? 'bg-gray-50' : ''}>
                    <TableCell>{getAlertIcon(alert.priority)}</TableCell>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell className="max-w-md truncate">{alert.description}</TableCell>
                    <TableCell>{getLevelBadge(alert.priority)}</TableCell>
                    <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      {alert.status !== 'resolved' ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolver
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-500">Resuelta</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Alerts;
