import { createContext, useContext, useEffect, useState } from 'react';

const DEFAULTS = {
  mode: 'dark',
  // light mode customizable tokens
  bgPage:    '#f8fafc',
  bgCard:    '#ffffff',
  bgNav:     '#ffffff',
  primary:   '#2d7d7d',
  accent:    '#f0a030',
  cta:       '#d03010',
  textMain:  '#1a1a1a',
  textMuted: '#64748b',
  border:    '#e2e8f0',
  radius:    '10',       // px
  fontScale: '100',      // %
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('tb-theme') || '{}') }; }
    catch { return DEFAULTS; }
  });

  // Apply CSS variables to :root whenever theme changes
  useEffect(() => {
    const r = document.documentElement;
    if (theme.mode === 'dark') {
      r.setAttribute('data-theme', 'dark');
      r.style.removeProperty('--bg');
      r.style.removeProperty('--bg-card');
      r.style.removeProperty('--bg-nav');
      r.style.removeProperty('--text');
      r.style.removeProperty('--text-muted');
      r.style.removeProperty('--border-color');
    } else {      r.setAttribute('data-theme', 'light');
      r.style.setProperty('--bg',           theme.bgPage);
      r.style.setProperty('--bg-card',      theme.bgCard);
      r.style.setProperty('--bg-nav',       theme.bgNav);
      r.style.setProperty('--text',         theme.textMain);
      r.style.setProperty('--text-muted',   theme.textMuted);
      r.style.setProperty('--border-color', theme.border);
    }    // Always apply these regardless of mode
    r.style.setProperty('--primary',       theme.primary);
    r.style.setProperty('--primary-light', lighten(theme.primary));
    r.style.setProperty('--primary-dark',  darken(theme.primary));
    r.style.setProperty('--accent',        theme.accent);
    r.style.setProperty('--cta',           theme.cta);
    r.style.setProperty('--radius-md',     `${theme.radius}px`);
    r.style.setProperty('--radius-lg',     `${Math.round(theme.radius * 1.6)}px`);
    r.style.setProperty('--radius-sm',     `${Math.round(theme.radius * 0.6)}px`);
    document.documentElement.style.fontSize = `${theme.fontScale}%`;

    localStorage.setItem('tb-theme', JSON.stringify(theme));
  }, [theme]);

  const update = (key, val) => setTheme(t => ({ ...t, [key]: val }));
  const reset  = () => setTheme(DEFAULTS);

  return (
    <ThemeContext.Provider value={{ theme, update, reset, DEFAULTS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// helpers
function lighten(hex) {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 0xff) + 60);
    const g = Math.min(255, ((n >> 8)  & 0xff) + 60);
    const b = Math.min(255, ( n        & 0xff) + 60);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
}
function darken(hex) {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, ((n >> 16) & 0xff) - 40);
    const g = Math.max(0, ((n >> 8)  & 0xff) - 40);
    const b = Math.max(0, ( n        & 0xff) - 40);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
}
