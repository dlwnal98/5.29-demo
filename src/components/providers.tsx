

import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner"; // sonner 임포트

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ✅ 서버가 내려갔을 때 무한 재시도를 방지하기 위해 0 또는 1로 설정
            retry: (failureCount, error: any) => {
              // 서버가 응답이 없거나 404인 경우 재시도 안 함
              if (error?.response?.status === 404 || !error.response) return false;
              // 그 외의 경우 2번까지 재시도
              return failureCount < 2;
            },
            // ✅ 데이터가 한 번 성공하면 굳이 다시 가져오지 않도록 설정 (선택 사항)
            staleTime: 1000 * 60 * 5, // 5분
            // ✅ 윈도우 포커스 시 자동 리페치 방지 (이미 개별 설정 중이시지만 전역 설정이 안전합니다)
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={true}
    >
      <QueryClientProvider client={queryClient}>{children}
        <Toaster
          expand={true}
          richColors
          position="bottom-center"
        // ThemeProvider 하위에 있으므로 테마가 자동으로 연동됩니다
        />

      </QueryClientProvider>
    </ThemeProvider>
  );
}
