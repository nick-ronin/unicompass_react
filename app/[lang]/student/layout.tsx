import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface StudentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function StudentLayout({ children, params }: StudentLayoutProps) {
  const { lang } = await params;

  return (
    <>
      <Header lang={lang} role='student' />
      {children}
      <div className='px-48 pb-8'>
        <Footer />
      </div>
    </>
  );
}
