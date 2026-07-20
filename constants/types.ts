// 🎯 1. Modelos Base de la Empresa
export interface Empresa {
  id: number;
  nombre: string;
  mensaje_ticket: string;
  whatsapp_enabled: boolean;
  estado: 'activo' | 'inactivo';
}

export interface Juego {
  id: number;
  empresa_id: number;
  nombre: string;
  tipo_numero: '2D' | '3D' | 'fecha';
  timezone: string;
  multiplicador_default: number;
  rango_min: number;
  rango_max: number;
  estado: 'activo' | 'inactivo';
}

export interface Turno {
  id: number;
  juego_id: number;
  empresa_id: number;
  nombre: string;
  hora_sorteo: string; // HH:MM:SS
  minutos_cierre_antes: number;
  dias_activos: string[]; // ['lunes', 'martes', ...]
  estado: 'activo' | 'inactivo';
  abierto?: boolean;
  razon?: string | null;
  abre_a?: string | null;
}

// 💰 2. Modelos de Ventas e Idempotencia
export interface DetalleVenta {
  id?: number;
  venta_id?: number;
  numero: string;
  monto: number;
  estado_premio?: 'pendiente' | 'ganador' | 'perdedor' | 'pagado';
  monto_premio?: number;
  monto_premio_potencial?: number;
}

export interface Venta {
  id: number;
  empresa_id: number;
  usuario_id: number;
  punto_venta_id: number;
  juego_id: number;
  turno_id: number;
  fecha: string; // YYYY-MM-DD
  codigo_ticket: string; // UUID
  request_id: string; // UUID (Idempotencia)
  secuencia_venta: number; // <--- Nuevo: Número secuencial por empresa
  total: number;
  estado: 'activo' | 'anulado';
  created_at: string;

  // Relaciones opcionales (joins)
  punto_venta?: { nombre: string };
  usuario?: { nombre: string };
  detalles?: DetalleVenta[];
}

// 🎫 3. Estructura Enriquecida del Ticket (API v2.0)
export interface TicketData {
  header: {
    empresa: string;
    sucursal: string;
    vendedor: string;
    juego: string;
    turno: string;
    hora_sorteo: string;
    fecha_hora: string;
  };
  detalles: {
    numero: string;
    monto: number;
    premio: string; // Formateado como string para vista
  }[];
  footer: {
    total: number;
    codigo_ticket: string;
    qr_hash: string;
    mensaje: string;
  };
}

export interface RegistrarVentaResponse {
  success: boolean;
  data: {
    id: number;
    codigo_ticket: string;
    secuencia_venta: number; // <--- Nuevo
    qr_hash: string;
    ticket: TicketData;
  };
}

// 👤 4. Usuarios y Roles
export interface Usuario {
  id: number;
  empresa_id: number;
  punto_venta_id?: number;
  nombre: string;
  username: string;
  email: string;
  rol: 'admin' | 'vendedor';
  estado: 'activo' | 'inactivo';
}

export interface PuntoVenta {
  id: number;
  empresa_id: number;
  nombre: string;
  direccion?: string;
  estado: 'activo' | 'inactivo';
}

// 🛡️ 5. Módulo de Gestión de Límites
export interface LimiteNumero {
  id: number;
  empresa_id: number;
  juego_id: number;
  turno_id: number;
  punto_venta_id: number | null; // NULL = Global Empresa
  numero: string;
  monto_maximo: number;
  fecha: string | null; // YYYY-MM-DD
  created_at?: string;

  // Uniones/Relaciones
  juego?: { nombre: string };
  turno?: { nombre: string; hora_sorteo: string };
  punto_venta?: { nombre: string };
}

export interface LimiteVendedor {
  id: number;
  empresa_id: number;
  usuario_id: number;
  juego_id: number;
  turno_id: number;
  numero: string;
  monto_maximo: number;
  fecha: string | null;
  created_at?: string;

  // Uniones/Relaciones
  usuario?: { nombre: string; username: string };
  juego?: { nombre: string };
  turno?: { nombre: string; hora_sorteo: string };
}

// 🚫 6. Módulo de Bloqueos (Nuevo)
export interface Bloqueo {
  id: number;
  empresa_id: number;
  juego_id: number;
  turno_id: number;
  numero: string;
  Juego?: { nombre: string };
  Turno?: { nombre: string };
}

export interface CrearBloqueoPayload {
  juego_id: number;
  turno_id: number;
  numero: string;
}

// 📊 7. Resumen de Límites para Vendedor (Nuevo)
export interface ResumenItem {
  numero: string;
  monto_maximo: number;
  monto_vendido: number;
  disponible: number;
  estado: 'BLOQUEADO' | 'AGOTADO' | 'DISPONIBLE';
  tipo_limite: 'Global' | 'Sucursal' | 'Personal' | 'Bloqueo';
}

export interface ResumenLimitesVendedor {
  juego_id: number;
  turno_id: number;
  fecha: string;
  resumen: ResumenItem[];
}
