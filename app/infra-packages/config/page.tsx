import { AppLayout } from "@/components/layout/AppLayout";
import { FileBrowser } from "@/components/file-browser";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: ProjectPageProps) {
  console.log(params);

  return (
    <AppLayout projectSlug={params.slug}>
      <FileBrowser projectSlug={params.slug} />
    </AppLayout>
  );
}
