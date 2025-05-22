
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const materialTypes = [
  { value: "raw", label: "Materia Prima" },
  { value: "finished", label: "Producto Terminado" },
  { value: "consumable", label: "Consumible" },
  { value: "tool", label: "Herramienta" },
];

const MaterialFormDialog = ({ open, onOpenChange, onSuccess }: MaterialFormDialogProps) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "raw",
    unit: "",
    stock_qty: 0,
    min_stock_qty: 0,
    unit_cost: 0,
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Check for required fields according to the Supabase schema
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del material es obligatorio",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.unit.trim()) {
      toast({
        title: "Error",
        description: "La unidad de medida es obligatoria",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.unit_cost <= 0) {
      toast({
        title: "Error",
        description: "El costo unitario debe ser mayor a cero",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('materials_stock')
        .insert({
          code: formData.code || null,
          name: formData.name,
          description: formData.description || null,
          type: formData.type,
          unit: formData.unit,
          stock_qty: formData.stock_qty,
          min_stock_qty: formData.min_stock_qty,
          unit_cost: formData.unit_cost,
          location: formData.location || null,
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Material creado",
        description: "El material ha sido registrado exitosamente",
      });
      
      // Reset form and close dialog
      setFormData({
        code: "",
        name: "",
        description: "",
        type: "raw",
        unit: "",
        stock_qty: 0,
        min_stock_qty: 0,
        unit_cost: 0,
        location: "",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating material:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el material. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Material</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="SKU o código interno"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del material"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción detallada del material"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad <span className="text-red-500">*</span></Label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="kg, unidad, m, etc."
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_qty">Cantidad Inicial</Label>
              <Input
                id="stock_qty"
                name="stock_qty"
                type="number"
                min="0"
                step="0.01"
                value={formData.stock_qty}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_stock_qty">Punto de Reorden</Label>
              <Input
                id="min_stock_qty"
                name="min_stock_qty"
                type="number"
                min="0"
                step="0.01"
                value={formData.min_stock_qty}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit_cost">Costo Unitario <span className="text-red-500">*</span></Label>
              <Input
                id="unit_cost"
                name="unit_cost"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.unit_cost}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Estante, bodega, etc."
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialFormDialog;
