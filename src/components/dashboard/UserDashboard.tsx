import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Calendar, 
  Clock, 
  Bell,
  User,
  BookOpen,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { WebLayout } from '../layout/WebLayout';

interface Reservation {
  id: string;
  resource: string;
  laboratory: string;
  date: string;
  time: string;
  status: 'aprobada' | 'pendiente' | 'rechazada';
}

interface Notification {
  id: string;
  type: 'approval' | 'reminder' | 'rejection';
  message: string;
  time: string;
}

export const UserDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [upcomingReservations] = useState<Reservation[]>([
    {
      id: '1',
      resource: 'Dr. García',
      laboratory: 'Osciloscopio Digital',
      date: '2024-03-15',
      time: '09:00 - 11:00',
      status: 'aprobada'
    },
    {
      id: '2',
      resource: 'Investigación',
      laboratory: 'Generador de Funciones',
      date: '2024-03-18',
      time: '13:00 - 15:00',
      status: 'pendiente'
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'approval',
      message: 'Su reserva para el Osciloscopio Digital ha sido aprobada',
      time: 'Hace 2 horas'
    },
    {
      id: '2',
      type: 'reminder',
      message: 'Recordatorio: Entrega mañana a las 11:00 AM',
      time: 'Hace 5 horas'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobada': return 'bg-success text-success-foreground';
      case 'pendiente': return 'bg-warning text-warning-foreground';
      case 'rechazada': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprobada': return <CheckCircle className="w-4 h-4" />;
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'rechazada': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'reminder': return <Clock className="w-4 h-4 text-warning" />;
      case 'rejection': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const headerContent = (
    <div>
      <h1 className="text-xl font-bold">Portal Estudiante/Docente</h1>
      <p className="text-sm opacity-90">Bienvenido al sistema</p>
    </div>
  );

  return (
    <WebLayout headerContent={headerContent}>
      <div className="p-4 space-y-4">
        {/* Resumen de bienvenida */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">¡Bienvenido!</h2>
                <p className="text-sm text-muted-foreground">Tienes 2 reservas próximas</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Próximas Reservas:</h3>
              {upcomingReservations.slice(0, 2).map((reservation) => (
                <div key={reservation.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{reservation.laboratory}</p>
                    <Badge className={`${getStatusColor(reservation.status)} text-xs px-2 py-0`}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1 capitalize">{reservation.status}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{reservation.date} • {reservation.time}</p>
                  <p className="text-xs text-muted-foreground">Solicitado por: {reservation.resource}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="search">Buscar</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="notifications">Avisos</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4 mt-4">
            {/* Búsqueda de recursos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5 text-primary" />
                  Buscar Recursos/Laboratorios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar equipos, laboratorios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Resultados de búsqueda:</h3>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">Osciloscopio Digital</p>
                      <Badge className="bg-success text-success-foreground text-xs">Disponible</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Lab. Física Avanzada • Edificio Ciencias</p>
                    <Button size="sm" className="w-full">
                      Reservar
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">Generador de Funciones</p>
                      <Badge className="bg-warning text-warning-foreground text-xs">Reservado</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Lab. Física Avanzada • Edificio Ciencias</p>
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      No Disponible
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Calendario Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Vista de todas tus reservas aprobadas y pendientes</p>
                
                {upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{reservation.laboratory}</p>
                      <Badge className={`${getStatusColor(reservation.status)} text-xs px-2 py-0`}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1 capitalize">{reservation.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{reservation.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{reservation.time}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Historial Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Historial de reservas pasadas y constancias académicas</p>
                
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-sm mb-1">Multímetro Digital - Completado</p>
                    <p className="text-xs text-muted-foreground">2024-03-10 • 14:00 - 16:00</p>
                    <p className="text-xs text-muted-foreground">Devuelto exitosamente</p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-sm mb-1">Protoboard - Completado</p>
                    <p className="text-xs text-muted-foreground">2024-03-08 • 10:00 - 12:00</p>
                    <p className="text-xs text-muted-foreground">Devuelto exitosamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-primary" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center text-muted-foreground text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No hay más notificaciones</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WebLayout>
  );
};