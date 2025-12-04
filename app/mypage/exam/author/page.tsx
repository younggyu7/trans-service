'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamAuthorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/mypage/exam/author/requests');
  }, [router]);

  return null;
}
