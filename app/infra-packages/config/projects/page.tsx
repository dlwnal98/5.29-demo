import { AppLayout } from '@/components/layout/AppLayout';
import { FileBrowser } from './components/file-browser';
import { Suspense } from 'react';

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={<div>로딩 중...</div>}>
        <FileBrowser />
      </Suspense>
    </AppLayout>
  );
}
