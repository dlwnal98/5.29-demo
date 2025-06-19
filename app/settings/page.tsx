import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, User, Shield, Bell, Palette } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            시스템 설정 및 개인 설정 관리
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/settings/account">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>계정 설정</span>
                </CardTitle>
                <CardDescription>개인 정보 및 계정 보안 설정</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>보안 설정</span>
              </CardTitle>
              <CardDescription>비밀번호 및 2단계 인증 설정</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>알림 설정</span>
              </CardTitle>
              <CardDescription>이메일 및 푸시 알림 설정</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>테마 설정</span>
              </CardTitle>
              <CardDescription>다크모드 및 UI 테마 설정</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>시스템 설정</span>
              </CardTitle>
              <CardDescription>전역 시스템 설정 관리</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
