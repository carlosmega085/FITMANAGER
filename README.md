# FITMANAGER - Aplicación Móvil de Control de Acceso

**FITMANAGER** es una aplicación móvil nativa desarrollada con **React Native** y **Expo SDK 53**, diseñada para la gestión operativa y el control de acceso en tiempo real a gimnasios y centros deportivos.

La aplicación permite al personal de **Recepción** y **Dueños** validar accesos mediante escaneo de código de barras/QR o búsqueda manual de socios, consultar el estado de membresías activas, visualizar alertas y monitorear el historial de asistencias de forma ágil y segura.

---

## Características Principales

- **Escáner QR / Código de Barras:** Integración fluida con la cámara usando `expo-camera` para lectura rápida de credenciales físicas o digitales.
- **Ingreso Manual y Búsqueda Directa:** Alternativa para ingresar el código manualmente o buscar clientes por nombre/código en un modal interactivo con búsqueda optimizada (`debounced search`).
- **Verificación Instantánea:** Validación en tiempo real conectada al backend (`AccessService`), mostrando estado de membresía (Activo/Inactivo), fecha de vencimiento, foto del socio y tipo de pase.
- **Feedback Auditivo y Visual:** Respuestas sonoras y de color según la resolución de acceso (_Permitido / Denegado / Advertencia_).
- **Historial de Asistencias:** Visualización cronológica de entradas y salidas registradas, con filtros integrados y soporte para _pull-to-refresh_.
- **Autenticación y Sesión Segura:** Manejo de tokens JWT almacenados de forma encriptada en el dispositivo mediante `expo-secure-store`.
- **Navegación Basada en Roles:** Estructura modular de pantallas mediante `expo-router` con vistas protegidas para usuarios autenticados.

---

## Stack Tecnológico

| Tecnología                | Descripción                                                                                 |
| :------------------------ | :------------------------------------------------------------------------------------------ |
| **React Native** (0.79.6) | Framework base para desarrollo móvil multiplataforma.                                       |
| **Expo** (v53.0.27)       | Plataforma y conjunto de herramientas para despliegue y APIs nativas.                       |
| **Expo Router** (v5.1.11) | Enrutamiento declarativo basado en la estructura de archivos (`app/`).                      |
| **Zustand**               | Gestión del estado global ligero (Autenticación y Estado de UI).                            |
| **TanStack React Query**  | Manejo de peticiones asíncronas, caché y actualización automática de datos.                 |
| **Axios**                 | Cliente HTTP configurado con interceptores para inyección de tokens y control de 401.       |
| **React Native Paper**    | Componentes de UI con diseño moderno y soporte completo de temas.                           |
| **Expo SecureStore**      | Almacenamiento seguro del token de acceso en el almacenamiento de credenciales del sistema. |

---

## Estructura del Proyecto

```text
APP-FitManager/
├── api/                  # Configuración de Axios e interceptores de autenticación
│   └── axios.ts
├── app/                  # Rutas y pantallas organizadas por Expo Router
│   ├── (auth)/           # Flujo de autenticación (Login)
│   ├── (main)/           # Vistas principales (Escáner, Historial, Perfil)
│   └── _layout.tsx       # Layout raíz y proveedor de contextos
├── assets/               # Imágenes, fuentes e íconos de la aplicación
├── components/           # Componentes reutilizables de UI
├── constants/            # Colores, temas y tipos constantes
├── services/             # Integración con endpoints de la API (Auth, Accesos)
├── store/                # Tiendas globales Zustand (auth.store, ui.store)
├── types/                # Definiciones de tipos TypeScript
├── utils/                # Utilidades (sonidos, notificaciones, ayuda)
├── app.json              # Configuración general de Expo
├── package.json          # Dependencias y scripts de ejecucion
└── tsconfig.json         # Configuración del compilador TypeScript
```

---

## Requisitos Previos e Instalación

### Requisitos

- **Node.js**: v18.0.0 o superior
- **npm** o **yarn**
- Aplicación **Expo Go** en dispositivo móvil o un emulador **Android Studio / Xcode**

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/carlosmega085/FITMANAGER.git
   cd FITMANAGER
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo Expo:
   ```bash
   npx expo start
   ```

---

## Configuración de API & Backend

La aplicación consume la API REST de **FitManager**. La URL base del servidor está configurada en `api/axios.ts`:

```typescript
const API_BASE_URL = "https://tudominio.com/api/mobile";
```

### Principales Endpoints Consumidos

| Método | Endpoint            | Descripción                                   | Acceso    |
| :----- | :------------------ | :-------------------------------------------- | :-------- |
| `POST` | `/login`            | Inicio de sesión para Dueños y Recepción      | Público   |
| `GET`  | `/me`               | Obtiene el perfil del usuario autenticado     | Protegido |
| `POST` | `/logout`           | Revoca la sesión activa en el dispositivo     | Protegido |
| `POST` | `/verificar-acceso` | Valida el acceso de un socio mediante código  | Protegido |
| `GET`  | `/asistencias`      | Obtiene el listado de asistencias registradas | Protegido |
| `GET`  | `/clientes`         | Búsqueda de socios por código o nombre        | Protegido |

---

## Scripts Disponibles

En la raíz del proyecto puedes ejecutar:

- `npm start`: Inicia el servidor de desarrollo Metro Bundler.
- `npm run android`: Compila y ejecuta la aplicación en un emulador o dispositivo Android conectado.
- `npm run ios`: Compila y ejecuta la aplicación en el simulador de iOS (macOS requerido).
- `npm run web`: Inicia la aplicación en modo Web.
- `npm run lint`: Ejecuta el linter ESLint para comprobar la calidad del código.

---

## Licencia

Este proyecto es de uso privado para la plataforma **FitManager**. Todos los derechos reservados.
