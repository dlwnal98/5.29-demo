import { AppLayout } from "@/components/app-layout";
import { FileBrowser } from "@/components/file-browser";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <AppLayout projectSlug={params.slug}>
      <FileBrowser projectSlug={params.slug} />
    </AppLayout>
  );
}
