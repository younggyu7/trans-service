import Header from '@/components/Header';
import IconSidebar from '@/components/IconSidebar';
import ClientSidebar from '@/components/ClientSidebar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <IconSidebar />
        <ClientSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
