// app/auth-callback/page.tsx
import dynamic from 'next/dynamic';

const AuthCallbackClient = dynamic(() => import('./AuthCallbackClient'), {
  ssr: false, // 🔥 클라이언트에서만 렌더링하도록 명시
});

export default function AuthCallbackPage() {
  return <AuthCallbackClient />;
}
