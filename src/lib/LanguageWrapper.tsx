"use client"
import { useEffect, useState, ReactNode } from 'react';

interface LanguageWrapperProps {
  children: ReactNode;
}

export default function LanguageWrapper({ children }: LanguageWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children after first mount
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}