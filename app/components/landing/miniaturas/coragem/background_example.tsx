import React, { useMemo } from "react";

/**
 * LeafBranchBackground
 * ---------------------
 * A decorative background made of hand-drawn, leafy branch silhouettes —
 * inspired by soft shadow-play reference imagery (a leafy branch cast
 * diagonally across a wall). Rendered as a single flat color at low
 * opacity so it reads as an ambient texture, never competing with
 * foreground content.
 *
 * Usage:
 *   <div className="relative min-h-screen">
 *     <LeafBranchBackground />
 *     <div className="relative z-10">... your content ...</div>
 *   </div>
 */

interface LeafBranchBackgroundProps {
  /** Silhouette color for the branches/leaves. */
  color?: string;
  /** Opacity of the silhouette layer (0–1). */
  opacity?: number;
  /** Backing color behind the pattern. Set to "transparent" to disable. */
  backgroundColor?: string;
  /** Extra className applied to the outer wrapper. */
  className?: string;
}

interface LeafPlacement {
  x: number;
  y: number;
  angle: number; // degrees, direction the leaf tip points
  size: number;
}

interface Branch {
  stemPath: string;
  leaves: LeafPlacement[];
}

/**
 * Builds one wavy branch as a cubic-bezier stem with leaves sprouting
 * alternately along its length, shrinking gently toward the tip — the
 * same rhythm you see in the reference photo.
 */
function generateBranch(opts: {
  startX: number;
  startY: number;
  angleDeg: number; // overall growth direction
  length: number;
  wobble: number; // how much the stem curves side to side
  leafCount: number;
  leafSize: number;
  leafSizeFalloff: number; // 0..1, how much smaller leaves get near the tip
  leafSpread: number; // degrees leaves fan away from the stem
  seed: number;
}): Branch {
  const {
    startX,
    startY,
    angleDeg,
    length,
    wobble,
    leafCount,
    leafSize,
    leafSizeFalloff,
    leafSpread,
    seed,
  } = opts;

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const rng = (n: number) => {
    // deterministic pseudo-random so the layout is stable across renders
    const x = Math.sin(seed * 999 + n * 57.13) * 10000;
    return x - Math.floor(x);
  };

  const dir = rad(angleDeg);
  const endX = startX + Math.cos(dir) * length;
  const endY = startY + Math.sin(dir) * length;

  // two control points offset perpendicular to the main direction to
  // create a single gentle S-curve along the stem
  const perpX = -Math.sin(dir);
  const perpY = Math.cos(dir);
  const c1x = startX + Math.cos(dir) * length * 0.33 + perpX * wobble;
  const c1y = startY + Math.sin(dir) * length * 0.33 + perpY * wobble;
  const c2x = startX + Math.cos(dir) * length * 0.66 - perpX * wobble * 0.6;
  const c2y = startY + Math.sin(dir) * length * 0.66 - perpY * wobble * 0.6;

  const stemPath = `M ${startX.toFixed(2)},${startY.toFixed(2)} C ${c1x.toFixed(
    2
  )},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${endX.toFixed(
    2
  )},${endY.toFixed(2)}`;

  // cubic bezier point + tangent helpers
  const bezierPoint = (t: number) => {
    const mt = 1 - t;
    const x =
      mt * mt * mt * startX +
      3 * mt * mt * t * c1x +
      3 * mt * t * t * c2x +
      t * t * t * endX;
    const y =
      mt * mt * mt * startY +
      3 * mt * mt * t * c1y +
      3 * mt * t * t * c2y +
      t * t * t * endY;
    return { x, y };
  };
  const bezierTangentAngle = (t: number) => {
    const mt = 1 - t;
    const dx =
      3 * mt * mt * (c1x - startX) +
      6 * mt * t * (c2x - c1x) +
      3 * t * t * (endX - c2x);
    const dy =
      3 * mt * mt * (c1y - startY) +
      6 * mt * t * (c2y - c1y) +
      3 * t * t * (endY - c2y);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const leaves: LeafPlacement[] = [];
  for (let i = 0; i < leafCount; i++) {
    // start leaves a little way up the stem, skip the very tip
    const t = 0.12 + (i / (leafCount - 1)) * 0.82;
    const { x, y } = bezierPoint(t);
    const tangent = bezierTangentAngle(t);
    const side = i % 2 === 0 ? 1 : -1;
    const jitter = (rng(i) - 0.5) * 10;
    const angle = tangent + side * (leafSpread + jitter);
    const falloff = 1 - leafSizeFalloff * t;
    const size = leafSize * falloff * (0.9 + rng(i + 50) * 0.2);
    leaves.push({ x, y, angle, size });
  }

  return { stemPath, leaves };
}

/** A single pointed, slightly asymmetric leaf, drawn tip-up at the origin. */
function LeafShape({
  size,
  x,
  y,
  angle,
}: {
  size: number;
  x: number;
  y: number;
  angle: number;
}) {
  const w = size * 0.34;
  const h = size;
  const d = `M 0,0 C ${-w},${-h * 0.32} ${-w * 0.6},${-h * 0.78} 0,${-h} C ${
    w * 0.6
  },${-h * 0.78} ${w},${-h * 0.32} 0,0 Z`;
  return (
    <path
      d={d}
      transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${(
        angle + 90
      ).toFixed(2)})`}
    />
  );
}

export default function LeafBranchBackground({
  color = "#8A7A5C",
  opacity = 0.16,
  backgroundColor = "#F3EEE3",
  className = "",
}: LeafBranchBackgroundProps) {
  const branches = useMemo<Branch[]>(() => {
    return [
      generateBranch({
        startX: 60,
        startY: 1250,
        angleDeg: -58,
        length: 780,
        wobble: 90,
        leafCount: 15,
        leafSize: 78,
        leafSizeFalloff: 0.55,
        leafSpread: 34,
        seed: 1,
      }),
      generateBranch({
        startX: 260,
        startY: 1500,
        angleDeg: -66,
        length: 950,
        wobble: 120,
        leafCount: 18,
        leafSize: 92,
        leafSizeFalloff: 0.5,
        leafSpread: 32,
        seed: 2,
      }),
      generateBranch({
        startX: 520,
        startY: 1550,
        angleDeg: -72,
        length: 700,
        wobble: 70,
        leafCount: 12,
        leafSize: 60,
        leafSizeFalloff: 0.5,
        leafSpread: 30,
        seed: 3,
      }),
    ];
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 1600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill={color} opacity={opacity}>
          {branches.map((branch, bi) => (
            <g key={bi}>
              <path
                d={branch.stemPath}
                fill="none"
                stroke={color}
                strokeWidth={5}
                strokeLinecap="round"
              />
              {branch.leaves.map((leaf, li) => (
                <LeafShape
                  key={li}
                  x={leaf.x}
                  y={leaf.y}
                  angle={leaf.angle}
                  size={leaf.size}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}