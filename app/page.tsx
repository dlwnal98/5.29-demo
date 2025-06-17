// import { AppLayout } from "@/components/app-layout";
import { Dashboard } from "@/components/dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectList } from "@/components/project-list";

export default function Page() {
  return (
    <AppLayout>
      <Dashboard />
      {/* <ProjectList /> */}
    </AppLayout>
  );
}
