// app/auth-callback/page.tsx
import AuthCallbackClient from './AuthCallbackClient';
import { Suspense } from 'react';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AuthCallbackClient />
    </Suspense>
  );
}
