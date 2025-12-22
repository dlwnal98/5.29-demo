import { AppLayout } from '@/components/layout/AppLayout';
import { FileBrowser } from './components/file-browser';
import { Suspense } from 'react';

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={<div>로딩 중...</div>}>
        <div className="container px-4 pt-6">
          <h1 className="text-2xl font-bold text-gray-900">Config</h1>
          <p className="text-gray-600 mt-1">Config를 관리하고 배포하세요.</p>
        </div>
        <FileBrowser />
      </Suspense>
    </AppLayout>
  );
}
