import React, { useEffect, useState } from 'react';
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
   XCircle,
   CogIcon
 } from 'lucide-react';
import { Notifs, NotificationRow } from '@/services/notifications';
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

type Upcoming = {
  id: number;
  resource_name: string;
  lab_name: string;
  date: string;
  time: string;
  status: 'aprobada' | 'pendiente' | 'rechazada';
};

type ResourceRow = {
  resource_id: number;
  resource_name: string;
  lab_name: string;
  building: string | null;
  availability: 'DISPONIBLE' | 'RESERVADO';
};

type PastReservation = {
  id: number | string;
  resource_name: string;
  lab_name: string;
  start_date: string;
  end_date: string;
  status: string;
};

export const UserDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [upcoming, setUpcoming] = useState<Upcoming[]>([]);
  const [results, setResults] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // filtro toggle: cuando true solo muestra recursos DISPONIBLE (available=1)
  const [filterAvailable, setFilterAvailable] = useState(false);
  
  // Filtrado cliente-side para asegurar que el toggle afecte la UI inmediatamente
  const filteredResults = filterAvailable
    ? results.filter(r => r.availability === 'DISPONIBLE')
    : results;
  
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [notifsLoading, setNotifsLoading] = useState(false);

  const fetchNotifications = async (onlyUnread = false) => {
    try {
      setNotifsLoading(true);
      const list = await Notifs.list(onlyUnread, 50);
      setNotifications(list || []);
    } catch (e) {
      console.error('fetchNotifications', e);
      setNotifications([]);
    } finally {
      setNotifsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(false);
  }, []);

  const [history, setHistory] = useState<PastReservation[]>([]);

  // Cargar próximas reservas (arriba del dashboard)
  useEffect(() => {
    fetch('/api/me/upcoming', { credentials: 'include' })
      .then(r => r.ok ? r.json() : r.json().then(Promise.reject))
      .then((data) => setUpcoming(Array.isArray(data) ? data : []))
      .catch(() => setUpcoming([]));
  }, []);

  // Buscar recursos (cuando cambia el texto de búsqueda o el filtro)
  useEffect(() => {
    setLoading(true);
    setErr(null);
    const url = new URL('/api/resources/search', window.location.origin);
    if (searchQuery) url.searchParams.set('q', searchQuery);
    // si el toggle está activado, pedimos solo disponibles
    if (filterAvailable) url.searchParams.set('available', '1');
    else url.searchParams.delete('available');

    fetch(url.toString(), { credentials: 'include' })
      .then(r => r.ok ? r.json() : r.json().then(Promise.reject))
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch((e) => setErr(e?.error || 'Error cargando recursos'))
      .finally(() => setLoading(false));
  }, [searchQuery, filterAvailable]);

  // Cargar historial personal
  useEffect(() => {
    fetch('/api/me/history', { credentials: 'include' })
      .then(r => r.ok ? r.json() : r.json().then(Promise.reject))
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]));
  }, []);

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
    switch (type?.toUpperCase?.()) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'WARN':    return <Clock className="w-4 h-4 text-warning" />;
      case 'ERROR':   return <XCircle className="w-4 h-4 text-destructive" />;
      case 'INFO':    return <Bell className="w-4 h-4 text-primary" />;
      default:        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const markNotificationRead = async (id?: number) => {
    try {
      if (id == null) await Notifs.markAll();
      else await Notifs.markRead(id);
      await fetchNotifications(false);
    } catch (e) {
      console.error('markNotificationRead', e);
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
                <p className="text-sm text-muted-foreground">
                  Tienes {upcoming.length} {upcoming.length === 1 ? 'reserva próxima' : 'reservas próximas'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Próximas Reservas:</h3>
              {upcoming.slice(0, 2).map((r) => (
                <div key={r.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{r.lab_name}</p>
                    <Badge className={`${getStatusColor(r.status)} text-xs px-2 py-0`}>
                      {getStatusIcon(r.status)}
                      <span className="ml-1 capitalize">{r.status}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.date} • {r.time}</p>
                  <p className="text-xs text-muted-foreground">Solicitado por: {r.resource_name}</p>
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
                  <Button
                    variant={filterAvailable ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setFilterAvailable(v => !v)}
                    aria-pressed={filterAvailable}
                    title={filterAvailable ? 'Solo disponibles (activado)' : 'Mostrar solo disponibles'}
                  >
                    <Filter className={`w-4 h-4 ${filterAvailable ? 'text-white' : ''}`} />
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Resultados de búsqueda:</h3>
                  
                  {err && <p className="text-red-500 text-sm">{err}</p>}
                  {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}

                  {!loading && filteredResults.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin resultados</p>
                  )}

                  {filteredResults.map((row) => (
                    <div key={row.resource_id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm">{row.resource_name}</p>
                        <Badge
                          className={
                            row.availability === 'DISPONIBLE'
                              ? 'bg-success text-success-foreground text-xs'
                              : 'bg-warning text-warning-foreground text-xs'
                          }
                        >
                          {row.availability === 'DISPONIBLE' ? 'Disponible' : 'Reservado'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {row.lab_name} • {row.building ?? ''}
                      </p>
                      <Button
                        size="sm"
                        className="w-full"
                        variant={row.availability === 'DISPONIBLE' ? 'default' : 'outline'}
                        disabled={row.availability !== 'DISPONIBLE'}
                      >
                        {row.availability === 'DISPONIBLE' ? 'Reservar' : 'No Disponible'}
                      </Button>
                    </div>
                  ))}

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
                
                {upcoming.map((r) => (
                  <div key={r.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{r.lab_name}</p>
                      <Badge className={`${getStatusColor(r.status)} text-xs px-2 py-0`}>
                        {getStatusIcon(r.status)}
                        <span className="ml-1 capitalize">{r.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{r.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{r.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <CogIcon className="w-4 h-4" />
                      <span>{r.resource_name}</span>
                    </div>
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
                  {history.length === 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                      No hay reservas en el historial.
                    </div>
                  )}
                  {history.map((h) => (
                    <div key={h.id} className="bg-muted/50 rounded-lg p-3">
                      <p className="font-medium text-sm mb-1">{h.resource_name} - <span className="text-xs font-normal">{h.status}</span></p>
                      <p className="text-xs text-muted-foreground">{h.lab_name}</p>
                      <p className="text-xs text-muted-foreground">{h.start_date} • {h.end_date}</p>
                    </div>
                  ))}
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
                <div className="ml-auto">
                  <Button variant="ghost" size="sm" onClick={() => markNotificationRead()}>
                    Marcar todas como leídas
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifsLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}

                {!notifsLoading && notifications.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No hay notificaciones</p>
                  </div>
                )}

                {notifications.map((n) => (
                  <div key={n.id} className={`border rounded-lg p-3 ${n.read_at ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(n.kind)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.created_at}</p>
                      </div>
                      <div className="flex items-start">
                        {!n.read_at && (
                          <Button size="sm" onClick={() => markNotificationRead(n.id)}>Marcar</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
               </CardContent>
             </Card>
           </TabsContent>
        </Tabs>
      </div>
    </WebLayout>
  );
};