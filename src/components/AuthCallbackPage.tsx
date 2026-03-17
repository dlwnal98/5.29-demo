

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { LogIn, Shield, CheckCircle } from 'lucide-react';
import { requestPost } from '@/libs/request';
import { useAuthStore } from '@/stores/store';
import { toast, Toaster } from 'sonner';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;
  const hasCalledRef = useRef(false); // 중복 호출 방지
  const setTokens = useAuthStore((state) => state.setTokens); // setTokens 가져오기


  const getJWTToken = async () => {
    const EXPIRES_IN = 86400; // 1일 (24시간)

    const res = await requestPost('/api/v1/access-token/issue', {
      body: {
        code: code,
        // 아래는 고정값
        userId: userId,
        clientId: 'test',
        expiresIn: EXPIRES_IN,
      },
    });

    if (res?.code == 200) {
      const expiresAt = Date.now() + EXPIRES_IN * 1000; // Date.now()랑 expires의 시간 단위가 달라서 *1000 적용

      setTokens(res.data.accessToken, res.data.refreshToken, String(expiresAt));
      navigate('/dashboard');
    } else {
      toast.error('로그인 실패', {
        description: res?.message,
        duration: Infinity, // 사용자가 닫기 전까지 계속 표시 (선택 사항)
        actionButtonStyle: {  // 버튼 스타일 직접 지정
          backgroundColor: '#ff4b4b', // 배경색
          color: '#ffffff',           // 글자색
          borderRadius: '8px',        // 모서리 둥글게
          padding: '16px',        // 여백
        },
        action: {
          label: '확인', // 버튼 이름
          onClick: () => { // 사용자가 이 '확인' 버튼을 클릭했을 때만 실행됨
            navigate('/');
          },
        },
      });
    }
  };

  useEffect(() => {
    // React Strict Mode에서 useEffect가 2번 실행되는 것을 방지
    if (hasCalledRef.current) return;

    if (code && userId) {
      hasCalledRef.current = true;
      getJWTToken();
    }
  }, [code, userId]);

  return (
    <>
      <Toaster position="top-center" richColors expand />
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* 3D 로그인 아이콘 */}
        <div className="relative mb-8">
          {/* 메인 아이콘 */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <LogIn className="w-12 h-12 text-white animate-bounce" />
            </div>

            {/* 3D 효과를 위한 그림자 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-blue-500/20 rounded-full blur-md"></div>
          </div>

          {/* 회전하는 보안 아이콘들 */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-spin">
            <Shield className="w-4 h-4 text-white" />
          </div>

          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg animate-ping">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white animate-fade-in">
            로그인 중입니다
          </h1>
          <p className="text-gray-600 dark:text-gray-300 animate-fade-in-delay">
            잠시만 기다려주세요
          </p>
        </div>

        {/* 로딩 바 */}
        <div className="mt-8 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-loading-bar"></div>
        </div>

        <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
      </div>
    </>
  );
}
