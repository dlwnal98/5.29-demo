import { AppLayout } from "@/components/layout/AppLayout";

export default function MonitoringPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            시스템 모니터링 및 성능 분석
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">시스템 메트릭</h3>
            <p className="text-gray-600 dark:text-gray-400">
              CPU, 메모리, 디스크 사용량 모니터링
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">애플리케이션 로그</h3>
            <p className="text-gray-600 dark:text-gray-400">
              실시간 로그 모니터링
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">알림 설정</h3>
            <p className="text-gray-600 dark:text-gray-400">
              임계값 기반 알림 설정
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
