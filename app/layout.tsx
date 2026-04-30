import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import localFont from 'next/font/local';

const ceraProRegular = localFont({
  src: '../public/fonts/cerapro-regular.woff2',
  variable: '--font-cera-pro',
});

export const metadata: Metadata = {
  title: 'Адаптация+',
  description: 'Made by the best devs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={ceraProRegular.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (theme === 'system' || !theme) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className='font-(family-name:--font-cera-pro) bg-background text-foreground'>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}