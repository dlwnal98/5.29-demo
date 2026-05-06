import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/store';

const PublicRoute = () => {
    const { accessToken } = useAuthStore();

    // 토큰이 있다는 것은 이미 로그인 상태라는 의미
    if (accessToken) {
        // 이미 로그인한 사용자가 접근하려 하면 메인 페이지로 리다이렉트
        return <Navigate to="/dashboard" replace />;
    }

    // 토큰이 없으면 로그인/회원가입 페이지를 정상적으로 보여줌
    return <Outlet />;
};

export default PublicRoute;