import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Calendar, 
  Package, 
  Settings, 
  MapPin, 
  Phone, 
  Mail,
  Monitor,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { MobileLayout } from '../layout/MobileLayout';

interface LabInfo {
  name: string;
  code: string;
  location: string;
  department: string;
}

interface Responsible {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Equipment {
  id: string;
  name: string;
  code: string;
  status: 'disponible' | 'reservado' | 'mantenimiento' | 'inactivo';
  lastMaintenance: string;
}

export const LabDashboard: React.FC = () => {
  const [selectedLab] = useState<LabInfo>({
    name: 'Laboratorio de Física Avanzada',
    code: 'LAB-FIS-001',
    location: 'Edificio de Ciencias, Piso 3, Aula 301-A TEC - Campus Central',
    department: 'Escuela de Física'
  });

  const [responsibles] = useState<Responsible[]>([
    {
      name: 'Dr. María Elena Rodríguez',
      email: 'mrodriguez@tec.cr',
      phone: '+1 (2) 234-5678',
      role: 'Responsable Principal'
    },
    {
      name: 'Ing. Carlos Mendoza',
      email: 'cmendoza@tec.cr', 
      phone: '+1 (2) 234-5679',
      role: 'Coordinador Técnico'
    }
  ]);

  const [equipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Osciloscopio Digital',
      code: 'OSC-001',
      status: 'disponible',
      lastMaintenance: '2024-03-15'
    },
    {
      id: '2', 
      name: 'Generador de Funciones',
      code: 'GEN-001',
      status: 'reservado',
      lastMaintenance: '2024-02-28'
    },
    {
      id: '3',
      name: 'Multímetro Digital',
      code: 'MUL-001', 
      status: 'mantenimiento',
      lastMaintenance: '2024-01-20'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-success text-success-foreground';
      case 'reservado': return 'bg-warning text-warning-foreground';
      case 'mantenimiento': return 'bg-destructive text-destructive-foreground';
      case 'inactivo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible': return <CheckCircle className="w-4 h-4" />;
      case 'reservado': return <Clock className="w-4 h-4" />;
      case 'mantenimiento': return <AlertTriangle className="w-4 h-4" />;
      case 'inactivo': return <XCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const headerContent = (
    <div>
      <h1 className="text-xl font-bold">Gestión de Laboratorios</h1>
      <p className="text-sm opacity-90">Dashboard Principal</p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent}>
      <div className="p-4 space-y-4">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            {/* Información General */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-base">{selectedLab.name}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Código:</span>
                    <p className="text-muted-foreground">{selectedLab.code}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Ubicación Exacta:</span>
                      <p className="text-muted-foreground">{selectedLab.location}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Departamento/Escuela:</span>
                    <p className="text-muted-foreground">{selectedLab.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsables */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Responsables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {responsibles.map((responsible, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-semibold">{responsible.name}</p>
                    <p className="text-sm text-muted-foreground">{responsible.role}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-primary">{responsible.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{responsible.phone}</span>
                    </div>
                    {index < responsibles.length - 1 && <hr className="my-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Políticas de Uso */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-primary" />
                  Políticas de Uso y Requisitos Académicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Normas y requisitos para el acceso y uso del laboratorio:</h4>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• Requisitos Previos</li>
                      <li>• Curso completado: Física General I y Física General II</li>
                      <li>• Curso completado: Matemática III - Ecuaciones Diferenciales</li>
                      <li>• Programación Matlab y/o Phyton 3.0: PM - 4:00</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Inducción Obligatoria</h4>
                    <p className="text-muted-foreground">Se realizará una inducción de al inducciones de seguridad antes del primer uso.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Normas de Uso</h4>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• Máximo grupos disciplinados bitácora TEC no se permite</li>
                      <li>• Uso de elementos de protección personal obligatorio</li>
                      <li>• Reporte inmediato de fallas o incidentes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="w-5 h-5 text-primary" />
                  Equipos Fijos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {equipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <Badge className={`${getStatusColor(item.status)} text-xs px-2 py-0`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Código: {item.code}</p>
                      <p className="text-xs text-muted-foreground">Último mantenimiento: {item.lastMaintenance}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-primary" />
                  Materiales Consumibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="font-semibold text-sm">Resistencias 1/4W Surtido</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Código: MAT-001</p>
                  <p className="text-xs text-muted-foreground">Cantidad: 245 pcs</p>
                  <p className="text-xs text-muted-foreground">Punto de reorden: 50 pcs</p>
                  <p className="text-xs text-muted-foreground">Proveedor: Digikey</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Solicitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Calendario de Disponibilidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Vista de calendario próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recursos Reservables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Recursos disponibles para reserva</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Historial del Laboratorio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Historial de actividades</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};