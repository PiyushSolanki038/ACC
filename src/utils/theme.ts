interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  hover: string;
}

const lightTheme: ThemeColors = {
  primary: 'var(--color-primary-600)',
  background: '#f3f4f6',
  surface: '#ffffff',
  text: '#111827',
  textSecondary: '#4b5563',
  border: '#e5e7eb',
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  hover: '#f9fafb'
};

const darkTheme: ThemeColors = {
  primary: 'var(--color-primary-500)',
  background: '#111827',
  surface: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  inputBg: '#374151',
  inputBorder: '#4b5563',
  hover: '#2d3748'
};

<<<<<<< HEAD
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
=======
export type Theme = 'light' | 'dark' | 'system';

export const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
>>>>>>> c4b8260 (Initial commit)
};

const applyThemeVariables = (colors: ThemeColors) => {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
};

<<<<<<< HEAD
export const applyTheme = (theme: 'light' | 'dark' | 'system'): void => {
  const root = window.document.documentElement;
  const activeTheme = theme === 'system' ? getSystemTheme() : theme;
  
  root.classList.remove('light', 'dark');
  root.classList.add(activeTheme);
  
  // Apply theme variables
  applyThemeVariables(activeTheme === 'dark' ? darkTheme : lightTheme);
=======
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Apply theme variables
  applyThemeVariables(theme === 'dark' ? darkTheme : lightTheme);
>>>>>>> c4b8260 (Initial commit)
  
  // Store theme preference
  localStorage.setItem('theme', theme);
};

<<<<<<< HEAD
export const initializeTheme = (): void => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
  const theme = savedTheme || 'system';
  applyTheme(theme);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    if (theme === 'system') {
      applyTheme('system');
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
=======
export const initializeTheme = (defaultTheme: Theme = 'light') => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  const theme = savedTheme || defaultTheme;
  
  applyTheme(theme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (theme === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
>>>>>>> c4b8260 (Initial commit)
}; 