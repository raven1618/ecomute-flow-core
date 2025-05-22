
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus } from 'lucide-react';

interface WorkOrder {
  id: string;
  project_id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed';
  scheduled_start: string;
  scheduled_end: string;
}

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: '1',
    project_id: '1',
    name: 'Instalación Cartel Corporativo',
    status: 'in_progress',
    scheduled_start: '2023-06-01',
    scheduled_end: '2023-06-15'
  },
  {
    id: '2',
    project_id: '2',
    name: 'Fabricación Letras Corpóreas',
    status: 'draft',
    scheduled_start: '2023-07-01',
    scheduled_end: '2023-07-10'
  },
  {
    id: '3',
    project_id: '3',
    name: 'Montaje Fachada Centro Comercial',
    status: 'completed',
    scheduled_start: '2023-05-15',
    scheduled_end: '2023-05-30'
  }
];

const WorkOrderList = () => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Borrador</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };
  
  const handleViewWorkOrder = (id: string) => {
    navigate(`/wo/${id}`);
  };
  
  const handleCreateWorkOrder = () => {
    // In a real app, this would navigate to the create form
    alert('Crear nueva orden de trabajo - Esta funcionalidad estará disponible próximamente');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h1>
        <Button onClick={handleCreateWorkOrder}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Orden
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_WORK_ORDERS.map((wo) => (
              <TableRow key={wo.id}>
                <TableCell className="font-medium">{wo.name}</TableCell>
                <TableCell>{getStatusBadge(wo.status)}</TableCell>
                <TableCell>{new Date(wo.scheduled_start).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(wo.scheduled_end).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewWorkOrder(wo.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
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

export default WorkOrderList;
