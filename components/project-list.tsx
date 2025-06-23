"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Star,
  GitFork,
  Calendar,
  Users,
  Lock,
  Globe,
  MoreVertical,
  Eye,
  Settings,
  Trash2,
  GitBranch,
  Activity,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";

// 샘플 프로젝트 데이터
const projectsData = [
  {
    id: 1,
    name: "my-project",
    slug: "my-project",
    description: "A modern web application built with Next.js and React",
    visibility: "public",
    language: "TypeScript",
    stars: 24,
    forks: 8,
    lastUpdated: "2 days ago",
    contributors: 5,
    branches: 8,
    commits: 1247,
    issues: 12,
    pullRequests: 3,
    avatar: "MP",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: 2,
    name: "e-commerce-platform",
    slug: "e-commerce-platform",
    description: "Full-stack e-commerce solution with payment integration",
    visibility: "private",
    language: "JavaScript",
    stars: 156,
    forks: 42,
    lastUpdated: "1 day ago",
    contributors: 12,
    branches: 15,
    commits: 2834,
    issues: 28,
    pullRequests: 7,
    avatar: "EP",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    name: "mobile-app",
    slug: "mobile-app",
    description: "Cross-platform mobile application using React Native",
    visibility: "public",
    language: "React Native",
    stars: 89,
    forks: 23,
    lastUpdated: "3 days ago",
    contributors: 8,
    branches: 12,
    commits: 1567,
    issues: 15,
    pullRequests: 5,
    avatar: "MA",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "data-analytics",
    slug: "data-analytics",
    description: "Advanced data analytics dashboard with real-time insights",
    visibility: "private",
    language: "Python",
    stars: 67,
    forks: 19,
    lastUpdated: "5 days ago",
    contributors: 6,
    branches: 9,
    commits: 892,
    issues: 8,
    pullRequests: 2,
    avatar: "DA",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "design-system",
    slug: "design-system",
    description: "Comprehensive design system and component library",
    visibility: "public",
    language: "CSS",
    stars: 234,
    forks: 78,
    lastUpdated: "1 week ago",
    contributors: 15,
    branches: 6,
    commits: 456,
    issues: 5,
    pullRequests: 1,
    avatar: "DS",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 6,
    name: "api-gateway",
    slug: "api-gateway",
    description:
      "Microservices API gateway with authentication and rate limiting",
    visibility: "private",
    language: "Go",
    stars: 45,
    forks: 12,
    lastUpdated: "2 weeks ago",
    contributors: 4,
    branches: 7,
    commits: 678,
    issues: 3,
    pullRequests: 0,
    avatar: "AG",
    color: "from-indigo-500 to-purple-500",
  },
];

export function ProjectList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterBy, setFilterBy] = useState("all");
  const router = useRouter();

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterBy === "all") return matchesSearch;
    if (filterBy === "public")
      return matchesSearch && project.visibility === "public";
    if (filterBy === "private")
      return matchesSearch && project.visibility === "private";

    return matchesSearch;
  });

  const handleProjectClick = (slug: string) => {
    window.location.href = `/infra-packages/config/${slug}`;
  };

  const handleNewProject = () => {
    router.push("/new-project");
  };

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Your Projects
          </h1>
          <p className="text-muted-foreground">
            Manage and explore your repositories
          </p>
        </div> */}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterBy("all")}>
                  All Projects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("public")}>
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("private")}>
                  <Lock className="h-4 w-4 mr-2" />
                  Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode */}
            <div className="flex border border-blue-200 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-blue-50"
                }
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-blue-50"
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* New Project */}
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              onClick={handleNewProject}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-blue-200/50 bg-white/70 backdrop-blur-sm hover:bg-white/80"
                onClick={() => handleProjectClick(project.slug)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-10 w-10 bg-gradient-to-br ${project.color} rounded-lg flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-white text-sm font-bold">
                          {project.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {project.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              project.visibility === "public"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {project.visibility === "public" ? (
                              <Globe className="h-3 w-3 mr-1" />
                            ) : (
                              <Lock className="h-3 w-3 mr-1" />
                            )}
                            {project.visibility}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.language}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 line-clamp-2">
                    {project.description}
                  </CardDescription>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {project.stars}
                      </span>
                      <span className="flex items-center">
                        <GitFork className="h-3 w-3 mr-1 text-blue-500" />
                        {project.forks}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-green-500" />
                        {project.contributors}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated {project.lastUpdated}
                    </span>
                    <span className="flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      {project.commits} commits
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-blue-200/50 bg-white/70 backdrop-blur-sm hover:bg-white/80"
                onClick={() => handleProjectClick(project.slug)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`h-12 w-12 bg-gradient-to-br ${project.color} rounded-lg flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-white font-bold">
                          {project.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold truncate">
                            {project.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              project.visibility === "public"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {project.visibility === "public" ? (
                              <Globe className="h-3 w-3 mr-1" />
                            ) : (
                              <Lock className="h-3 w-3 mr-1" />
                            )}
                            {project.visibility}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.language}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2 line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {project.stars}
                          </span>
                          <span className="flex items-center">
                            <GitFork className="h-3 w-3 mr-1 text-blue-500" />
                            {project.forks}
                          </span>
                          <span className="flex items-center">
                            <GitBranch className="h-3 w-3 mr-1 text-purple-500" />
                            {project.branches} branches
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-green-500" />
                            {project.contributors} contributors
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Updated {project.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first project"}
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={handleNewProject}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Showing {filteredProjects.length} of {projectsData.length} projects
          </p>
        </div>
      </div>
    </div>
  );
}
