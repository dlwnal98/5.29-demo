import { NewProjectForm } from "@/components/new-project-form"

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <NewProjectForm />
      </div>
    </div>
  )
}
