import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/lib/theme';
import { Roboto } from 'next/font/google';
import TabNav from '@/components/TabNav';

export const metadata: Metadata = {
  title: 'Productivity App',
  description: 'Track your habits, tasks, and time',
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={roboto.className}>
          <AppRouterCacheProvider
            options={{ key: 'css', enableCssLayer: true }}
          >
            <ThemeProvider theme={theme}>
              <main className="border-black border-20 min-h-screen main">
                <TabNav />
                <div className="container mx-auto p-4">{children}</div>
              </main>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
