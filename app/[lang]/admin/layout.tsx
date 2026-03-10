import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { lang } = await params;

  return (
    <>
      <Header lang={lang} role='admin' />
      {children}
      <div className='px-48 pb-8'>
        <Footer />
      </div>
    </>
  );
}
