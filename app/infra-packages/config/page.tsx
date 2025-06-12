import { AppLayout } from "@/components/app-layout"

export default function ConfigPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Configuration Server</h1>
          <p className="text-gray-600 dark:text-gray-400">중앙 집중식 설정 관리 서버</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">환경 설정</h3>
            <p className="text-gray-600 dark:text-gray-400">개발, 테스트, 운영 환경별 설정을 관리합니다.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">설정 히스토리</h3>
            <p className="text-gray-600 dark:text-gray-400">설정 변경 이력을 확인합니다.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
