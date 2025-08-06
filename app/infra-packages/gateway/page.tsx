import { AppLayout } from "@/components/layout/AppLayout";

export default function GatewayPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            API Gateway
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            API Gateway 서비스 관리 및 모니터링
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">라우팅 규칙</h3>
            <p className="text-gray-600 dark:text-gray-400">
              현재 활성화된 라우팅 규칙을 관리합니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">로드 밸런싱</h3>
            <p className="text-gray-600 dark:text-gray-400">
              트래픽 분산 설정을 관리합니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">보안 정책</h3>
            <p className="text-gray-600 dark:text-gray-400">
              API 보안 정책을 설정합니다.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
