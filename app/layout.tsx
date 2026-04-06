import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { WalletProvider } from '@/context/WalletContext';
import { ListingsProvider } from '@/context/ListingsContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import KeyboardManager from '@/components/layout/KeyboardManager';

export const metadata: Metadata = {
  title: 'Ahli Connect — IHC Employee Platform',
  description: 'Your employee ecosystem across IHC Group',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content" />
      </head>
      <body className="overflow-x-hidden w-full max-w-full">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <WalletProvider>
                <ListingsProvider>
                  <ErrorBoundary>
                    <KeyboardManager />
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
