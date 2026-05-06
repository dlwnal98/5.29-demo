import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeJWT } from '@/hooks/decodeToken';
import { useLoginData } from '@/pages/login/hooks/useLoginData';
import { Loader2 } from 'lucide-react';

/**
 * 포털에서 전달한 ssoToken을 처리하는 콜백 페이지
 * 1. URL 쿼리 파라미터에서 ssoToken 추출
 * 2. 토큰 디코딩하여 loginId, loginPassword 획득
 * 3. APIM 로그인 API 호출하여 세션 획득
 * 4. 성공 시 대시보드로 이동
 */
const SsoCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useLoginData();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleSso = async () => {
            const token = searchParams.get('ssoToken');

            if (!token) {
                setError('SSO 토큰이 누락되었습니다.');
                return;
            }

            const decoded = decodeJWT(token);
            if (!decoded || !decoded.loginId || !decoded.loginPassword) {
                setError('유효하지 않은 SSO 토큰이거나 계정 정보가 누락되었습니다.');
                return;
            }

            try {
                // APIM 기존 로그인 로직 호출
                const result = await login(decoded.loginId, decoded.loginPassword);

                if (result.success && result.redirectUrl) {
                    // 1. redirectUrl에서 code 파라미터 추출
                    const url = new URL(result.redirectUrl, window.location.origin);
                    const code = url.searchParams.get('code');

                    if (code) {
                        // 2. AuthCallbackPage에서 필요한 userId를 sessionStorage에 저장
                        sessionStorage.setItem('userId', decoded.loginId);

                        // 3. 정식 인증 성공 처리(토큰 발급)를 위해 AuthCallbackPage로 이동
                        navigate(`/auth-callback?code=${code}`, { replace: true });
                    } else {
                        setError('인증 코드를 추출할 수 없습니다.');
                    }
                } else {
                    setError(result.errorMessage || '자동 로그인에 실패했습니다.');
                }
            } catch (err) {
                console.error('SSO Error:', err);
                setError('로그인 처리 중 오류가 발생했습니다.');
            }
        };

        handleSso();
    }, [searchParams, login, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4">SSO 오류</h2>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-medium">포털 SSO 로그인 중...</h2>
            <p className="text-slate-400 mt-2">잠시만 기다려주세요.</p>
        </div>
    );
};

export default SsoCallbackPage;
