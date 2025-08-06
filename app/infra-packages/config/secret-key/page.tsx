"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Save, Key } from "lucide-react";
import { useFetchVaultKey, useSaveVaultKey } from "@/hooks/use-config-data";

export default function SecretKey() {
  const { data: vaultKeyData } = useFetchVaultKey();
  console.log(vaultKeyData);
  const [value, setValue] = useState<string>("");

  const { mutate: saveVaultKey } = useSaveVaultKey(value);

  const saveConfigs = () => {
    saveVaultKey();
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />새 시크릿 키 추가
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                <Key className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor={`vault`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    기존 Value
                  </Label>
                  <Input
                    id={`vault`}
                    placeholder="설정 값을 입력하세요"
                    value={vaultKeyData}
                    disabled
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor={`vault`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    새로운 Value
                  </Label>
                  <Input
                    id={`vault`}
                    placeholder="설정 값을 입력하세요"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={saveConfigs}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
              >
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
