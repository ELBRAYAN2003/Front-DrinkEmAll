const VARIANTS = {
  whisky: {
    glass: ['#8a5a1a', '#6b4312'],
    liquid: ['#d9a05b', '#b97f33'],
    cap: '#caa84a',
    labelBg: '#f4e7cd',
    labelText: '#5b3a17',
    accent: '#8a5a1a',
    name: 'WHISKY',
    meta: '40% ALC',
  },
  vodka: {
    glass: ['#e4f1fb', '#c4dcef'],
    liquid: ['#cae8fa', '#a9d2f2'],
    cap: '#cfd6dd',
    labelBg: '#f7fbff',
    labelText: '#1c6dc4',
    accent: '#1c6dc4',
    name: 'VODKA',
    meta: '40% ALC',
  },
  fernet: {
    glass: ['#1e2b23', '#101710'],
    liquid: ['#14190f', '#080c06'],
    cap: '#e7ba0a',
    labelBg: '#0d0d0d',
    labelText: '#ffd21d',
    accent: '#ffd21d',
    name: 'FERN&ET',
    meta: '700 ML',
  },
  beer: {
    glass: ['#82551f', '#5c3a12'],
    liquid: ['#e6b13f', '#c9921f'],
    cap: '#cfcfcf',
    labelBg: '#f6ead0',
    labelText: '#7a4520',
    accent: '#b3862a',
    name: 'BEER',
    meta: '355 ML',
  },
  white: {
    glass: ['#e8f0e6', '#c8dcc9'],
    liquid: ['#e9dfb0', '#d8c886'],
    cap: '#b9a04a',
    labelBg: '#f8f2dc',
    labelText: '#556b2f',
    accent: '#7a8f3d',
    name: 'DRINK',
    meta: '700 ML',
  },
  red: {
    glass: ['#5a1420', '#33060e'],
    liquid: ['#8e1f2f', '#64101d'],
    cap: '#3a3a3a',
    labelBg: '#efe2d0',
    labelText: '#4a2323',
    accent: '#7a2020',
    name: 'DRINK',
    meta: '700 ML',
  },
  rose: {
    glass: ['#eec9b3', '#dd9f90'],
    liquid: ['#f2b8a8', '#e08f86'],
    cap: '#c98a8a',
    labelBg: '#fbe9e2',
    labelText: '#a14b53',
    accent: '#c96a74',
    name: 'DRINK',
    meta: '700 ML',
  },
  green: {
    glass: ['#1f3a2a', '#12241a'],
    liquid: ['#4f8f5a', '#2f6639'],
    cap: '#35633d',
    labelBg: '#e9f2dc',
    labelText: '#2f5a23',
    accent: '#3f7a33',
    name: 'DRINK',
    meta: '700 ML',
  },
}

export function Bottle({ kind = 'whisky', label, size, className = '' }) {
  const v = VARIANTS[kind] ?? VARIANTS.whisky
  const gid = `g-${kind}`
  const lid = `l-${kind}`
  const labelText = label ?? v.name

  return (
    <span className={`bottle ${className}`} role="img" aria-label={labelText}>
      <svg viewBox="0 0 120 200" width={size ?? '100%'} height={size ?? '100%'} aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={v.glass[1]} />
            <stop offset="35%" stopColor={v.glass[0]} />
            <stop offset="70%" stopColor={v.glass[0]} />
            <stop offset="100%" stopColor={v.glass[1]} />
          </linearGradient>
          <linearGradient id={lid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={v.liquid[0]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={v.liquid[1]} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <ellipse cx="60" cy="190" rx="34" ry="7" fill="#000" opacity="0.18" />

        <rect x="50" y="3" width="20" height="15" rx="2" fill={v.cap} />
        <rect x="47" y="18" width="26" height="6" rx="2" fill={v.cap} opacity="0.85" />

        <path
          d="M53 24 h14 v9 c0 3 -2 5 -5 7 h-4 c-3 -2 -5 -4 -5 -7 z"
          fill="url(#gid)"
        />

        <path
          d="M30 40
             c0 -7 9 -11 15 -11
             h30
             c6 0 15 4 15 11
             v122
             c0 15 -11 26 -30 26
             c-19 0 -30 -11 -30 -26 z"
          fill="url(#gid)"
        />

        <path d="M32 78 h56 v84 c0 15 -11 26 -30 26 c-19 0 -30 -11 -30 -26 z" fill="url(#lid)" />

        <rect x="36" y="150" width="8" height="58" rx="4" fill="#fff" opacity="0.14" />
        <path d="M52 44 l2 -6 h12 l2 6 z" fill="#fff" opacity="0.28" />

        <rect x="32" y="96" width="56" height="52" rx="5" fill={v.labelBg} stroke={v.accent} strokeWidth="1.2" />
        <rect x="38" y="102" width="44" height="2" fill={v.accent} />
        <text x="60" y="138" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1" fill={v.labelText} fontFamily="Poppins, sans-serif">
          {labelText}
        </text>
        <text x="60" y="120" textAnchor="middle" fontSize="8.5" letterSpacing="2" fill={v.accent} fontFamily="Poppins, sans-serif">
          {v.meta}
        </text>
      </svg>
    </span>
  )
}