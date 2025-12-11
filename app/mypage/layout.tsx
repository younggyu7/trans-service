import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import IconSidebar from '@/components/IconSidebar';
import Header from '@/components/Header';

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex">
        <IconSidebar />
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 min-h-[calc(100vh-64px)] bg-white">
          <div className="max-w-[1120px] mx-auto p-8">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}
