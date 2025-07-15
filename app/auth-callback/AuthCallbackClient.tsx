// app/auth-callback/AuthCallbackClient.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const getJWTToken = async () => {
    try {
      const res = await axios.post('/api/v1/access-token/issue', {
        code,
        userId: 'user01',
        tenantId: 'test',
        clientId: 'test',
        expiresIn: 3600,
      });

      if (res.status === 200) {
        localStorage.setItem('access_token', res.data.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('토큰 발급 실패', err);
    }
  };

  useEffect(() => {
    if (code) getJWTToken();
  }, [code]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        로그인 중입니다...
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4">잠시만 기다려 주세요.</p>
      <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
    </div>
  );
}
