import { AppLayout } from "@/components/layout/AppLayout";

export default function Services2Page() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Services 2
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            추가 서비스 관리 페이지
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Services 2 관리</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Services 2 관련 기능들을 관리합니다.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
