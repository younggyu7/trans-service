import Header from '@/components/Header';

export default function TranslateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
}
