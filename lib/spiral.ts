/**
 * Geometry of the project coil. Shared by the DOM layer (SpiralWork, which
 * positions the entries) and the WebGL layer (Spiral, whose particle coil turns
 * in step with them) so the two can never drift apart.
 */

/** Radians between consecutive projects around the coil. */
export const STEP_ANGLE = 0.78;

/**
 * How much of the orbit angle an entry actually turns by. Entries are damped
 * well short of 90deg on purpose: at a right angle an entry is edge-on, and
 * past it `backface-visibility: hidden` culls it — which would leave only the
 * focal project visible.
 */
export const FACING = 0.5;

/** Vertical rise between consecutive projects, in px. */
export const STEP_Y = 250;

/**
 * How far an entry sits from the coil's axis, in px.
 *
 * The narrow value is small on purpose: on a 375px screen a wide orbit threw
 * entries roughly 90px past both edges and clipped the project names. On phones
 * the coil reads through depth and vertical travel instead of lateral swing.
 */
export const RADIUS_WIDE = 490;
export const RADIUS_NARROW = 74;

/** An entry fades out once it is this far, in project-steps, from the front. */
export const FALLOFF = 2.0;

/** Total rotation of the coil across the whole section, in radians. */
export const totalTurn = (count: number) => STEP_ANGLE * Math.max(count - 1, 0);
