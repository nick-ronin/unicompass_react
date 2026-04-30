'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type RouteGuardProps = {
  lang: string;
  required: 'student' | 'admin';
  children: React.ReactNode;
};

function hasStudentSession() {
  return Boolean(localStorage.getItem('studentAuth'));
}

function hasAdminSession() {
  return Boolean(
    localStorage.getItem('jwt') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token')
  );
}

export default function RouteGuard({ lang, required, children }: RouteGuardProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isAuthenticated = required === 'student' ? hasStudentSession() : hasAdminSession();

    if (!isAuthenticated) {
      router.replace(`/${lang}/login`);
      return;
    }

    setIsReady(true);

    const handleStorageChange = () => {
      const stillAuthenticated = required === 'student' ? hasStudentSession() : hasAdminSession();

      if (!stillAuthenticated) {
        router.replace(`/${lang}/login`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [lang, required, router]);

  if (!isReady) {
    return null;
  }

  return children;
}