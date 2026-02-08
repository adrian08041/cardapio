/**
 * 📏 Spacing Tokens - FSW Donald's Design System
 * Extraído do Figma: https://www.figma.com/design/sJtDO8WNiDcehboerUdlRq/FSW-Donald%E2%80%99s
 */

export const spacing = {
  // ==========================================
  // 📐 BASE SPACING SCALE
  // ==========================================
  /** 0px */
  none: "0",
  /** 2px - Micro espaçamento */
  "2xs": "0.125rem",
  /** 4px - Espaçamento mínimo */
  xs: "0.25rem",
  /** 8px - Espaçamento pequeno */
  sm: "0.5rem",
  /** 12px - Espaçamento médio-pequeno */
  md: "0.75rem",
  /** 16px - Espaçamento padrão (horizontal padding) */
  lg: "1rem",
  /** 20px - Espaçamento médio-grande */
  xl: "1.25rem",
  /** 24px - Espaçamento grande (entre seções) */
  "2xl": "1.5rem",
  /** 32px - Espaçamento extra grande */
  "3xl": "2rem",
  /** 40px - Espaçamento jumbo */
  "4xl": "2.5rem",
  /** 48px - Espaçamento máximo */
  "5xl": "3rem",
  /** 64px - Seções maiores */
  "6xl": "4rem",
} as const;

// ==========================================
// 📱 LAYOUT SPACING
// ==========================================
export const layout = {
  /** Padding horizontal padrão do app (16px) */
  containerPadding: spacing.lg,
  /** Padding horizontal maior para tablets */
  containerPaddingLg: spacing["2xl"],
  /** Gap entre cards na grid */
  cardGap: spacing.md,
  /** Gap entre seções */
  sectionGap: spacing["2xl"],
  /** Margem do header */
  headerMargin: spacing.lg,
  /** Padding interno de cards */
  cardPadding: spacing.md,
  /** Padding interno de modais */
  modalPadding: spacing.lg,
  /** Altura mínima de touch target (44px) */
  touchTarget: "2.75rem",
  /** Altura do bottom navigation */
  bottomNavHeight: "4rem",
} as const;

// ==========================================
// 🔲 BORDER RADIUS
// ==========================================
export const borderRadius = {
  /** 0px - Sem arredondamento */
  none: "0",
  /** 4px - Arredondamento sutil */
  sm: "0.25rem",
  /** 8px - Arredondamento padrão (inputs) */
  md: "0.5rem",
  /** 12px - Arredondamento médio (cards) */
  lg: "0.75rem",
  /** 16px - Arredondamento grande */
  xl: "1rem",
  /** 20px - Arredondamento extra (modais, sheets) */
  "2xl": "1.25rem",
  /** 24px - Arredondamento jumbo */
  "3xl": "1.5rem",
  /** 9999px - Totalmente arredondado (pills, avatars) */
  full: "9999px",
} as const;

// ==========================================
// 🌊 SHADOWS
// ==========================================
export const shadows = {
  /** Sem sombra */
  none: "none",
  /** Sombra sutil para cards */
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  /** Sombra padrão para cards de produto */
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  /** Sombra elevada para modais */
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  /** Sombra máxima para bottom sheets */
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  /** Sombra para elementos elevados */
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  /** Sombra customizada do Figma (cards de produto) */
  card: "0 4px 10px rgba(0, 0, 0, 0.05)",
  /** Sombra para bottom sheet */
  sheet: "0 -4px 20px rgba(0, 0, 0, 0.15)",
} as const;

// ==========================================
// 📱 BREAKPOINTS
// ==========================================
export const breakpoints = {
  /** Mobile pequeno (320px) */
  xs: "320px",
  /** Mobile padrão (375px) */
  sm: "375px",
  /** Mobile grande (425px) */
  md: "425px",
  /** Tablet (768px) */
  lg: "768px",
  /** Desktop (1024px) */
  xl: "1024px",
  /** Desktop grande (1280px) */
  "2xl": "1280px",
} as const;

// ==========================================
// ⏱️ Z-INDEX
// ==========================================
export const zIndex = {
  /** Elementos base */
  base: "0",
  /** Elementos elevados (cards hover) */
  elevated: "10",
  /** Header fixo */
  header: "100",
  /** Dropdown/Popover */
  dropdown: "200",
  /** Overlay de modal */
  overlay: "300",
  /** Modal content */
  modal: "400",
  /** Toast notifications */
  toast: "500",
  /** Tooltip */
  tooltip: "600",
} as const;

// Type helpers
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;
