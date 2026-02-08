/**
 * 📝 Typography Tokens - FSW Donald's Design System
 * Extraído do Figma: https://www.figma.com/design/sJtDO8WNiDcehboerUdlRq/FSW-Donald%E2%80%99s
 */

export const typography = {
  // ==========================================
  // 🔤 FONT FAMILY
  // ==========================================
  fontFamily: {
    /** Fonte principal sans-serif */
    primary:
      "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    /** Fonte para números e preços */
    numeric: "'Inter', 'Roboto Mono', monospace",
  },

  // ==========================================
  // 📏 FONT SIZES
  // ==========================================
  fontSize: {
    /** 10px - Micro texto, badges */
    "2xs": "0.625rem",
    /** 12px - Legendas, captions */
    xs: "0.75rem",
    /** 14px - Corpo de texto padrão */
    sm: "0.875rem",
    /** 16px - Texto base, inputs */
    base: "1rem",
    /** 18px - Títulos de seção */
    lg: "1.125rem",
    /** 20px - Títulos de card */
    xl: "1.25rem",
    /** 24px - Títulos de página */
    "2xl": "1.5rem",
    /** 30px - Headlines */
    "3xl": "1.875rem",
    /** 36px - Display headlines */
    "4xl": "2.25rem",
  },

  // ==========================================
  // ⚖️ FONT WEIGHTS
  // ==========================================
  fontWeight: {
    /** 400 - Texto regular */
    regular: "400",
    /** 500 - Texto médio */
    medium: "500",
    /** 600 - Títulos de seção */
    semibold: "600",
    /** 700 - Títulos e preços */
    bold: "700",
  },

  // ==========================================
  // 📐 LINE HEIGHTS
  // ==========================================
  lineHeight: {
    /** Apertado - Headlines */
    tight: "1.1",
    /** Padrão - Títulos */
    normal: "1.25",
    /** Relaxado - Corpo de texto */
    relaxed: "1.5",
    /** Espaçado - Parágrafos longos */
    loose: "1.75",
  },

  // ==========================================
  // 🔡 LETTER SPACING
  // ==========================================
  letterSpacing: {
    /** Apertado - Headlines grandes */
    tighter: "-0.05em",
    /** Ligeiramente apertado */
    tight: "-0.025em",
    /** Normal */
    normal: "0",
    /** Relaxado - Uppercase labels */
    wide: "0.025em",
    /** Espaçado - All caps */
    wider: "0.05em",
  },
} as const;

// ==========================================
// 📋 TEXT PRESETS (Compostos)
// ==========================================
export const textPresets = {
  /** Título principal da página */
  pageTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },

  /** Título de seção */
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  /** Título de card/produto */
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  /** Corpo de texto padrão */
  body: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  /** Descrição de produto/ingredientes */
  description: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  /** Legenda/caption */
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  /** Preço em destaque */
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.normal,
    fontFamily: typography.fontFamily.numeric,
  },

  /** Preço pequeno */
  priceSmall: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    fontFamily: typography.fontFamily.numeric,
  },

  /** Label de botão */
  button: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },

  /** Label de categoria/tag */
  tag: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },
} as const;

// Type helpers
export type TypographyToken = typeof typography;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type TextPreset = keyof typeof textPresets;
