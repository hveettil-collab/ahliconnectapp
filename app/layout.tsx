import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { WalletProvider } from '@/context/WalletContext';
import { ListingsProvider } from '@/context/ListingsContext';
import { InsuranceProvider } from '@/context/InsuranceContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import KeyboardManager from '@/components/layout/KeyboardManager';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';
import PWABackNavigator from '@/components/layout/PWABackNavigator';

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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
        <meta name="theme-color" content="#9D63F6" />
        <meta name="theme-color" content="#9D63F6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#9D63F6" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ahli Connect" />
        <meta name="application-name" content="Ahli Connect" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#9D63F6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className="overflow-x-hidden w-full max-w-full">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <WalletProvider>
                <ListingsProvider>
                  <InsuranceProvider>
                  <ErrorBoundary>
                    <KeyboardManager />
                    <ServiceWorkerRegister />
                    <PWABackNavigator />
                    {children}
                  </ErrorBoundary>
                  </InsuranceProvider>
                </ListingsProvider>
              </WalletProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
