import { AppLayout } from "@/components/app-layout"

export default function EurekaPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Eureka Service Registry</h1>
          <p className="text-gray-600 dark:text-gray-400">마이크로서비스 등록 및 발견 서비스</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">등록된 서비스</h3>
            <p className="text-gray-600 dark:text-gray-400">현재 등록된 마이크로서비스 목록</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">서비스 상태</h3>
            <p className="text-gray-600 dark:text-gray-400">각 서비스의 헬스 체크 상태</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">인스턴스 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">서비스 인스턴스 관리</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
