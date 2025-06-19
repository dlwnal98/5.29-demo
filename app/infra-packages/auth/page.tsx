import { AppLayout } from "@/components/layout/AppLayout";

export default function AuthPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            인증 및 권한 관리 서비스
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">사용자 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">
              시스템 사용자 계정을 관리합니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">권한 설정</h3>
            <p className="text-gray-600 dark:text-gray-400">
              역할 기반 접근 제어를 설정합니다.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
