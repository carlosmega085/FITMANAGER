// 🎨 Sistema de Diseño — FitManager App
// Paleta Dark Mode Premium

export const colors = {
  // Fondos
  background: '#0D1117',
  card: '#161B22',
  cardHover: '#1C2128',

  // Marca
  primary: '#10B981',       // Verde Esmeralda (FitManager)
  primaryDark: '#059669',
  accent: '#34D399',        // Verde Claro

  // Texto
  text: '#E6EDF3',
  subtext: '#8B949E',
  textInverse: '#0D1117',

  // Estado
  error: '#FF4D4D',
  errorBg: '#3D1515',
  success: '#22C55E',
  successBg: '#0F2D1A',
  warning: '#F59E0B',
  warningBg: '#2D1F07',

  // Bordes y separadores
  border: '#30363D',
  borderLight: '#21262D',

  // Transparencias
  overlay: 'rgba(0,0,0,0.7)',
  cardTransparent: 'rgba(22, 27, 34, 0.85)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 8,
};
