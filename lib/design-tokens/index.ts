/**
 * 🎨 FSW Donald's Design System - Design Tokens
 *
 * Este arquivo exporta todos os tokens de design extraídos do Figma.
 *
 * @see https://www.figma.com/design/sJtDO8WNiDcehboerUdlRq/FSW-Donald%E2%80%99s
 *
 * === USO ===
 *
 * import { colors, typography, spacing, animations, theme } from '@/lib/design-tokens';
 *
 * // Usar cores
 * <div style={{ backgroundColor: colors.primary.red }}>...</div>
 *
 * // Usar tipografia
 * <h1 style={{ fontSize: typography.fontSize['2xl'] }}>...</h1>
 *
 * // Usar espaçamento
 * <div style={{ padding: spacing.lg }}>...</div>
 *
 * // Usar tema completo
 * <div style={{ color: theme.colors.text.primary }}>...</div>
 */

// Importar todos os tokens
export { colors } from "./colors";
export type {
  ColorToken,
  PrimaryColor,
  AccentColor,
  TextColor,
} from "./colors";

export { typography, textPresets } from "./typography";
export type {
  TypographyToken,
  FontSize,
  FontWeight,
  TextPreset,
} from "./typography";

export {
  spacing,
  layout,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
} from "./spacing";
export type {
  Spacing,
  BorderRadius,
  Shadow,
  Breakpoint,
  ZIndex,
} from "./spacing";

export { animations, transitions, keyframes } from "./animations";
export type { Duration, Easing, Transition } from "./animations";

// Re-exportar como tema unificado
import { colors } from "./colors";
import { typography, textPresets } from "./typography";
import {
  spacing,
  layout,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
} from "./spacing";
import { animations, transitions, keyframes } from "./animations";

/**
 * 🎨 Tema unificado com todos os tokens
 *
 * Use isso para acessar todos os tokens de uma vez ou para integrar
 * com bibliotecas de styling como styled-components, emotion, etc.
 */
export const theme = {
  colors,
  typography,
  textPresets,
  spacing,
  layout,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  animations,
  transitions,
  keyframes,
} as const;

export type Theme = typeof theme;

/**
 * 🎯 CSS Variables Generator
 *
 * Gera variáveis CSS a partir dos tokens para uso global.
 * Adicione ao seu layout.tsx ou globals.css:
 *
 * :root {
 *   --color-primary-red: #D90007;
 *   --color-primary-yellow: #FFC72C;
 *   ...
 * }
 */
export const generateCSSVariables = (): string => {
  const vars: string[] = [];

  // Cores primárias
  Object.entries(colors.primary).forEach(([key, value]) => {
    vars.push(`--color-primary-${key}: ${value};`);
  });

  // Cores de destaque
  Object.entries(colors.accent).forEach(([key, value]) => {
    vars.push(`--color-accent-${key}: ${value};`);
  });

  // Cores de fundo
  Object.entries(colors.background).forEach(([key, value]) => {
    vars.push(`--color-bg-${key}: ${value};`);
  });

  // Cores de texto
  Object.entries(colors.text).forEach(([key, value]) => {
    vars.push(`--color-text-${key}: ${value};`);
  });

  // Cores semânticas
  Object.entries(colors.semantic).forEach(([key, value]) => {
    vars.push(`--color-${key}: ${value};`);
  });

  // Espaçamentos
  Object.entries(spacing).forEach(([key, value]) => {
    vars.push(`--spacing-${key}: ${value};`);
  });

  // Border radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    vars.push(`--radius-${key}: ${value};`);
  });

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    vars.push(`--shadow-${key}: ${value};`);
  });

  // Tipografia
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    vars.push(`--font-size-${key}: ${value};`);
  });

  return vars.join("\n  ");
};

export default theme;
