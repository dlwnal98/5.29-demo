import { AppLayout } from "@/components/app-layout"

export default function MembersPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 :text-white mb-2">Members</h1>
          <p className="text-gray-600 dark:text-gray-400">팀 멤버 관리 및 권한 설정</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">팀 멤버</h3>
            <p className="text-gray-600 dark:text-gray-400">현재 팀에 속한 멤버들을 관리합니다.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">초대 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">새로운 멤버를 초대하고 관리합니다.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
