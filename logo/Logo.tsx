// backupyourlife Logo 2e – Pfade, keine Webfont nötig.
import light from './logo-light.svg';
import dark from './logo-dark-transparent.svg';
import mono from './logo-mono-black.svg';
import symbol from './symbol.svg';
const SRC = { light, dark, mono, symbol };
export function Logo({ variant = 'light', height = 40 }: { variant?: keyof typeof SRC; height?: number }) {
  const src = (SRC[variant] as any).src ?? SRC[variant];
  return <img src={src} height={height} alt="backupyourlife" style={{ height, width: 'auto' }} />;
}
