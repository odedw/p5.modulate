// Easing function constants
export const EASE_LINEAR = 'ease_linear';
export const EASE_IN_QUAD = 'ease_in_quad';
export const EASE_OUT_QUAD = 'ease_out_quad';
export const EASE_IN_OUT_QUAD = 'ease_in_out_quad';
export const EASE_IN_CUBIC = 'ease_in_cubic';
export const EASE_OUT_CUBIC = 'ease_out_cubic';
export const EASE_IN_OUT_CUBIC = 'ease_in_out_cubic';

export type EasingType =
  | typeof EASE_LINEAR
  | typeof EASE_IN_QUAD
  | typeof EASE_OUT_QUAD
  | typeof EASE_IN_OUT_QUAD
  | typeof EASE_IN_CUBIC
  | typeof EASE_OUT_CUBIC
  | typeof EASE_IN_OUT_CUBIC;

export const easeInQuad = (x: number): number => x * x;
export const easeOutQuad = (x: number): number => 1 - (1 - x) * (1 - x);
export const easeInOutQuad = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2);
export const easeInCubic = (x: number): number => x * x * x;
export const easeOutCubic = (x: number): number => 1 - pow(1 - x, 3);
export const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2);

export const easingFunctions: Record<EasingType, (x: number) => number> = {
  [EASE_LINEAR]: (x) => x,
  [EASE_IN_QUAD]: easeInQuad,
  [EASE_OUT_QUAD]: easeOutQuad,
  [EASE_IN_OUT_QUAD]: easeInOutQuad,
  [EASE_IN_CUBIC]: easeInCubic,
  [EASE_OUT_CUBIC]: easeOutCubic,
  [EASE_IN_OUT_CUBIC]: easeInOutCubic,
};
