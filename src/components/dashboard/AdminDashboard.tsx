import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Settings, 
  FileText,
  TrendingUp,
  Calendar,
  Package,
  Wrench,
  Shield,
  Clock
} from 'lucide-react';
import { WebLayout } from '../layout/WebLayout';

interface Metric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'encargado' | 'tecnico' | 'docente' | 'estudiante';
  status: 'activo' | 'inactivo';
  lastAccess: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
}

export const AdminDashboard: React.FC = () => {
  const [globalMetrics] = useState<Metric[]>([
    {
      label: 'Reservas Totales',
      value: 847,
      trend: 'up',
      icon: <Calendar className="w-4 h-4" />,
      color: 'text-primary'
    },
    {
      label: 'Mantenimientos Activos', 
      value: 12,
      trend: 'neutral',
      icon: <Wrench className="w-4 h-4" />,
      color: 'text-warning'
    },
    {
      label: 'Usuarios Activos',
      value: 234,
      trend: 'up', 
      icon: <Users className="w-4 h-4" />,
      color: 'text-success'
    },
    {
      label: 'Utilización Global',
      value: '78%',
      trend: 'up',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-primary'
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. María García',
      email: 'mgarcia@tec.cr',
      role: 'docente',
      status: 'activo',
      lastAccess: '2024-03-15 09:30'
    },
    {
      id: '2', 
      name: 'Carlos Mendoza',
      email: 'cmendoza@tec.cr',
      role: 'tecnico',
      status: 'activo',
      lastAccess: '2024-03-15 08:45'
    },
    {
      id: '3',
      name: 'Ana López',
      email: 'alopez@estudiantes.tec.cr',
      role: 'estudiante',
      status: 'activo',
      lastAccess: '2024-03-14 16:20'
    }
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      user: 'Dr. María García',
      action: 'Solicitud de reserva aprobada',
      module: 'Reservas',
      timestamp: '2024-03-15 09:30:15'
    },
    {
      id: '2',
      user: 'Carlos Mendoza',
      action: 'Equipo marcado en mantenimiento',
      module: 'Inventario',
      timestamp: '2024-03-15 08:45:22'
    },
    {
      id: '3',
      user: 'Admin Sistema',
      action: 'Configuración de parámetros globales',
      module: 'Configuración',
      timestamp: '2024-03-14 17:15:33'
    }
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'bg-destructive text-destructive-foreground';
      case 'encargado': return 'bg-primary text-primary-foreground';
      case 'tecnico': return 'bg-warning text-warning-foreground';
      case 'docente': return 'bg-success text-success-foreground';
      case 'estudiante': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'activo' 
      ? 'bg-success text-success-foreground' 
      : 'bg-destructive text-destructive-foreground';
  };

  const headerContent = (
    <div>
      <h1 className="text-xl font-bold">Panel Administrativo</h1>
      <p className="text-sm opacity-90">Sistema de Gestión Global</p>
    </div>
  );

  return (
    <WebLayout headerContent={headerContent}>
      <div className="p-4 space-y-4">
        {/* Dashboard Inicial */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
              Métricas Globales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {globalMetrics.map((metric, index) => (
                <div key={index} className="bg-card border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${metric.color}`}>
                      {metric.icon}
                    </div>
                    {metric.trend && (
                      <TrendingUp className={`w-3 h-3 ${
                        metric.trend === 'up' ? 'text-success' : 
                        metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <p className="text-xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Gestión de Usuarios y Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 mb-4">
                  <Button size="sm" className="flex-1">
                    Agregar Usuario
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Importar CSV
                  </Button>
                </div>
                
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <div className="flex gap-1">
                        <Badge className={`${getRoleColor(user.role)} text-xs px-2 py-0`}>
                          {user.role}
                        </Badge>
                        <Badge className={`${getStatusColor(user.status)} text-xs px-2 py-0`}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">{user.email}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      <span>Último acceso: {user.lastAccess}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Modificar Permisos
                      </Button>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-primary" />
                  Configuración de Parámetros Globales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Reglas de Reserva:</h3>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Duración máxima por reserva</span>
                      <span className="text-sm text-muted-foreground">7 días</span>
                    </div>
                    <Button size="sm" variant="outline">Modificar</Button>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Antelación mínima</span>
                      <span className="text-sm text-muted-foreground">24 horas</span>
                    </div>
                    <Button size="sm" variant="outline">Modificar</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Estados y Etiquetas:</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-success text-success-foreground">Disponible</Badge>
                    <Badge className="bg-warning text-warning-foreground">Reservado</Badge>
                    <Badge className="bg-destructive text-destructive-foreground">Mantenimiento</Badge>
                    <Badge className="bg-muted text-muted-foreground">Inactivo</Badge>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      + Agregar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Notificaciones:</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Recordatorios de entrega</span>
                      <Badge className="bg-success text-success-foreground text-xs">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Alertas de mantenimiento</span>
                      <Badge className="bg-success text-success-foreground text-xs">Activo</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  Auditoría del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 mb-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    Filtrar por Usuario
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Filtrar por Módulo
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Actividades Recientes:</h3>
                  
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{log.user}</p>
                        <Badge variant="outline" className="text-xs">
                          {log.module}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Reportes Institucionales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">Reporte de Uso Global</p>
                        <p className="text-xs text-muted-foreground">Estadísticas generales de utilización</p>
                      </div>
                      <Button size="sm">Generar</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">Inventario Consolidado</p>
                        <p className="text-xs text-muted-foreground">Estado actual de todos los recursos</p>
                      </div>
                      <Button size="sm">Generar</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">Consumo de Materiales</p>
                        <p className="text-xs text-muted-foreground">Análisis de consumo por período</p>
                      </div>
                      <Button size="sm">Generar</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">Desempeño por Laboratorio</p>
                        <p className="text-xs text-muted-foreground">Métricas de eficiencia operativa</p>
                      </div>
                      <Button size="sm">Generar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-2">Exportar Datos</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">PDF</Button>
                    <Button size="sm" variant="outline" className="flex-1">Excel</Button>
                    <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WebLayout>
  );
};