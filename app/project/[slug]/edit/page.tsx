import { AppLayout } from "@/components/app-layout"
import { FileEditor } from "@/components/file-editor"

interface EditFilePageProps {
  params: {
    slug: string
  }
  searchParams: {
    branch?: string
    path?: string
    file?: string
  }
}

export default function EditFilePage({ params, searchParams }: EditFilePageProps) {
  return (
    <AppLayout projectSlug={params.slug}>
      <FileEditor
        projectSlug={params.slug}
        branch={searchParams.branch || "main"}
        currentPath={searchParams.path || ""}
        fileName={searchParams.file || ""}
      />
    </AppLayout>
  )
}
