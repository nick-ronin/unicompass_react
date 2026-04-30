import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteGuard from '@/components/RouteGuard';

interface StudentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function StudentLayout({ children, params }: StudentLayoutProps) {
  const { lang } = await params;

  return (
    <RouteGuard lang={lang} required='student'>
      <Header lang={lang} role='student' />
      {children}
      <div className='px-4 pb-8 sm:px-6 md:px-12 lg:px-48 footer-wrapper'>
        <Footer />
      </div>
    </RouteGuard>
  );
}
