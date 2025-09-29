'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (sessionStorage.getItem('access_token')) {
    //   setLoading(false);
    // } else {
    //   router.replace('/'); // 인증 실패 → 로그인 페이지로 이동
    // }
    // axios
    //   .get('/api/me') // 로그인 상태 확인용 API
    //   .then(() => {
    //     setLoading(false); // 인증 OK
    //   })
    //   .catch(() => {
    //     router.replace('/'); // 인증 실패 → 로그인 페이지로 이동
    //   });
  }, [router]);

  if (loading) return <p>로딩 중...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;
