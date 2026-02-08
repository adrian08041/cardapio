/**
 * 🎨 Color Tokens - FSW Donald's Design System
 * Extraído do Figma: https://www.figma.com/design/sJtDO8WNiDcehboerUdlRq/FSW-Donald%E2%80%99s
 */

export const colors = {
  // ==========================================
  // 🔴 PRIMARY COLORS
  // ==========================================
  primary: {
    /** Vermelho icônico - Logo, ícones de destaque, status de erro */
    red: "#D90007",
    /** Vermelho escuro para hover states */
    redDark: "#B30006",
    /** Vermelho claro para backgrounds sutis */
    redLight: "#FFE5E6",
  },

  // ==========================================
  // 🟡 ACCENT COLORS
  // ==========================================
  accent: {
    /** Amarelo dourado - Botões de ação, categorias, destaques */
    yellow: "#FFC72C",
    /** Amarelo escuro para hover states */
    yellowDark: "#E6B326",
    /** Amarelo claro para backgrounds */
    yellowLight: "#FFF4D6",
  },

  // ==========================================
  // ⬜ BACKGROUND COLORS
  // ==========================================
  background: {
    /** Fundo principal do app */
    primary: "#FFFFFF",
    /** Fundo secundário para seções alternadas */
    secondary: "#F4F4F4",
    /** Fundo terciário ainda mais claro */
    tertiary: "#F9F9F9",
  },

  // ==========================================
  // 📦 SURFACE COLORS (Cards, Modals)
  // ==========================================
  surface: {
    /** Cards e containers */
    card: "#FFFFFF",
    /** Modais e overlays */
    modal: "#FFFFFF",
    /** Bottom sheets */
    sheet: "#FFFFFF",
  },

  // ==========================================
  // 📝 TEXT COLORS
  // ==========================================
  text: {
    /** Texto principal - Títulos e preços */
    primary: "#000000",
    /** Texto secundário - Descrições e ingredientes */
    secondary: "#707070",
    /** Texto terciário - Legendas e metadados */
    tertiary: "#9E9E9E",
    /** Texto sobre fundos coloridos (vermelho/amarelo) */
    onColor: "#FFFFFF",
    /** Texto de preço em destaque */
    price: "#000000",
    /** Texto de preço promocional */
    pricePromo: "#D90007",
  },

  // ==========================================
  // 🔲 BORDER & DIVIDER COLORS
  // ==========================================
  border: {
    /** Borda padrão para inputs e cards */
    default: "#EEEEEE",
    /** Borda de foco para inputs */
    focus: "#FFC72C",
    /** Divisor horizontal entre seções */
    divider: "#EEEEEE",
  },

  // ==========================================
  // ✅ SEMANTIC COLORS (Status)
  // ==========================================
  semantic: {
    /** Sucesso - Pedido confirmado */
    success: "#22C55E",
    successLight: "#DCFCE7",
    /** Aviso - Pedido em preparo */
    warning: "#FFC72C",
    warningLight: "#FEF9C3",
    /** Erro - Falha no pedido */
    error: "#D90007",
    errorLight: "#FFE5E6",
    /** Informação - Dicas e notas */
    info: "#3B82F6",
    infoLight: "#DBEAFE",
  },

  // ==========================================
  // 🎭 OVERLAY COLORS
  // ==========================================
  overlay: {
    /** Overlay de modais (80% opacidade) */
    modal: "rgba(0, 0, 0, 0.80)",
    /** Overlay de imagens (gradiente) */
    image: "rgba(0, 0, 0, 0.40)",
  },
} as const;

// Type helpers
export type ColorToken = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type AccentColor = keyof typeof colors.accent;
export type TextColor = keyof typeof colors.text;
