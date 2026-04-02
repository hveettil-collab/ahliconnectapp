import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Ahli Connect — IHC Employee Platform',
  description: 'Your employee ecosystem across IHC Group',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
