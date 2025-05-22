
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
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Plus, Search, FileUp, Download } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MaterialFormDialog from '@/components/warehouse/MaterialFormDialog';

interface MaterialStock {
  id: string;
  code: string;
  name: string;
  description: string | null;
  stock_qty: number;
  min_stock_qty: number;
  unit: string;
  unit_cost: number;
  type: string;
  location: string | null;
}

const Warehouse = () => {
  const [materials, setMaterials] = useState<MaterialStock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials_stock')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los materiales",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMaterials();
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'materials_stock' },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchMaterials();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);
  
  const filteredMaterials = searchTerm 
    ? materials.filter(material => 
        (material.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : materials;
  
  const handleCreateMaterial = () => {
    setIsDialogOpen(true);
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
                  {materials.filter(m => m.stock_qty < m.min_stock_qty).length}
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
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando materiales...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Punto de Reorden</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchTerm ? "No se encontraron materiales" : "No hay materiales registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map((material) => (
                  <TableRow key={material.id} className={material.stock_qty < material.min_stock_qty ? "bg-yellow-50" : ""}>
                    <TableCell className="font-medium">{material.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{material.name}</p>
                        {material.description && <p className="text-sm text-gray-500">{material.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{material.stock_qty} {material.unit}</TableCell>
                    <TableCell className="text-right">{material.min_stock_qty} {material.unit}</TableCell>
                    <TableCell className="text-center">
                      {material.stock_qty < material.min_stock_qty ? (
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
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      <MaterialFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSuccess={fetchMaterials}
      />
    </div>
  );
};

export default Warehouse;
