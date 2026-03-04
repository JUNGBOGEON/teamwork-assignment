import type { ImageTransform } from '@/types';

/**
 * A computed 2D affine transform ready for CSS application.
 * Applied as: translate(tx, ty) rotate(rotation) scale(scale)
 */
export interface CSSTransform2D {
  tx: number;
  ty: number;
  scale: number;
  rotation: number;
}

export const IDENTITY_TRANSFORM: CSSTransform2D = {
  tx: 0,
  ty: 0,
  scale: 1,
  rotation: 0,
};

/**
 * Compute the relative CSS transform to align an overlay image
 * on top of a base image, given their respective ImageTransforms.
 *
 * Math: T_relative = T_base^(-1) * T_overlay
 *
 * For the common rotation=0 case this simplifies to:
 *   dx = (xOverlay - xBase) / scaleBase
 *   dy = (yOverlay - yBase) / scaleBase
 *   relativeScale = scaleOverlay / scaleBase
 */
export function computeRelativeTransform(
  base: ImageTransform,
  overlay: ImageTransform,
): CSSTransform2D {
  if (base.scale === 0) return IDENTITY_TRANSFORM;

  if (
    base.x === overlay.x &&
    base.y === overlay.y &&
    base.scale === overlay.scale &&
    base.rotation === overlay.rotation
  ) {
    return IDENTITY_TRANSFORM;
  }

  const relativeScale = overlay.scale / base.scale;
  const relativeRotation = overlay.rotation - base.rotation;

  const dx = overlay.x - base.x;
  const dy = overlay.y - base.y;

  // Apply inverse rotation of base to the translation vector
  const cosBase = Math.cos(-base.rotation);
  const sinBase = Math.sin(-base.rotation);
  const rotatedDx = (dx * cosBase - dy * sinBase) / base.scale;
  const rotatedDy = (dx * sinBase + dy * cosBase) / base.scale;

  return {
    tx: rotatedDx,
    ty: rotatedDy,
    scale: relativeScale,
    rotation: (relativeRotation * 180) / Math.PI,
  };
}

/**
 * Serialize a CSSTransform2D to a CSS transform string.
 * Assumes transform-origin: center center.
 */
export function toCSSTransformString(t: CSSTransform2D): string {
  const parts: string[] = [];

  if (t.tx !== 0 || t.ty !== 0) {
    parts.push(`translate(${t.tx}px, ${t.ty}px)`);
  }
  if (t.rotation !== 0) {
    parts.push(`rotate(${t.rotation}deg)`);
  }
  if (t.scale !== 1) {
    parts.push(`scale(${t.scale})`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}
