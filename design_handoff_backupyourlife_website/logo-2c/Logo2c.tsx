// backupyourlife Logo 2c – Textmarker + Kinder-Claim
// Benötigt Caveat Brush (next/font/google oder <link> in <head>).
type Variant = 'light' | 'dark' | 'mono';
const C = {
  light: { word: '#1A1A1A', marker: '#FFC531', claim: '#2B59C3' },
  dark:  { word: '#FFFFFF', marker: '#E8412C', claim: '#FFC531' },
  mono:  { word: '#1A1A1A', marker: '#FFC531', claim: '#1A1A1A' },
};
export function Logo2c({ variant = 'light', height = 48, claim = true }: { variant?: Variant; height?: number; claim?: boolean }) {
  const c = C[variant];
  const h = claim ? 112 : 76;
  return (
    <svg viewBox={`0 0 340 ${h}`} height={height} role="img" aria-label={claim ? 'backupyourlife – weil wir dich brauchen' : 'backupyourlife'} style={{ fontFamily: "'Caveat Brush', cursive" }}>
      <text x="4" y="60" fontSize="60" fill={c.word} textLength="140" lengthAdjust="spacingAndGlyphs">backup</text>
      <g transform="rotate(-1 238 47)">
        <rect x="148" y="34" width="180" height="27" rx="4" fill={c.marker} />
        <text x="154" y="60" fontSize="60" fill={c.word} textLength="168" lengthAdjust="spacingAndGlyphs">yourlife</text>
      </g>
      {claim && <text x="8" y="98" fontSize="28" fill={c.claim} textLength="250" lengthAdjust="spacingAndGlyphs" transform="rotate(-2 8 98)">… weil wir dich brauchen.</text>}
    </svg>
  );
}
