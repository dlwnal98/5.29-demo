

import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner"; // sonner 임포트

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

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
