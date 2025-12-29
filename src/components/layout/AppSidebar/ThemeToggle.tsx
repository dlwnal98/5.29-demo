import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[64px] h-[32px] bg-neutral-200 rounded-full animate-pulse" />;
  }

  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="relative block top-[-7px] w-full h-[32px] rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300 flex items-center"
      aria-label="Toggle Theme"
    >
      <span className="flex items-center justify-center w-1/2 h-full z-20">
        <Sun className={`w-5 h-5 ${isDark ? 'text-neutral-200' : 'text-neutral-600'}`} />
      </span>
      <span className="flex items-center justify-center w-1/2 h-full z-20">
        <Moon className={`w-5 h-5 ${isDark ? 'text-neutral-200' : 'text-neutral-600'}`} />
      </span>
      <div
        className={`absolute top-0.5 left-1 w-[49%] h-7 bg-white dark:bg-neutral-800 z-10 rounded-full shadow transition-transform duration-300 ${isDark ? 'translate-x-[99%]' : 'translate-x-0'
          }`}
      />
    </button>
  );
}

// 사이드바 접었을 때
export function CollapseThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-[60px] bg-neutral-200 rounded-full animate-pulse" />;
  }

  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="relative top-[-10px] flex flex-col items-center w-8 h-[60px] rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300"
      aria-label="Toggle Theme"
    >
      <span className="flex items-center justify-center w-full h-1/2 z-20">
        <Sun className={`w-5 h-5 ${isDark ? 'text-neutral-200' : 'text-neutral-600'}`} />
      </span>
      <span className="flex items-center justify-center w-full h-1/2 z-20">
        <Moon className={`w-5 h-5 ${isDark ? 'text-neutral-200' : 'text-neutral-600'}`} />
      </span>
      <div
        className={`absolute top-0.5 left-0.5 w-7 h-7 bg-white dark:bg-neutral-800 z-10 rounded-full shadow transition-transform duration-300 ${isDark ? 'translate-y-[28px]' : 'translate-y-0'
          }`}
      />
    </button>
  );
}