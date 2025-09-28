import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import laboratoryHero from '@/assets/laboratory-hero.jpg';

const userRoles = [
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'profesor', label: 'Profesor/Docente' },
  { value: 'tecnico', label: 'Personal Técnico' },
  { value: 'encargado', label: 'Encargado de Laboratorio' },
  { value: 'administrador', label: 'Administrador del Sistema' },
  { value: 'departamento', label: 'Escuela/Departamento' },
];

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !selectedRole) return;
    
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/dashboard/${selectedRole}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* TEC Header */}
      <div className="bg-primary text-white p-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="text-3xl font-bold">TEC</div>
          <div className="h-8 w-px bg-white"></div>
          <div className="text-sm leading-tight">
            <div>Tecnológico</div>
            <div>de Costa Rica</div>
          </div>
        </div>
      </div>

      {/* Laboratory Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={laboratoryHero} 
          alt="Laboratorio TEC" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Login Card */}
      <div className="relative -mt-8 px-6 pb-8">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center pb-4">
            <h1 className="text-2xl font-bold text-primary">SIGELA-TEC</h1>
            <p className="text-sm text-muted-foreground">Sistema de Gestión de Laboratorios</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 bg-tec-gray border-tec-gray-medium"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-tec-gray border-tec-gray-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Role Selection */}
              <Select value={selectedRole} onValueChange={setSelectedRole} required>
                <SelectTrigger className="h-12 bg-tec-gray border-tec-gray-medium">
                  <SelectValue placeholder="Seleccionar Rol" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary-dark transition-colors"
                disabled={isLoading || !username || !password || !selectedRole}
              >
                {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};