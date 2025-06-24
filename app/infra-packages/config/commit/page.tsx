"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar } from "@/components/ui/avatar"
import { ArrowLeft, GitBranch, Copy, File, Plus, Minus } from "lucide-react"
import { useSearchParams } from "next/navigation"

// 샘플 커밋 변경사항 데이터
const commitChanges = {
  hash: "a1b2c3d4e5f",
  shortHash: "a1b2c3d",
  message: "Update documentation and fix styling issues",
  author: "jane-smith",
  email: "jane@example.com",
  time: "2 hours ago",
  date: "2024-01-15 14:30:00",
  filesChanged: 3,
  additions: 25,
  deletions: 8,
  changes: [
    {
      filename: "README.md",
      status: "modified",
      additions: 15,
      deletions: 3,
      diff: `@@ -1,7 +1,7 @@
 # My Project
 
-A simple web application
+A modern web application built with Next.js and React.
 
 ## Features
 
-- Basic functionality
+- 🚀 Fast and responsive
+- 🎨 Beautiful UI with Tailwind CSS
+- 📱 Mobile-first design
+- 🔒 Secure authentication
+- 📊 Real-time analytics
 
 ## Getting Started`,
    },
    {
      filename: "src/styles/globals.css",
      status: "modified",
      additions: 8,
      deletions: 4,
      diff: `@@ -10,10 +10,14 @@
 }
 
 body {
-  color: rgb(var(--foreground-rgb));
-  background: linear-gradient(
-      to bottom,
-      transparent,
-      rgb(var(--background-end-rgb))
-    )
-    rgb(var(--background-start-rgb));
+  color: rgb(var(--foreground-rgb));
+  background: linear-gradient(
+      to bottom,
+      transparent,
+      rgb(var(--background-end-rgb))
+    )
+    rgb(var(--background-start-rgb));
+  font-family: 'Inter', sans-serif;
+  line-height: 1.6;
+  -webkit-font-smoothing: antialiased;
+  -moz-osx-font-smoothing: grayscale;
 }`,
    },
    {
      filename: "package.json",
      status: "modified",
      additions: 2,
      deletions: 1,
      diff: `@@ -15,7 +15,8 @@
   "dependencies": {
     "next": "^14.0.0",
     "react": "^18.0.0",
-    "react-dom": "^18.0.0"
+    "react-dom": "^18.0.0",
+    "tailwindcss": "^3.0.0"
   },
   "devDependencies": {
     "@types/node": "^20.0.0",`,
    },
  ],
}

export default function CommitPage() {
  const searchParams = useSearchParams()
  const branch = searchParams.get("branch") || "main"
  const commitHash = searchParams.get("commit") || ""
  const path = searchParams.get("path") || ""

  const handleBack = () => {
    const params = new URLSearchParams()
    params.set("branch", branch)
    if (path) params.set("path", path)
    window.location.href = `/infra-packages/config/commits?${params.toString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "added":
        return "text-green-600 bg-green-50"
      case "deleted":
        return "text-red-600 bg-red-50"
      case "modified":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "added":
        return <Plus className="h-3 w-3" />
      case "deleted":
        return <Minus className="h-3 w-3" />
      case "modified":
        return <File className="h-3 w-3" />
      default:
        return <File className="h-3 w-3" />
    }
  }

  const breadcrumbItems = [
    { name: "/", href: "/" },
    { name: "config", href: `/infra-packages/config` },
    { name: "Commits", href: `/infra-packages/config/commits` },
    { name: commitChanges.shortHash, href: "" },
  ]

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBack} className="border-blue-200 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <div key={item.name} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumbItems.length - 1 ? (
                          <BreadcrumbPage className="text-blue-600">{item.name}</BreadcrumbPage>
                        ) : item.href ? (
                          <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                <GitBranch className="h-3 w-3 mr-1" />
                {branch}
              </Badge>
            </div>
          </div>

          {/* Commit Info - 한 줄로 변경 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                  {commitChanges.author.charAt(0).toUpperCase()}
                </Avatar>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">{commitChanges.author}</span>
                  <code className="bg-white px-2 py-1 rounded font-mono text-sm">{commitChanges.shortHash}</code>
                  <span className="text-gray-900">{commitChanges.message}</span>
                  <span className="text-sm text-gray-500">{commitChanges.time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{commitChanges.filesChanged} files changed</span>
                  <span className="text-green-600">+{commitChanges.additions}</span>
                  <span className="text-red-600">-{commitChanges.deletions}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(commitChanges.hash)}
                  className="hover:bg-white/50"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* File Changes */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Changed Files</h2>

            {commitChanges.changes.map((change, index) => (
              <div key={index} className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
                {/* File Header */}
                <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">{change.filename}</span>
                      <Badge className={`text-xs ${getStatusColor(change.status)}`}>
                        {getStatusIcon(change.status)}
                        <span className="ml-1">{change.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="text-green-600">+{change.additions}</span>
                      <span className="text-red-600">-{change.deletions}</span>
                    </div>
                  </div>
                </div>

                {/* Diff Content */}
                <div className="p-0">
                  <pre className="text-sm font-mono overflow-x-auto">
                    <code className="block">
                      {change.diff.split("\n").map((line, lineIndex) => (
                        <div
                          key={lineIndex}
                          className={`px-4 py-1 ${
                            line.startsWith("+") && !line.startsWith("+++")
                              ? "bg-green-50 text-green-800"
                              : line.startsWith("-") && !line.startsWith("---")
                                ? "bg-red-50 text-red-800"
                                : line.startsWith("@@")
                                  ? "bg-blue-50 text-blue-800 font-medium"
                                  : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {line || " "}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {commitChanges.filesChanged} changed files with{" "}
                <span className="text-green-600 font-medium">{commitChanges.additions} additions</span> and{" "}
                <span className="text-red-600 font-medium">{commitChanges.deletions} deletions</span>
              </span>
              <span>{commitChanges.date}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
