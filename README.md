# API Móvil - Sistema Gestión Gimnasio

Esta documentación describe la API construida para ser consumida por la aplicación móvil (React Native + Expo) del gimnasio. 

Toda la lógica de acceso **reutiliza el `AccessService`** original para mantener la coherencia y no duplicar código con el frontend web.

## URL Base
`https://[tu-dominio]/api/mobile`

---

## 1. Autenticación

Todas las peticiones protegidas deben incluir el header:
`Authorization: Bearer {token}`

### Login
- **Endpoint:** `POST /login`
- **Rate Limit:** 5 intentos por minuto.
- **Acceso:** Público (Solo roles `Dueño` y `Recepción` tendrán éxito).

**Payload:**
```json
{
  "username": "dueño1",
  "password": "password123"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "1|abcdef123456789...",
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "username": "dueño1",
    "email": "admin@gym.com",
    "roles": ["Dueño"]
  }
}
```

**Errores:**
- `401 Unauthorized`: No autenticado o token inválido (o credenciales incorrectas en el login).
- `403 Forbidden`: El usuario no tiene el rol de `Dueño` o `Recepción`.

---

### Obtener Perfil / Yo
- **Endpoint:** `GET /me` (Alias `GET /perfil`)
- **Acceso:** Protegido (Requiere Token).

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "username": "dueño1",
    "email": "admin@gym.com",
    "roles": ["Dueño"]
  }
}
```

---

### Logout
- **Endpoint:** `POST /logout`
- **Acceso:** Protegido (Requiere Token).
- **Acción:** Revoca el token actual del dispositivo móvil.

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

## 2. Escáner de Acceso

Reutiliza al 100% las validaciones de `AccessService` (Horarios, días no laborables, estado de cliente, membresías activas, etc).

- **Endpoint:** `POST /verificar-acceso`
- **Rate Limit:** 30 escaneos por minuto (por usuario).
- **Acceso:** Protegido (Requiere Token).

**Payload:**
```json
{
  "codigo": "123456789"
}
```

**Respuesta Exitosa: Acceso Permitido (200 OK):**
```json
{
  "success": true,
  "message": "Acceso Permitido. ¡Bienvenido!",
  "status": "allowed",
  "tipo": "entrada",
  "warnings": [],
  "cliente": {
    "id": 5,
    "nombre": "Carlos Cliente",
    "codigo": "123456789",
    "foto": "https://[tu-dominio]/storage/clientes/foto.jpg",
    "estado": "activo",
    "membresia": "Plan Mensual VIP",
    "vence": "2026-06-15"
  },
  "asistencia": {
    "hora": "14:30:00",
    "fecha": "2026-05-17"
  }
}
```

**Respuesta de Error: Acceso Denegado (403 Forbidden):**
```json
{
  "success": false,
  "message": "Acceso Denegado: Sin membresía activa.",
  "status": "denied",
  "cliente": { ... } // Se envía si el cliente existe para mostrar su foto en pantalla roja
}
```

> **Nota sobre `status`:** Puede devolver `allowed`, `denied`, `warning` (ej. fuera de horario pero permitido) o `error` (código no encontrado).

---

## 3. Historial de Asistencias

- **Endpoint:** `GET /asistencias`
- **Acceso:** Protegido (Requiere Token).
- **Filtros Soportados (Query Params):**
  - `?fecha=YYYY-MM-DD` (Por defecto filtra por la fecha de hoy).
  - `?cliente=nombre` (Busca por nombre, apellido o código).
  - `?page=2` (Paginación automática de 15 registros).

**Respuesta Exitosa (200 OK):**
```json
{
  "data": [
    {
      "id": 150,
      "fecha": "2026-05-17",
      "hora_entrada": "08:15:00",
      "hora_salida": "10:30:00",
      "cliente": {
        "id": 10,
        "nombre": "Ana Martinez",
        "foto": "https://...",
        "codigo": "456123"
      }
    }
  ],
  "links": { ... },
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

---

## 4. Estructura Creada en Laravel

Si necesitas hacer modificaciones en el futuro, los archivos creados se encuentran en:

1. **Rutas:** `routes/api.php`
2. **Controladores:** 
   - `app/Http/Controllers/Api/Mobile/AuthController.php`
   - `app/Http/Controllers/Api/Mobile/AccesoController.php`
   - `app/Http/Controllers/Api/Mobile/AsistenciaController.php`
3. **Validadores (Requests):**
   - `app/Http/Requests/Api/Mobile/LoginRequest.php`
   - `app/Http/Requests/Api/Mobile/VerificarAccesoRequest.php`
4. **Transformadores JSON (Resources):**
   - `app/Http/Resources/Api/Mobile/ClienteResource.php`
   - `app/Http/Resources/Api/Mobile/AsistenciaResource.php`
