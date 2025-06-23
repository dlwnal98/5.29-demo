import { AppLayout } from "@/components/layout/AppLayout";
import { FileCreator } from "@/components/file-creator";

interface CreateFilePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    branch?: string;
    path?: string;
  };
}

export default function CreateFilePage({
  params,
  searchParams,
}: CreateFilePageProps) {
  return (
    <AppLayout projectSlug={params.slug}>
      <FileCreator
        projectSlug={params.slug}
        branch={searchParams.branch || "main"}
        currentPath={searchParams.path || ""}
      />
    </AppLayout>
  );
}
