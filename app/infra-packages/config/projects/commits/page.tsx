'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, GitCommit, GitBranch, Copy, ExternalLink, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useFetchFileCommitList } from '@/hooks/use-config-data';
import { RollbackConfirmationModal } from '@/components/rollback-confirmation-modal';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { formatTimeAgo } from '@/lib/etc';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommitsPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get('branch') || 'main';
  const dir = searchParams.get('dir') || '';
  const fileName = searchParams.get('file') || '';

  // 파일 별 커밋 이력 조회
  const { data: commitListData, isLoading } = useFetchFileCommitList(
    'admin',
    'configs_repo',
    branch,
    fileName // 파일 이름
  );

  console.log(fileName);

  const latestCommitArr = commitListData?.[0];
  const latestCommit = latestCommitArr?.sha?.slice(0, 6);

  const handleCommitClick = (commitHash: any) => {
    console.log(commitHash);
    const params = new URLSearchParams();
    params.set('branch', branch);
    params.set('file', fileName);
    params.set('commit', commitHash);
    params.set('latest', latestCommit || '');

    if (dir) params.set('dir', dir);
    window.location.href = `/infra-packages/config/projects/commit?${params.toString()}`;
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set('branch', branch);
    params.set('file', fileName);
    if (dir) params.set('dir', dir);
    window.location.href = `/infra-packages/config/projects/view?${params.toString()}`;
  };

  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/commits$/, '');

  // 2. 쿼리스트링에서 "file" 제거
  const params = currentUrl.searchParams;
  params.delete('file');
  params.delete('dir');

  // 3. 최종 URL 생성
  const newUrl = `${newPath}${params.toString() ? `?${params.toString()}` : ''}`;
  // 동적으로 breadcrumb 생성
  const generateBreadcrumbItems = () => {
    const items = [
      {
        name: 'config',
        href: newUrl,
      },
    ];
    const commitsUrl = {
      name: 'commits',
      href: '',
    };

    // 디렉토리가 있는 경우
    if (dir) {
      items.push({
        name: dir,
        href: `/infra-packages/config/projects?branch=${branch}&dir=${dir}`,
      });
    }

    // 파일명이 있는 경우
    if (fileName) {
      items.push({
        name: fileName,
        href: `/infra-packages/config/projects/view?branch=${branch}&dir=${dir}&file=${fileName}`,
      });
    }

    return [...items, commitsUrl];
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <AppLayout projectSlug="config">
      <div className="bg-transparent">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-blue-200 hover:bg-blue-50"
              >
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
              <p className="text-sm text-gray-500">
                {isLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  `${commitListData?.length || 0} commits`
                )}
              </p>
            </div>

            <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-blue-100">
                    <TableHead className="w-[150px] text-blue-700 font-semibold">Name</TableHead>
                    <TableHead className="w-[100px] text-blue-700 font-semibold">Commit</TableHead>
                    <TableHead className="text-blue-700 font-semibold">Message</TableHead>
                    <TableHead className="w-[120px] text-blue-700 font-semibold text-right">
                      Date
                    </TableHead>
                    {/* <TableHead className="w-[100px] text-blue-700 font-semibold">
                      Actions
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // 스켈레톤 UI - 5개의 로딩 행 표시
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <Skeleton className="h-7 w-7 rounded-full" />
                            <Skeleton className="h-4 w-20 ml-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full max-w-md" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : commitListData && commitListData.length > 0 ? (
                    <>
                      {commitListData.map((commit, index) => (
                        <TableRow
                          key={commit.sha}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <TableCell className=" flex items-center">
                            <Avatar className="h-7 w-7 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                              {commit.authorName.charAt(0).toUpperCase()}
                            </Avatar>
                            <span className="font-medium text-sm ml-[8px]">
                              {commit.authorName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <code className="flex items-center space-x-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              <GitCommit className="h-3 w-3 text-gray-400" />
                              {commit.sha.slice(0, 6)}
                            </code>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleCommitClick(commit.sha.slice(0, 6))}
                              className="text-sm hover:text-blue-600 transition-colors text-left w-full"
                            >
                              {commit.message}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm text-gray-500 text-right">
                              {formatTimeAgo(commit.commitTime)}
                            </span>
                          </TableCell>
                          {/* <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(commit.sha);
                                }}
                                className="hover:bg-blue-100 p-1 h-auto"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommitClick(commit);
                                }}
                                className="hover:bg-blue-100 p-1 h-auto"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                          
                            </div>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        커밋 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
