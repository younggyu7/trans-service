import Header from '@/components/Header';
import IconSidebar from '@/components/IconSidebar';
import TranslatorSidebar from '@/components/TranslatorSidebar';

export default function TranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <IconSidebar />
        <TranslatorSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
