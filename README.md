# SIGELA-TEC - Sistema de Gestión de Laboratorios

#### Instituto Tecnológico de Costa Rica - Escuela de Computación  
#### Administración de proyectos - IC4810  
#### Estudiantes: Sebastian Calvo Hernández, Isaac Gamboa Ureña, Daniel Brenes Gómez  
#### Profesor: Jaime Solano Soto

---

## Tabla de contenidos
1. I. Introducción  
2. II. Ámbito del sistema  
3. III. Base de datos  
4. IV. Pruebas  
5. V. Reflexión (Post mortem)  
6. VI. Instalación del sistema
7. VII. Apéndices  

---

## I. Introducción

Visión general  
SIGELA‑TEC es una aplicación web diseñada para coordinar reservas y la gestión de recursos en laboratorios del TEC. La solución plantea dashboards y permisos por rol (estudiante, profesor, técnico, encargado, administrador, departamento) y utiliza una SPA (React + Vite) que consume una API REST (Node + Express) conectada a SQL Server.

Definición del problema  
Los procesos manuales de gestión provocan conflictos de horarios, falta de trazabilidad en entrega/devolución de equipo y dificultades para coordinar mantenimiento. Estas deficiencias generan desperdicio de tiempo y recursos.

Solución propuesta  
Se propone una plataforma centralizada que autentica usuarios por rol (JWT en cookie httpOnly), permite búsqueda y reserva de recursos, registra movimientos de inventario, muestra próximas reservas y envía notificaciones por usuario. La interfaz es responsiva y el backend delega la lógica de datos a stored procedures seguros en SQL Server.

Justificación (beneficios)  
Con SIGELA‑TEC se reducen conflictos de reserva, se mejora la trazabilidad de activos, se facilita la coordinación de mantenimiento y se centraliza la información administrativa, lo que aporta eficiencia y control.

Descripción del documento  
Se introduce el proyecto, define alcance y supuestos, documenta la base de datos, expone la estrategia y resultados de pruebas, aporta una reflexión post mortem, un manual de instalación y apéndices con tablas y utilidades para entrega.

Objetivos generales y específicos  
El objetivo general es digitalizar y centralizar la gestión de laboratorios. Los objetivos específicos incluyen: autenticación por roles, búsqueda y reserva de recursos, vistas de próximas reservas e historial, notificaciones por usuario y control básico de inventario y movimientos.

Criterios de éxito  
Se considerará exitoso el proyecto si la aplicación permite iniciar sesión con cookie httpOnly, buscar recursos con filtros, visualizar próximas reservas por usuario, listar y marcar notificaciones como leídas, y si se documentan al menos cinco pruebas reproducibles con logs.

---

## II. Ámbito del sistema

Alcance  
El sistema incluye creación y administración de usuarios y roles, búsqueda avanzada de recursos, creación y gestión de reservas, paneles por rol, histórico y próximas reservas, notificaciones por usuario y registro básico de inventario y movimientos. También expone endpoints administrativos para extracción de datos y mantenimiento.

Suposiciones  
Se asume la existencia de una base de datos Microsoft SQL Server con los stored procedures que el backend invoca. En desarrollo se opera generalmente sin TLS; para producción es obligatorio habilitar HTTPS y cookies con secure=true.

Restricciones  
La API depende de stored procedures en MSSQL y las sesiones se gestionan mediante cookie httpOnly (no accesible desde JS). En el ejemplo de backend las contraseñas pueden compararse en texto; antes de subir a producción es imprescindible usar hashing (bcrypt) y revisar políticas de secretos.

Funcionamiento (HW/SW / tiempos)  
Para pruebas locales un servidor con 1 vCPU y 1–2 GB RAM es suficiente; producción requerirá recursos mayores según carga. Software requerido: Node.js (v18+), npm, SQL Server accesible. El despliegue local típico (DB preparada, npm install, arrancar servidor y frontend) toma entre 10 y 20 minutos.

---

## III. Base de datos

Esquema general  
Las entidades principales son: Users, Labs, Resources, Reservations, ReservationFulfillment, Inventory, InventoryMovements, MaintenanceJobs, AuditLog, StatusLabels y Notifications.

![Diagrama del sistema](documentacion/DiagramaBD.png)

Descripción de tablas (en resumen)  
Users contiene credenciales, rol y estado. Labs describe laboratorios y ubicaciones. Resources lista equipos vinculados a labs. Reservations guarda intervalos de uso y estados. ReservationFulfillment documenta entregas y devoluciones. Inventory y InventoryMovements controlan stock y movimientos con motivo y usuario. Notifications almacena mensajes por usuario y su marca de lectura.

Integridad referencial y restricciones  
Existen claves foráneas entre Resources a Labs, Reservations a (Resources,Labs,Users), InventoryMovements a Resources y Notifications a Users. Se recomienda agregar CHECKs: Reservations debe cumplir starts_at < ends_at; Inventory debe garantizar total_qty >= 0.

Índices y rendimiento  
Índices sugeridos: Resources(lab_id, is_active), Reservations(resource_id, starts_at), InventoryMovements(resource_id, created_at) y AuditLog(ts DESC). Revisar planes de ejecución según volumen.

Stored procedures usados (revisar nombres exactos en `api/index.js`)  
Auth_GetUserByUsernameRole, GetUserById, dbo.usp_Labs_List, sigela.usp_Resources_Search, sigela.usp_Reservations_UpcomingByUser, sigela.usp_Reservations_HistoryByUser (o equivalente), dbo.Notifications_ListByUser, dbo.Notifications_MarkRead, dbo.Notifications_Create.

---

## IV. Pruebas

Estrategia de pruebas  
Por ahora no contamos con  pruebas automatizadas. Estamos validando el proyecto de forma manual comprobando los flujos más importantes: login, búsqueda de recursos, creación de reservas y notificaciones. Para cada verificación manual registre el paso o comando realizado, la respuesta JSON completa y los extractos de log relevantes. En una próxima iteración añadiremos pruebas automatizadas (Jest + supertest para backend; Playwright o Cypress para E2E) y configuraremos CI para ejecutarlas automáticamente.

![Login](documentacion/Login.png)

![Estudiante/Docente](documentacion/EstudiantesDocentes.png)

![Historial](documentacion/EstudiantesDocentesHistorial.png)

![Avisos](documentacion/EstudiantesDocentesAvisos.png)

![Tecnicos y Encargados](documentacion/Tech.png)

![Inventario](documentacion/TechInventario.png)

![Mantenimiento](documentacion/TechMantenimiento.png)

![Reportes](documentacion/TechReportes.png)

![Laboratorio y departamentos](documentacion/Lab.png)

![Lab Inventario](documentacion/LabInventario.png)

![Lab Calendario](documentacion/LabCalendario.png)

![Lab Recursos](documentacion/LabRecursos.png)

![Lab Historial](documentacion/LabHistorial.png)

![Admin](documentacion/Admin.png)

![Admin Config](documentacion/AdminConfig.png)

![Admin Auditoria](documentacion/AdminAuditoria.png)

![Admin Reportes](documentacion/AdminReportes.png)

---

## V. Reflexión (Post mortem)

Evaluación del proyecto  
La separación entre frontend y backend facilita pruebas y despliegue independiente. La elección de cookies httpOnly para la sesión aporta protección frente a XSS. El uso de stored procedures centraliza la lógica de datos.

Lecciones aprendidas  
Es importante formalizar contratos API (OpenAPI) y añadir hashing de contraseñas y pruebas automatizadas desde etapas tempranas. El manejo de secretos y configuración es crítico para despliegues seguros.

Errores y limitaciones conocidos  
En el ejemplo entregado el backend puede comparar contraseñas en texto: esto debe corregirse por bcrypt. No se incluyen suites de tests automatizados ni scripts de despliegue para producción en la versión entregada.

Mejoras para iteraciones futuras  
Implementar hashing de contraseñas, tests unitarios y e2e, documentación OpenAPI, CI/CD y configuración de despliegue con HTTPS y cookies secure.

---

## VI. Instalación del sistema

#### Manual paso a paso (Linux)

Requisitos previos: Node.js v18+, npm, acceso a SQL Server y Git. Configure la base de datos antes de arrancar el backend.

Clonar el repositorio y preparar proyectos:
```bash
git clone https://github.com/SebasCH04/SIGELA-TEC
cd SIGELA-TEC
```

Preparar y levantar backend:
```bash
cd api
npm install
node index.js
```

Instalar y arrancar frontend:
```bash
cd ..
npm install
npm run dev
```

Conexión entre capas  
El frontend realiza fetch a la API en http://localhost:3000 (configurable). Asegúrese de que las variables en `api/.env` apunten correctamente al servidor SQL y que los stored procedures estén instalados.

---

## VII. Apéndices

Tablas detalladas (ejemplo técnico)  
Users: id PK, username, password(hashed), role, active, created_at.  
Labs: id PK, name, code, building, is_active.  
Resources: id PK, lab_id FK, resource_name, building, is_active.  
Reservations: id PK, resource_id FK, lab_id FK, user_id FK, starts_at, ends_at, status.  
ReservationFulfillment: reservation_id FK, delivered_at, delivered_by, returned_at, returned_by, notes.  
Inventory: resource_id PK, total_qty, maintenance_qty, min_stock, updated_at.  
InventoryMovements: id PK, resource_id FK, movement_type, qty, reason, user_id, created_at.  
Notifications: id PK, user_id FK, title, message, kind, created_at, read_at.

Programas por capa (archivos clave)  
Frontend principales: `src/main.tsx`, `src/App.tsx`, `src/components/auth/LoginForm.tsx`, `src/components/dashboard/UserDashboard.tsx`, `src/components/layout/WebLayout.tsx`, `src/lib/api.ts`, `src/services/auth.ts`, `src/services/notifications.ts`.  
Backend principal: `api/index.js` y el fichero de configuración `api/.env`.

cURL y ejemplos rápidos (usar cookies para sesión)
Health:
```bash
curl -sS http://localhost:3000/api/health
```
Login (guardar cookie en cookies.txt):
```bash
curl -v -X POST -H "Content-Type:application/json" -c cookies.txt \
  -d '{"username":"demo","password":"demo","role":"ESTUDIANTE"}' \
  http://localhost:3000/api/auth/login
```
Me (usar cookie):
```bash
curl -b cookies.txt http://localhost:3000/api/auth/me
```
Buscar recursos:
```bash
curl -b cookies.txt "http://localhost:3000/api/resources/search?q=microscopio&available=1"
```