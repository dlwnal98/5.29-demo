"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FolderGit2,
  Globe,
  Lock,
  Rocket,
  Waves,
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpen,
  Database,
  LayoutDashboard,
  ShoppingCart,
  Smartphone,
  Server,
} from "lucide-react";
import Link from "next/link";

// 프로젝트 템플릿 데이터
const projectTemplates = [
  {
    id: "empty",
    name: "Empty Project",
    description: "Start with a clean slate",
    icon: <FolderGit2 className="h-8 w-8 text-blue-600" />,
    popular: false,
  },
  {
    id: "web-app",
    name: "Web Application",
    description: "Next.js with React and Tailwind CSS",
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    popular: true,
  },
  {
    id: "api",
    name: "API Service",
    description: "RESTful API with Express and MongoDB",
    icon: <Server className="h-8 w-8 text-indigo-600" />,
    popular: false,
  },
  {
    id: "mobile",
    name: "Mobile App",
    description: "React Native with TypeScript",
    icon: <Smartphone className="h-8 w-8 text-purple-600" />,
    popular: false,
  },
  {
    id: "e-commerce",
    name: "E-commerce",
    description: "Online store with payment integration",
    icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
    popular: true,
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Analytics and management interface",
    icon: <LayoutDashboard className="h-8 w-8 text-orange-600" />,
    popular: false,
  },
  {
    id: "docs",
    name: "Documentation",
    description: "Technical documentation site",
    icon: <BookOpen className="h-8 w-8 text-red-600" />,
    popular: false,
  },
  {
    id: "database",
    name: "Database Project",
    description: "Database design and management",
    icon: <Database className="h-8 w-8 text-cyan-600" />,
    popular: false,
  },
];

export function NewProjectForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 프로젝트 정보 상태
  const [projectData, setProjectData] = useState({
    name: "",
    slug: "",
    description: "",
    visibility: "public",
    template: "empty",
    initializeWithReadme: true,
    gitIgnore: true,
    license: "mit",
  });

  // 프로젝트명 변경 시 자동으로 슬러그 생성
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProjectData({
      ...projectData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    });
  };

  // 슬러그 직접 수정
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectData({
      ...projectData,
      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    });
  };

  // 다음 단계로 이동
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!projectData.name.trim()) {
        setError("Project name is required");
        return;
      }
      if (!projectData.slug.trim()) {
        setError("Project slug is required");
        return;
      }
    }

    setError("");
    setCurrentStep(currentStep + 1);
  };

  // 이전 단계로 이동
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  // 프로젝트 생성 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // 여기서 실제 프로젝트 생성 API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 시뮬레이션

      setSuccess(true);
      setTimeout(() => {
        // 생성된 프로젝트로 리다이렉트
        window.location.href = `/config/${projectData.slug}`;
      }, 1500);
    } catch (err) {
      setError("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 단계 표시기 */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Create New Project
        </h1>
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? "bg-blue-600" : "bg-gray-200"
              } text-white font-bold`}
            >
              {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <div
              className={`w-10 h-1 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              } text-white font-bold`}
            >
              {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <div
              className={`w-10 h-1 ${
                currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
              } text-white font-bold`}
            >
              3
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center mt-2">
          <div className="flex text-sm text-gray-600">
            <span className="w-10 text-center">Info</span>
            <span className="w-20"></span>
            <span className="w-10 text-center">Template</span>
            <span className="w-20"></span>
            <span className="w-10 text-center">Setup</span>
          </div>
        </div> */}
      </div>

      {/* 단계별 폼 */}
      <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {/* 단계 1: 기본 정보 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Project Name *
                  </Label>
                  <Input
                    id="name"
                    value={projectData.name}
                    onChange={handleNameChange}
                    placeholder="My Awesome Project"
                    className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Choose a descriptive name for your project
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Project Slug *
                  </Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/</span>
                    <Input
                      id="slug"
                      value={projectData.slug}
                      onChange={handleSlugChange}
                      placeholder="my-awesome-project"
                      className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    This will be used in URLs and file paths. Use lowercase
                    letters, numbers, and hyphens only.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Briefly describe your project"
                    className="min-h-24 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <p className="text-xs text-gray-500">
                    A good description helps others understand your project's
                    purpose
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Visibility</Label>
                  <RadioGroup
                    value={projectData.visibility}
                    onValueChange={(value) =>
                      setProjectData({ ...projectData, visibility: value })
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border border-blue-200 p-4 hover:bg-blue-50">
                      <RadioGroupItem
                        value="public"
                        id="public"
                        className="border-blue-400"
                      />
                      <Label
                        htmlFor="public"
                        className="flex items-center cursor-pointer"
                      >
                        <Globe className="h-5 w-5 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Public</div>
                          <div className="text-sm text-gray-500">
                            Anyone can see this repository
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border border-blue-200 p-4 hover:bg-blue-50">
                      <RadioGroupItem
                        value="private"
                        id="private"
                        className="border-blue-400"
                      />
                      <Label
                        htmlFor="private"
                        className="flex items-center cursor-pointer"
                      >
                        <Lock className="h-5 w-5 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Private</div>
                          <div className="text-sm text-gray-500">
                            You choose who can see and commit to this repository
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* 단계 2: 템플릿 선택 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-900">
                    Choose a Template
                  </h2>
                  <p className="text-gray-600">
                    Select a starting point for your project
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        projectData.template === template.id
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                      onClick={() =>
                        setProjectData({
                          ...projectData,
                          template: template.id,
                        })
                      }
                    >
                      <div className="flex-shrink-0 mt-1">{template.icon}</div>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <h3 className="font-medium">{template.name}</h3>
                          {template.popular && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.description}
                        </p>
                      </div>
                      {projectData.template === template.id && (
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 단계 3: 최종 설정 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-900">
                    Final Setup
                  </h2>
                  <p className="text-gray-600">
                    Configure additional options for your project
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="readme"
                      checked={projectData.initializeWithReadme}
                      onCheckedChange={(checked) =>
                        setProjectData({
                          ...projectData,
                          initializeWithReadme: checked as boolean,
                        })
                      }
                      className="border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                    />
                    <div>
                      <Label
                        htmlFor="readme"
                        className="font-medium cursor-pointer"
                      >
                        Initialize with a README
                      </Label>
                      <p className="text-sm text-gray-600">
                        Add a README file to help others understand your project
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="gitignore"
                      checked={projectData.gitIgnore}
                      onCheckedChange={(checked) =>
                        setProjectData({
                          ...projectData,
                          gitIgnore: checked as boolean,
                        })
                      }
                      className="border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                    />
                    <div>
                      <Label
                        htmlFor="gitignore"
                        className="font-medium cursor-pointer"
                      >
                        Add .gitignore
                      </Label>
                      <p className="text-sm text-gray-600">
                        Create a .gitignore file to specify which files Git
                        should ignore
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="license" className="text-sm font-medium">
                      License
                    </Label>
                    <Select
                      value={projectData.license}
                      onValueChange={(value) =>
                        setProjectData({ ...projectData, license: value })
                      }
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Choose a license" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mit">MIT License</SelectItem>
                        <SelectItem value="apache">
                          Apache License 2.0
                        </SelectItem>
                        <SelectItem value="gpl">
                          GNU General Public License v3.0
                        </SelectItem>
                        <SelectItem value="bsd">
                          BSD 3-Clause License
                        </SelectItem>
                        <SelectItem value="none">No License</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      A license tells others what they can and cannot do with
                      your code
                    </p>
                  </div>
                </div>

                {/* 프로젝트 요약 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Project Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Name:</div>
                    <div className="font-medium">{projectData.name}</div>

                    <div className="text-gray-600">Slug:</div>
                    <div className="font-medium">/{projectData.slug}</div>

                    <div className="text-gray-600">Visibility:</div>
                    <div className="font-medium flex items-center">
                      {projectData.visibility === "public" ? (
                        <>
                          <Globe className="h-3 w-3 mr-1 text-blue-600" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1 text-blue-600" />
                          Private
                        </>
                      )}
                    </div>

                    <div className="text-gray-600">Template:</div>
                    <div className="font-medium">
                      {
                        projectTemplates.find(
                          (t) => t.id === projectData.template
                        )?.name
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 에러/성공 메시지 */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mt-6">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 mt-6">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Project created successfully! Redirecting...
                </span>
              </div>
            )}

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
