// app/auth-callback/page.tsx
import { Suspense } from 'react';
import AuthCallbackClient from './AuthCallbackClient';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>로딩 중입니다...</div>}>
      <AuthCallbackClient />
    </Suspense>
  );
}
