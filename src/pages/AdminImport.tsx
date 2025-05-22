
import React from 'react';
import FormImport from '@/components/ui/form-import';

const AdminImport: React.FC = () => {
  const formFields = [
    { label: "Proyecto ID", id: "project", type: "text" },
    { label: "Cliente", id: "client", type: "text" },
    { label: "Versión Presupuesto", id: "ver", type: "number", default: 1 },
    { label: "URL CSV Presupuesto", id: "csv_budget", type: "text" },
    { label: "Nombre Orden Obra", id: "woname", type: "text" },
    { label: "URL CSV OO", id: "csv_wo", type: "text" }
  ];

  const formButtons = [
    {
      text: "Importar Presupuesto",
      onClick: "call supabase.rpc('create_budget_from_csv',{_project_id:project,_client:client,_version:ver,_csv_url:csv_budget})"
    },
    {
      text: "Importar Orden de Obra",
      onClick: "call supabase.rpc('create_wo_from_csv',{_project_id:project,_name:woname,_csv_url:csv_wo})"
    }
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Administración - Importación CSV</h1>
      <FormImport
        title="Cargar CSV → Base de Datos"
        fields={formFields}
        buttons={formButtons}
      />
    </div>
  );
};

export default AdminImport;
