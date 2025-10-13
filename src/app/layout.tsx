import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/theme-provider';
import { AlertDialogProvider } from '@/context/alert-dialog-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkillSync - AI-Powered Learning Path Manager',
  description:
    'Track your learning goals with AI-powered suggestions and progress tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertDialogProvider>{children}</AlertDialogProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
