
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegisterMode) {
        // Register new user
        const { error } = await signUp(email, password);
        
        if (error) throw error;
        
        toast({
          title: "Registro exitoso",
          description: "Su cuenta ha sido creada. Verifique su correo para confirmar su cuenta.",
        });
        
        // Don't navigate yet as the user might need to verify their email first
      } else {
        // Login existing user
        const { error } = await signIn(email, password);
        
        if (error) throw error;
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido a ECOMUTE Core",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error.message || "Error en la autenticación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ecomute-700">ECOMUTE Core</h1>
          <p className="text-gray-600 mt-2">Sistema Integrado de Gestión</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isRegisterMode ? "Crear Cuenta" : "Iniciar Sesión"}</CardTitle>
            <CardDescription>
              {isRegisterMode 
                ? "Complete los campos para crear una nueva cuenta" 
                : "Ingrese sus credenciales para acceder al sistema"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com" 
                  disabled={isLoading}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required 
                />
              </div>
              <Button 
                onClick={handleAuth} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRegisterMode ? "Registrando..." : "Iniciando sesión..."}
                  </>
                ) : (
                  isRegisterMode ? "Registrarse" : "Iniciar Sesión"
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="px-0"
            >
              {isRegisterMode 
                ? "¿Ya tiene una cuenta? Inicie sesión" 
                : "¿No tiene una cuenta? Regístrese"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
