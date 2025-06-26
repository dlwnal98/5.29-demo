import { AppLayout } from "@/components/layout/AppLayout";
import { FileBrowser } from "./components/file-browser";

export default function Page() {
  return (
    <AppLayout>
      <FileBrowser />
    </AppLayout>
  );
}
