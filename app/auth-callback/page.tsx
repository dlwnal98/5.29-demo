'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  // const code = 'auth_code_123';

  const getJWTToken = async () => {
    const res = await axios.post('/api/v1/access-token/issue', {
      code: code,

      // 아래는 고정값
      userId: 'user01',
      tenantId: 'test',
      clientId: 'test',
      expiresIn: 3600,
    });

    if (res.status == 200) {
      console.log(res);
      if (res) {
        localStorage.setItem('access_token', res.data.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
        router.push('/dashboard');
      }
    }
  };

  useEffect(() => {
    if (code) {
      console.log(code);
      getJWTToken();
    }
  }, [code]);

  return <p>로그인 처리 중입니다...</p>;
}
