'use client';

import AdminProfile from '@/components/AdminProfile';
import { useParams } from 'next/navigation';

export default function AdminProfilePage() {
  const params = useParams();
  const lang = (params?.lang as 'ru' | 'en') || 'ru';
  return <AdminProfile lang={lang} />;
}
