/**
 * ⚡ Animation Tokens - FSW Donald's Design System
 * Transições e animações para uma experiência fluida
 */

export const animations = {
  // ==========================================
  // ⏱️ DURATION
  // ==========================================
  duration: {
    /** 75ms - Instantâneo (hover states) */
    instant: "75ms",
    /** 150ms - Rápido (micro-interações) */
    fast: "150ms",
    /** 200ms - Padrão (transições de cor) */
    normal: "200ms",
    /** 300ms - Médio (transições de layout) */
    medium: "300ms",
    /** 500ms - Lento (animações de entrada) */
    slow: "500ms",
    /** 700ms - Muito lento (animações de page transition) */
    slower: "700ms",
  },

  // ==========================================
  // 📈 EASING
  // ==========================================
  easing: {
    /** Linear - Progresso constante */
    linear: "linear",
    /** Ease in - Começo lento */
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    /** Ease out - Final lento */
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    /** Ease in out - Suave nas pontas */
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    /** Spring - Efeito de mola */
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    /** Bounce - Efeito de quique */
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

// ==========================================
// 🎭 TRANSITION PRESETS
// ==========================================
export const transitions = {
  /** Transição padrão para cores e backgrounds */
  color: `color ${animations.duration.normal} ${animations.easing.easeOut}, background-color ${animations.duration.normal} ${animations.easing.easeOut}`,

  /** Transição para transformações (scale, translate) */
  transform: `transform ${animations.duration.medium} ${animations.easing.easeOut}`,

  /** Transição para opacidade (fade) */
  opacity: `opacity ${animations.duration.normal} ${animations.easing.easeOut}`,

  /** Transição para sombras */
  shadow: `box-shadow ${animations.duration.medium} ${animations.easing.easeOut}`,

  /** Transição completa para botões */
  button: `all ${animations.duration.normal} ${animations.easing.easeOut}`,

  /** Transição para cards (hover effect) */
  card: `transform ${animations.duration.medium} ${animations.easing.spring}, box-shadow ${animations.duration.medium} ${animations.easing.easeOut}`,

  /** Transição para modais */
  modal: `opacity ${animations.duration.medium} ${animations.easing.easeOut}, transform ${animations.duration.medium} ${animations.easing.spring}`,

  /** Transição para drawer/sheet */
  sheet: `transform ${animations.duration.slow} ${animations.easing.spring}`,
} as const;

// ==========================================
// 🎬 KEYFRAME ANIMATIONS (CSS)
// ==========================================
export const keyframes = {
  /** Fade in */
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,

  /** Fade out */
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,

  /** Slide up (para modais) */
  slideUp: `
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `,

  /** Slide down */
  slideDown: `
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
  `,

  /** Scale in (para popups) */
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,

  /** Bounce (para sucesso) */
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,

  /** Pulse (para loading) */
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,

  /** Shake (para erro) */
  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,

  /** Spin (para loading) */
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
} as const;

// Type helpers
export type Duration = keyof typeof animations.duration;
export type Easing = keyof typeof animations.easing;
export type Transition = keyof typeof transitions;
