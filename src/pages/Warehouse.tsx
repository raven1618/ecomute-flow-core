
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
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, FileUp, Download } from 'lucide-react';

interface MaterialStock {
  id: string;
  sku: string;
  description: string;
  qty_on_hand: number;
  reorder_point: number;
}

const MOCK_MATERIALS: MaterialStock[] = [
  {
    id: '1',
    sku: 'ALU-001',
    description: 'Perfil de Aluminio 5cm',
    qty_on_hand: 120,
    reorder_point: 50
  },
  {
    id: '2',
    sku: 'VIN-001',
    description: 'Vinilo Adhesivo Blanco',
    qty_on_hand: 45,
    reorder_point: 50
  },
  {
    id: '3',
    sku: 'ACR-001',
    description: 'Plancha Acrílico 3mm',
    qty_on_hand: 30,
    reorder_point: 20
  },
  {
    id: '4',
    sku: 'LED-001',
    description: 'Tira LED 5m',
    qty_on_hand: 15,
    reorder_point: 25
  },
  {
    id: '5',
    sku: 'TOR-001',
    description: 'Tornillos Autoroscantes 1"',
    qty_on_hand: 500,
    reorder_point: 200
  }
];

const Warehouse = () => {
  const [materials, setMaterials] = useState<MaterialStock[]>(MOCK_MATERIALS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMaterials = searchTerm 
    ? materials.filter(material => 
        material.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : materials;
  
  const handleCreateMaterial = () => {
    // In a real app, this would open a modal or navigate to create form
    alert('Crear nuevo material - Esta funcionalidad estará disponible próximamente');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Almacén</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleCreateMaterial}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Material
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar materiales..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-4">
          <Card className="w-56">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Ítems</p>
                <p className="text-2xl font-bold">{materials.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-lg font-medium">#</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-56">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bajo Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {materials.filter(m => m.qty_on_hand < m.reorder_point).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-lg font-medium">!</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Punto de Reorden</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id} className={material.qty_on_hand < material.reorder_point ? "bg-yellow-50" : ""}>
                <TableCell className="font-medium">{material.sku}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell className="text-right">{material.qty_on_hand}</TableCell>
                <TableCell className="text-right">{material.reorder_point}</TableCell>
                <TableCell className="text-center">
                  {material.qty_on_hand < material.reorder_point ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Bajo Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      OK
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm">
                    Ajustar
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

export default Warehouse;
