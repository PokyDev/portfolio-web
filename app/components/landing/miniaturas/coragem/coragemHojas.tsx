import animacion from "./coragemAnimacion.module.css";

// Fondo de ramas con hojas para el hover de CoragemMiniatura — adaptado de
// la referencia que aportó el usuario (background_example.tsx, misma
// carpeta): mismo algoritmo de tallo en curva bezier con hojas brotando
// alternadas a lo largo, recalibrado a un viewBox horizontal (la miniatura
// es 16:9 / 16:10, la referencia original era vertical) y a la paleta de
// marca de Coragem (teal/rosa del glow del ícono) en vez del marrón/beige
// genérico del ejemplo. Sin hooks: la generación es determinística (RNG
// sembrado), así que corre como Server Component igual que el resto de la
// miniatura, sin sumar JS al cliente.

interface HojaPlacement {
  x: number;
  y: number;
  angle: number;
  size: number;
  delay: number;
}

interface Rama {
  tallo: string;
  color: string;
  talloDelay: number;
  hojas: HojaPlacement[];
}

function generarRama(opts: {
  startX: number;
  startY: number;
  angleDeg: number;
  length: number;
  wobble: number;
  leafCount: number;
  leafSize: number;
  leafSizeFalloff: number;
  leafSpread: number;
  seed: number;
  color: string;
  delayStepMs: number;
}): Rama {
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
    color,
    delayStepMs,
  } = opts;

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const rng = (n: number) => {
    const x = Math.sin(seed * 999 + n * 57.13) * 10000;
    return x - Math.floor(x);
  };

  const dir = rad(angleDeg);
  const endX = startX + Math.cos(dir) * length;
  const endY = startY + Math.sin(dir) * length;

  const perpX = -Math.sin(dir);
  const perpY = Math.cos(dir);
  const c1x = startX + Math.cos(dir) * length * 0.33 + perpX * wobble;
  const c1y = startY + Math.sin(dir) * length * 0.33 + perpY * wobble;
  const c2x = startX + Math.cos(dir) * length * 0.66 - perpX * wobble * 0.6;
  const c2y = startY + Math.sin(dir) * length * 0.66 - perpY * wobble * 0.6;

  const tallo = `M ${startX.toFixed(2)},${startY.toFixed(2)} C ${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${endX.toFixed(2)},${endY.toFixed(2)}`;

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

  const hojas: HojaPlacement[] = [];
  for (let i = 0; i < leafCount; i++) {
    const t = 0.12 + (i / (leafCount - 1)) * 0.82;
    const { x, y } = bezierPoint(t);
    const tangent = bezierTangentAngle(t);
    const side = i % 2 === 0 ? 1 : -1;
    const jitter = (rng(i) - 0.5) * 10;
    const angle = tangent + side * (leafSpread + jitter);
    const falloff = 1 - leafSizeFalloff * t;
    const size = leafSize * falloff * (0.9 + rng(i + 50) * 0.2);
    // El tallo entra primero (delay 0); las hojas brotan después, en orden,
    // dando la impresión de aparición parte por parte a lo largo de la rama.
    hojas.push({ x, y, angle, size, delay: (i + 1) * delayStepMs });
  }

  return { tallo, color, talloDelay: 0, hojas };
}

/** Una hoja apuntada y ligeramente asimétrica, dibujada con la punta hacia "arriba" en el origen. */
function HojaSvg({ hoja }: { hoja: HojaPlacement }) {
  const w = hoja.size * 0.34;
  const h = hoja.size;
  const d = `M 0,0 C ${-w},${-h * 0.32} ${-w * 0.6},${-h * 0.78} 0,${-h} C ${w * 0.6},${-h * 0.78} ${w},${-h * 0.32} 0,0 Z`;
  return (
    <path
      className={animacion.hoja}
      d={d}
      transform={`translate(${hoja.x.toFixed(2)}, ${hoja.y.toFixed(2)}) rotate(${(hoja.angle + 90).toFixed(2)})`}
      style={{ "--stagger-delay": `${hoja.delay}ms` } as React.CSSProperties}
    />
  );
}

const RAMAS: Rama[] = [
  generarRama({
    startX: 30,
    startY: 205,
    angleDeg: -38,
    length: 300,
    wobble: 22,
    leafCount: 7,
    leafSize: 24,
    leafSizeFalloff: 0.5,
    leafSpread: 30,
    seed: 1,
    color: "#4ec4c4",
    delayStepMs: 70,
  }),
  generarRama({
    startX: 372,
    startY: 18,
    angleDeg: 142,
    length: 280,
    wobble: 20,
    leafCount: 6,
    leafSize: 20,
    leafSizeFalloff: 0.5,
    leafSpread: 28,
    seed: 2,
    color: "#c47a9e",
    delayStepMs: 70,
  }),
];

export default function CoragemHojas() {
  return (
    <div className={animacion.fondoHojas} aria-hidden="true">
      <svg
        viewBox="0 0 400 225"
        preserveAspectRatio="xMidYMid slice"
        className={animacion.ramaSvg}
      >
        {RAMAS.map((rama, ri) => (
          <g key={ri} fill={rama.color} stroke={rama.color}>
            <path
              className={animacion.tallo}
              d={rama.tallo}
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ "--stagger-delay": `${rama.talloDelay}ms` } as React.CSSProperties}
            />
            {rama.hojas.map((hoja, hi) => (
              <HojaSvg key={hi} hoja={hoja} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
