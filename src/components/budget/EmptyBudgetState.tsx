
import React from 'react';
import { FileText } from 'lucide-react';

const EmptyBudgetState: React.FC = () => {
  return (
    <div className="text-center p-12 text-gray-500">
      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">No hay presupuestos</h3>
      <p>Cree un nuevo presupuesto para comenzar</p>
    </div>
  );
};

export default EmptyBudgetState;
