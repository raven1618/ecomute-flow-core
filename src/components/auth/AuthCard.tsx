
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call your auth service
    if (email && password) {
      // For demo purposes, we'll just navigate to dashboard
      toast({
        title: isLogin ? "Login successful" : "Account created",
        description: "Welcome to ECOMUTE Core",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
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
            <CardTitle>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Ingrese sus credenciales para acceder al sistema" 
                : "Complete el formulario para registrarse"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@empresa.com" 
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
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "¿No tiene cuenta? Regístrese" 
                : "¿Ya tiene cuenta? Inicie sesión"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthCard;
