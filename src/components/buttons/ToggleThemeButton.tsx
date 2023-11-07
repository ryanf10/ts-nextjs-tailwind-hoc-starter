import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import IconButton from '@/components/buttons/IconButton';

export default function ToggleThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <>
      <IconButton
        icon={resolvedTheme === 'light' ? FiMoon : FiSun}
        onClick={() => {
          if (resolvedTheme == 'dark') {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        }}
      />
    </>
  );
}
