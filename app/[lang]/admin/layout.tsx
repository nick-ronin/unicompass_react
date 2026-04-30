import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteGuard from '@/components/RouteGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { lang } = await params;

  return (
    <RouteGuard lang={lang} required='admin'>
      <Header lang={lang} role='admin' />
      {children}
      <div className='px-4 pb-8 sm:px-6 md:px-12 lg:px-48 footer-wrapper'>
        <Footer />
      </div>
    </RouteGuard>
  );
}
