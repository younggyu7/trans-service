'use client';

import { PriceProvider } from '@/lib/priceContext';
import { LanguageConfigProvider } from '@/lib/languageConfig';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PriceProvider>
      <LanguageConfigProvider>
        {children}
      </LanguageConfigProvider>
    </PriceProvider>
  );
}
