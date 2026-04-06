import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { WalletProvider } from '@/context/WalletContext';
import { ListingsProvider } from '@/context/ListingsContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import KeyboardManager from '@/components/layout/KeyboardManager';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Ahli Connect — IHC Employee Platform',
  description: 'Your employee ecosystem across IHC Group',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ahli Connect',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content" />
        <meta name="theme-color" content="#9D63F6" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="overflow-x-hidden w-full max-w-full">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <WalletProvider>
                <ListingsProvider>
                  <ErrorBoundary>
                    <KeyboardManager />
                    <ServiceWorkerRegister />
                    {children}
                  </ErrorBoundary>
                </ListingsProvider>
              </WalletProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
