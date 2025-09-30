import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  Package, 
  Wrench, 
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { WebLayout } from '../layout/WebLayout';

interface ApprovedRequest {
  id: string;
  requester: string;
  resource: string;
  startDate: string;
  endDate: string;
  status: 'entregado' | 'pendiente' | 'devuelto';
}

interface InventoryItem {
  id: string;
  name: string;
  total: number;
  available: number;
  reserved: number;
  maintenance: number;
  lowStock: boolean;
}

interface MaintenanceRecord {
  id: string;
  equipment: string;
  type: string;
  scheduledDate: string;
  responsible: string;
  status: 'programado' | 'en_proceso' | 'completado';
}

export const TechnicianDashboard: React.FC = () => {
  const [approvedRequests] = useState<ApprovedRequest[]>([
    {
      id: '1',
      requester: 'Dr. García',
      resource: 'Osciloscopio Digital',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      status: 'entregado'
    },
    {
      id: '2',
      requester: 'Estudiante - María López',
      resource: 'Multímetro Digital',
      startDate: '2024-03-16',
      endDate: '2024-03-16',
      status: 'pendiente'
    }
  ]);

  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Osciloscopios Digitales',
      total: 5,
      available: 3,
      reserved: 1,
      maintenance: 1,
      lowStock: false
    },
    {
      id: '2',
      name: 'Resistencias 1/4W',
      total: 500,
      available: 45,
      reserved: 0,
      maintenance: 0,
      lowStock: true
    },
    {
      id: '3',
      name: 'Capacitores Electrolíticos',
      total: 200,
      available: 150,
      reserved: 25,
      maintenance: 0,
      lowStock: false
    }
  ]);

  const [maintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: '1',
      equipment: 'Generador de Funciones GF-001',
      type: 'Mantenimiento Preventivo',
      scheduledDate: '2024-03-20',
      responsible: 'Ing. Carlos Mendoza',
      status: 'programado'
    },
    {
      id: '2',
      equipment: 'Multímetro Digital MUL-003',
      type: 'Reparación',
      scheduledDate: '2024-03-18',
      responsible: 'Téc. Ana Jiménez',
      status: 'en_proceso'
    }
  ]);

  const [loading, setLoading] = useState(false);

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'entregado': return 'bg-success text-success-foreground';
      case 'pendiente': return 'bg-warning text-warning-foreground';
      case 'devuelto': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completado': return 'bg-success text-success-foreground';
      case 'en_proceso': return 'bg-warning text-warning-foreground';
      case 'programado': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const headerContent = (
    <div>
      <h1 className="text-xl font-bold">Panel Técnico</h1>
      <p className="text-sm opacity-90">Gestión Operativa</p>
    </div>
  );

  const handleDeliver = async (reservationId: number) => {
    try {
      setLoading(true);
      // await Reservations.deliver(reservationId);
      // volver a cargar la lista o actualizar el estado local
      // await loadApprovedRequests(); // función que ya tienes para obtener solicitudes
      console.log(`Reserva ${reservationId} marcada como entregada`);
    } catch (err) {
      console.error(err);
      // toast.error("No se pudo marcar como entregada");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (reservationId: number) => {
    try {
      setLoading(true);
      // await Reservations.return(reservationId);
      // await loadApprovedRequests();
      console.log(`Reserva ${reservationId} marcada como devuelta`);
    } catch (err) {
      console.error(err);
      // toast.error("No se pudo marcar como devuelta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WebLayout headerContent={headerContent}>
      <div className="p-4 space-y-4">
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Solicitudes Aprobadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Gestiona entregas y devoluciones de recursos asignados
                </p>
                
                {approvedRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <p className="font-semibold text-sm">{request.requester}</p>
                      </div>
                      <Badge className={`${getRequestStatusColor(request.status)} text-xs px-2 py-0`}>
                        {request.status === 'entregado' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {request.status === 'pendiente' && <Clock className="w-3 h-3 mr-1" />}
                        {request.status === 'devuelto' && <XCircle className="w-3 h-3 mr-1" />}
                        <span className="capitalize">{request.status}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium mb-1">{request.resource}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{request.startDate} - {request.endDate}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {request.status === 'pendiente' && (
                        <Button size="sm" className="flex-1" onClick={() => handleDeliver(Number(request.id))}>
                          Entregar
                        </Button>
                      )}
                      {request.status === 'entregado' && (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReturn(Number(request.id))}>
                          Marcar Devuelto
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-primary" />
                  Gestión de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Vista general de equipos y materiales con alertas de stock
                </p>
                
                {inventoryItems.map((item) => (
                  <div key={item.id} className={`border rounded-lg p-3 ${item.lowStock ? 'border-warning bg-warning/5' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{item.name}</p>
                      {item.lowStock && (
                        <Badge className="bg-warning text-warning-foreground text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Stock Bajo
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-medium">{item.total}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Disponible: </span>
                        <span className="font-medium text-success">{item.available}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reservado: </span>
                        <span className="font-medium text-warning">{item.reserved}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mantenimiento: </span>
                        <span className="font-medium text-destructive">{item.maintenance}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Entrada
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Salida
                      </Button>
                      {item.lowStock && (
                        <Button size="sm" className="flex-1">
                          Solicitar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="w-5 h-5 text-primary" />
                  Mantenimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Programar Mantenimiento
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Nuevo Registro
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Mantenimientos Programados:</h3>
                  
                  {maintenanceRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm">{record.equipment}</p>
                        <Badge className={`${getMaintenanceStatusColor(record.status)} text-xs px-2 py-0`}>
                          <span className="capitalize">{record.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-1">Tipo: {record.type}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>Fecha: {record.scheduledDate}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Responsable: {record.responsible}</p>
                      
                      <div className="flex gap-2">
                        {record.status === 'programado' && (
                          <Button size="sm" className="flex-1">
                            Iniciar
                          </Button>
                        )}
                        {record.status === 'en_proceso' && (
                          <Button size="sm" className="flex-1">
                            Completar
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Ver Detalles
                        </Button>
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
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Reportes Operativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary">24</p>
                    <p className="text-xs text-muted-foreground">Entregas del mes</p>
                  </div>
                  <div className="bg-success/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-success">18</p>
                    <p className="text-xs text-muted-foreground">Devoluciones</p>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-warning">3</p>
                    <p className="text-xs text-muted-foreground">Mantenimientos</p>
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-destructive">2.5 días</p>
                    <p className="text-xs text-muted-foreground">Tiempo promedio</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Recursos Más Utilizados:</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Osciloscopio Digital</span>
                      <span className="text-sm font-medium">15 usos</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Multímetro Digital</span>
                      <span className="text-sm font-medium">12 usos</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Generador de Funciones</span>
                      <span className="text-sm font-medium">8 usos</span>
                    </div>
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