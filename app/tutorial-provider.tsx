'use client';

import { useEffect } from 'react';
import { initTutorial } from '@/lib/tutorial';

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTutorial();
  }, []);

  return <>{children}</>;
}
