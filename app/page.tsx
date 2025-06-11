import { AppLayout } from "@/components/app-layout";
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
      <ProjectList />
    </AppLayout>
  );
}
