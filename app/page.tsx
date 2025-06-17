// import { AppLayout } from "@/components/app-layout";
import { Dashboard } from "@/components/dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectList } from "@/components/project-list";
import Head from "next/head";

<Head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
  />
</Head>;

export default function Page() {
  return (
    <AppLayout>
      <Dashboard />
      {/* <ProjectList /> */}
    </AppLayout>
  );
}
