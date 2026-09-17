import { useState, useId } from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  color?: string;
  width?: number;
  height?: number;
  currencySymbol?: string;
  currencyMultiplier?: number;
  baselinePrice?: number;
  symbol?: string;
  timeframeLabel?: string;
  showMinMax?: boolean;
}

/**
 * Calculates a smooth Catmull-Rom spline converted to cubic Béziers
 * for clean, organic financial price curve rendering without distortion.
 */
function getSmoothSvgPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)},${points[1].y.toFixed(2)}`;
  }

  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

export function Sparkline({
  data,
  isPositive,
  color,
  width = 280,
  height = 62,
  currencySymbol = '$',
  currencyMultiplier = 1,
  baselinePrice,
  symbol = '',
  timeframeLabel = '1G',
  showMinMax = true,
}: SparklineProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const reactId = useId().replace(/:/g, '');
  const gradientId = `sparkline-grad-${symbol || 'sym'}-${reactId}`;

  if (!data || data.length < 2) {
    return (
      <div className="w-full h-14 flex items-center justify-center text-xs text-slate-400 font-mono">
        Grafik verisi yükleniyor...
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const paddingY = 8;
  const effectiveHeight = height - paddingY * 2;

  // Calculate coordinates for all data points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * effectiveHeight;
    return { x, y, val };
  });

  const smoothPathD = getSmoothSvgPath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  // Closed area polygon for smooth gradient fill
  const areaD = `${smoothPathD} L ${lastPoint.x.toFixed(2)},${height} L ${firstPoint.x.toFixed(2)},${height} Z`;

  // Determine stroke color: green for positive performance, rose for negative
  const strokeColor = color || (isPositive ? '#16a34a' : '#e11d48');

  // Calculate baseline Y coordinate if baselinePrice is provided
  let baselineY: number | null = null;
  if (typeof baselinePrice === 'number' && !isNaN(baselinePrice)) {
    const bY = height - paddingY - ((baselinePrice - min) / range) * effectiveHeight;
    if (bY >= 0 && bY <= height) {
      baselineY = bY;
    }
  }

  const activePoint = hoverIndex !== null && hoverIndex < points.length ? points[hoverIndex] : null;

  // Calculate relative change for hovered point
  const referenceVal = baselinePrice ?? firstPoint.val;
  const hoverChangePercent = activePoint
    ? ((activePoint.val - referenceVal) / referenceVal) * 100
    : 0;

  const formatPrice = (val: number) => {
    return (val * currencyMultiplier).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      className="relative w-full select-none cursor-crosshair group/chart"
      onMouseLeave={() => setHoverIndex(null)}
    >
      {/* Min / Max Range Indicators */}
      {showMinMax && (
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-num mb-1 px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Min: {currencySymbol}{formatPrice(min)}
          </span>
          <span className="flex items-center gap-1">
            Maks: {currencySymbol}{formatPrice(max)}
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </span>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-14 overflow-visible block"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
          const index = Math.round(ratio * (data.length - 1));
          setHoverIndex(index);
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.24} />
            <stop offset="70%" stopColor={strokeColor} stopOpacity={0.06} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Baseline (Önceki Kapanış Referansı) */}
        {baselineY !== null && (
          <line
            x1={0}
            y1={baselineY}
            x2={width}
            y2={baselineY}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="3 3"
            strokeOpacity="0.65"
          />
        )}

        {/* Area fill under curve */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Primary smooth sparkline curve */}
        <path
          d={smoothPathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Live trading beacon pulse at latest price point (rightmost) */}
        {!activePoint && (
          <g>
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="6"
              fill={strokeColor}
              className="animate-ping opacity-40 origin-center"
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="3.5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Interactive scrubber cursor and active point */}
        {activePoint && (
          <g>
            {/* Vertical crosshair line */}
            <line
              x1={activePoint.x}
              y1={0}
              x2={activePoint.x}
              y2={height}
              stroke="#64748b"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              strokeOpacity="0.7"
            />
            {/* Active highlight dot */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="4.5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="2.5"
              className="drop-shadow-sm"
            />
          </g>
        )}
      </svg>

      {/* Floating Price & Performance Tooltip on hover */}
      {activePoint && (
        <div
          className="absolute -top-7 transform -translate-x-1/2 pointer-events-none z-30 bg-slate-950/95 text-white text-[11px] font-mono-num px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 flex items-center gap-1.5 whitespace-nowrap"
          style={{
            left: `${Math.max(15, Math.min(85, (activePoint.x / width) * 100))}%`,
          }}
        >
          <span className="font-bold">
            {currencySymbol}{formatPrice(activePoint.val)}
          </span>
          <span
            className={`text-[10px] font-black ${
              hoverChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {hoverChangePercent >= 0 ? '+' : ''}
            {hoverChangePercent.toFixed(2)}%
          </span>
          <span className="text-[9px] text-slate-400 border-l border-slate-700 pl-1.5 font-sans">
            {timeframeLabel}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Ultra-lightweight micro sparkline for ticker ribbons and compact indicators
 */
export function MiniSparkline({
  data,
  isPositive,
  width = 36,
  height = 14,
}: {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => ({
    x: (idx / (data.length - 1)) * width,
    y: height - 2 - ((val - min) / range) * (height - 4),
  }));

  const strokeColor = isPositive ? '#16a34a' : '#e11d48';
  const pathD = getSmoothSvgPath(points);

  return (
    <svg width={width} height={height} className="overflow-visible inline-block shrink-0" aria-hidden="true">
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
