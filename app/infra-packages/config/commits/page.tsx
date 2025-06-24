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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar } from "@/components/ui/avatar"
import { ArrowLeft, GitCommit, GitBranch, Copy, ExternalLink } from "lucide-react"
import { useSearchParams } from "next/navigation"

// 샘플 커밋 데이터
const commitHistory = [
  {
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
  },
  {
    hash: "f6g7h8i9j0k",
    shortHash: "f6g7h8i",
    message: "Add new authentication middleware",
    author: "john-doe",
    email: "john@example.com",
    time: "1 day ago",
    date: "2024-01-14 09:15:00",
    filesChanged: 5,
    additions: 120,
    deletions: 15,
  },
  {
    hash: "l1m2n3o4p5q",
    shortHash: "l1m2n3o",
    message: "Fix responsive design issues on mobile",
    author: "mike-wilson",
    email: "mike@example.com",
    time: "2 days ago",
    date: "2024-01-13 16:45:00",
    filesChanged: 8,
    additions: 45,
    deletions: 32,
  },
  {
    hash: "r6s7t8u9v0w",
    shortHash: "r6s7t8u",
    message: "Implement user profile management",
    author: "sarah-jones",
    email: "sarah@example.com",
    time: "3 days ago",
    date: "2024-01-12 11:20:00",
    filesChanged: 12,
    additions: 200,
    deletions: 50,
  },
  {
    hash: "x1y2z3a4b5c",
    shortHash: "x1y2z3a",
    message: "Initial project setup and configuration",
    author: "john-doe",
    email: "john@example.com",
    time: "1 week ago",
    date: "2024-01-08 10:00:00",
    filesChanged: 20,
    additions: 500,
    deletions: 0,
  },
]

export default function CommitsPage() {
  const searchParams = useSearchParams()
  const branch = searchParams.get("branch") || "main"
  const path = searchParams.get("path") || ""

  const handleCommitClick = (commit: any) => {
    const params = new URLSearchParams()
    params.set("branch", branch)
    params.set("commit", commit.hash)
    if (path) params.set("path", path)
    window.location.href = `/infra-packages/config/commit?${params.toString()}`
  }

  const handleBack = () => {
    const params = new URLSearchParams()
    params.set("branch", branch)
    if (path) params.set("path", path)
    window.location.href = `/infra-packages/config?${params.toString()}`
  }

  const breadcrumbItems = [
    { name: "/", href: "/" },
    { name: "config", href: `/infra-packages/config` },
    { name: "Commits", href: "" },
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

          {/* Commit History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Commit History</h1>
              <p className="text-sm text-gray-500">{commitHistory.length} commits</p>
            </div>

            <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-blue-100">
                    <TableHead className="w-[50px] text-blue-700 font-semibold">Author</TableHead>
                    <TableHead className="w-[120px] text-blue-700 font-semibold">Name</TableHead>
                    <TableHead className="w-[100px] text-blue-700 font-semibold">Commit</TableHead>
                    <TableHead className="text-blue-700 font-semibold">Message</TableHead>
                    <TableHead className="w-[120px] text-blue-700 font-semibold">Date</TableHead>
                    <TableHead className="w-[100px] text-blue-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commitHistory.map((commit, index) => (
                    <TableRow
                      key={commit.hash}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <TableCell>
                        <Avatar className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                          {commit.author.charAt(0).toUpperCase()}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-sm">{commit.author}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <GitCommit className="h-3 w-3 text-gray-400" />
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{commit.shortHash}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleCommitClick(commit)}
                          className="text-sm hover:text-blue-600 transition-colors text-left w-full"
                        >
                          {commit.message}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{commit.time}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(commit.hash)
                            }}
                            className="hover:bg-blue-100 p-1 h-auto"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCommitClick(commit)
                            }}
                            className="hover:bg-blue-100 p-1 h-auto"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
