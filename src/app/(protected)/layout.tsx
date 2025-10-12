import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <main className="ml-64 flex-1 pt-20 p-6">{children}</main>
    </div>
  );
}
