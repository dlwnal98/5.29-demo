import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AccountPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            계정 설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            개인 정보 및 계정 설정을 관리합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">프로필 정보</CardTitle>
                <CardDescription>
                  기본 프로필 정보를 수정할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      사진 변경
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG 파일만 업로드 가능합니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userID">ID</Label>
                  <Input
                    id="userID"
                    defaultValue="userId01239"
                    disabled={true}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">이름</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organiztion">그룹</Label>
                  <Input id="organiztion" type="text" defaultValue="Nexfron" />
                </div>

                <Button>변경사항 저장</Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>계정 보안</CardTitle>
                <CardDescription>
                  비밀번호 및 보안 설정을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <Button>비밀번호 변경</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">계정 삭제</CardTitle>
                <CardDescription>
                  되돌릴 수 없는 작업입니다. 그래도 삭제하시겠습니까?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm">
                  계정 삭제
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
