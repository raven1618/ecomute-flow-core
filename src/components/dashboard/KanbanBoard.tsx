import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types for our Kanban board
interface Project {
  id: string;
  name: string;
  state: 'draft' | 'budgeted' | 'po' | 'wo' | 'receipt' | 'closed';
  company_id: string;
  created_at: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Edificio Corporativo ABC',
    state: 'draft',
    company_id: '1',
    created_at: '2023-05-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'Torre Residencial XYZ',
    state: 'budgeted',
    company_id: '1',
    created_at: '2023-06-15T14:30:00Z',
  },
  {
    id: '3',
    name: 'Centro Comercial Plaza',
    state: 'po',
    company_id: '1',
    created_at: '2023-07-20T09:15:00Z',
  },
  {
    id: '4',
    name: 'Hospital Regional',
    state: 'wo',
    company_id: '1',
    created_at: '2023-08-05T11:45:00Z',
  },
  {
    id: '5',
    name: 'Hotel Costanera',
    state: 'receipt',
    company_id: '1',
    created_at: '2023-09-10T16:20:00Z',
  },
  {
    id: '6',
    name: 'Proyecto Parque Industrial',
    state: 'closed',
    company_id: '1',
    created_at: '2023-10-01T08:00:00Z',
  },
];

const KanbanBoard = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const navigate = useNavigate();
  
  const states = [
    { id: 'draft', name: 'Borrador' },
    { id: 'budgeted', name: 'Presupuestado' },
    { id: 'po', name: 'Orden de Compra' },
    { id: 'wo', name: 'Orden de Obra' },
    { id: 'receipt', name: 'Recibido' },
    { id: 'closed', name: 'Cerrado' },
  ];
  
  const getProjectsByState = (state: string) => {
    return projects.filter(project => project.state === state);
  };
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/presupuestos/${projectId}`);
  };
  
  const handleCreateProject = () => {
    // In a real app, this would open a modal or navigate to create form
    alert('Crear nuevo proyecto - Esta funcionalidad estará disponible próximamente');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {states.map(state => (
          <div key={state.id} className="kanban-column flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">{state.name}</h3>
              <Badge variant="outline">{getProjectsByState(state.id).length}</Badge>
            </div>
            
            <div className="space-y-3">
              {getProjectsByState(state.id).map(project => (
                <Card 
                  key={project.id} 
                  className="kanban-card cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <Badge className={`badge-${project.state}`}>
                      {state.name}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
