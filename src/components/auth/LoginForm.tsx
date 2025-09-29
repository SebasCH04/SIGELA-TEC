import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import laboratoryHero from '@/assets/laboratory-hero.jpg';

// 1) Opciones que muestras en la UI (no cambian)
const userRoles = [
  { value: 'estudiante',   label: 'Estudiante' },
  { value: 'profesor',     label: 'Profesor/Docente' },
  { value: 'tecnico',      label: 'Personal Técnico' },
  { value: 'encargado',    label: 'Encargado de Laboratorio' },
  { value: 'administrador',label: 'Administrador del Sistema' },
  { value: 'departamento', label: 'Escuela/Departamento' },
];

// 2) Mapa "UI → Backend" (ajústalo a los códigos reales que guardaste en SQL)
const ROLE_UI_TO_API: Record<string, string> = {
  estudiante:   'ESTUDIANTE',
  profesor:     'PROF',         // o 'PROFESOR' si así lo tienes en BD
  tecnico:      'TECNICO',
  encargado:    'ENCARGADO',
  administrador:'ADMIN',
  departamento: 'DEPARTAMENTO',
};

// 3) A dónde navegar según el rol REAL devuelto por el backend
const MODULE_BY_ROLE: Record<string, string> = {
  ADMIN:        '/dashboard/administrador',
  PROF:         '/dashboard/profesor',
  PROFESOR:     '/dashboard/profesor',      // por si usas este código en BD
  TECNICO:      '/dashboard/tecnico',
  ENCARGADO:    '/dashboard/encargado',
  ESTUDIANTE:   '/dashboard/estudiante',
  DEPARTAMENTO: '/dashboard/departamento',
};

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // rol UI (spanish)
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !selectedRole) return;

    setIsLoading(true);
    setErr(null);

    try {
      // Traduce rol UI → código del backend
      const apiRole = ROLE_UI_TO_API[selectedRole];

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // importante para la cookie httpOnly
        body: JSON.stringify({ username, password, role: apiRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Error de autenticación');
      }

      // El backend devuelve { user: { id, username, role, active } }
      const user = data.user as { id:number; username:string; role:string; active?:boolean };

      // Decide destino por el rol REAL del backend
      const dest = MODULE_BY_ROLE[user.role] ?? `/dashboard/${selectedRole}`;
      navigate(dest, { replace: true });
    } catch (e: any) {
      setErr(e?.message || 'Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-6">
        {/* TEC Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-4xl font-bold text-white">TEC</div>
            <div className="h-12 w-px bg-white"></div>
            <div className="text-white leading-tight">
              <div className="text-lg">Instituto Tecnológico</div>
              <div className="text-lg">de Costa Rica</div>
            </div>
          </div>
        </div>

        {/* Laboratory Hero Image */}
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          <img
            src={laboratoryHero}
            alt="Laboratorio TEC"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Login Card */}
        <Card className="rounded-t-none shadow-2xl border-t-0">
          <CardHeader className="text-center pb-6">
            <h1 className="text-3xl font-bold text-primary">SIGELA-TEC</h1>
            <p className="text-base text-muted-foreground">Sistema de Gestión de Laboratorios</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Correo Electrónico"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-14 text-base bg-tec-gray border-tec-gray-medium"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 text-base bg-tec-gray border-tec-gray-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Role */}
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-14 text-base bg-tec-gray border-tec-gray-medium">
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

              {/* Error */}
              {err && (
                <p className="text-red-500 text-sm text-center">
                  {err}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary-dark transition-colors"
                disabled={isLoading || !username || !password || !selectedRole}
              >
                {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>

              {/* Forgot */}
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

        <div className="text-center mt-6 text-sm text-white/80">
          © 2025 Instituto Tecnológico de Costa Rica
        </div>
      </div>
    </div>
  );
};