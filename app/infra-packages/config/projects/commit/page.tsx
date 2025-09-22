'use client';

import React from 'react';
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
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, GitBranch, Copy, File, Plus, Minus, RotateCcw, GitCommit } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  useFetchFileCommitDetail,
  useFetchFileCommitList,
  useFetchFileDiff,
} from '@/hooks/use-config-data';
import { RollbackConfirmationModal } from '@/components/rollback-confirmation-modal';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/lib/etc';
import { Skeleton } from '@/components/ui/skeleton';

function parseDiffLines(diffLines: string[]) {
  const result: {
    left?: string;
    right?: string;
    type: 'add' | 'del' | 'context' | 'change';
  }[] = [];
  let i = 0;
  while (i < diffLines.length) {
    const line = diffLines[i];
    if (line.startsWith('-') && !line.startsWith('---')) {
      // 삭제 라인
      if (diffLines[i + 1]?.startsWith('+') && !diffLines[i + 1]?.startsWith('+++')) {
        // 바로 다음이 추가 라인인 경우
        result.push({ left: line, right: diffLines[i + 1], type: 'change' });
        i += 2;
      } else {
        result.push({ left: line, type: 'del' });
        i += 1;
      }
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      // 추가 라인 (이미 위에서 처리된 경우는 제외)
      result.push({ right: line, type: 'add' });
      i += 1;
    } else {
      // context 라인
      result.push({ left: line, right: line, type: 'context' });
      i += 1;
    }
  }
  return result;
}

export default function CommitPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get('branch') || 'main';
  const commitOldHash = searchParams.get('commit') || '';
  const commitNewHash = searchParams.get('latest') || '';
  const dir = searchParams.get('dir') || '';
  const fileName = searchParams.get('file') || '';

  const { data: commitListData } = useFetchFileCommitList(
    'admin',
    'configs_repo',
    branch,
    fileName // 파일 이름
  );

  const selectShaArr =
    commitListData?.filter((list) => list.sha.slice(0, 6) === commitOldHash) ?? [];
  const selectSha = selectShaArr[0]?.sha;

  const latestShaArr =
    commitListData?.filter((list) => list.sha.slice(0, 6) === commitNewHash) ?? [];
  const latestSha = latestShaArr[0]?.sha;

  const { data: commitDetailData, isLoading: isCommitDetailLoading } = useFetchFileCommitDetail(
    'admin',
    'configs_repo',
    selectSha // sha
  );

  const { data: fileDiffData, isLoading: isFileDiffLoading } = useFetchFileDiff(
    'admin',
    'configs_repo',
    fileName, // path : 파일 이름
    selectSha,
    latestSha
  );

  const [rollbackModal, setRollbackModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  const handleRollbackClick = () => {
    setRollbackModal({ isOpen: true });
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set('branch', branch);
    params.set('file', fileName);
    if (dir) params.set('dir', dir);
    window.location.href = `/infra-packages/config/projects/commits?${params.toString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added':
        return 'text-green-600 bg-green-50';
      case 'deleted':
        return 'text-red-600 bg-red-50';
      case 'modified':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <Plus className="h-3 w-3" />;
      case 'deleted':
        return <Minus className="h-3 w-3" />;
      case 'modified':
        return <File className="h-3 w-3" />;
      default:
        return <File className="h-3 w-3" />;
    }
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
    const commitUrl = [
      {
        name: 'commits',
        href: `/infra-packages/config/projects/commits?branch=${branch}&dir=${dir}&file=${fileName}`,
      },
      {
        name: 'commit',
        href: '',
      },
    ];

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

    return [...items, ...commitUrl];
  };

  const breadcrumbItems = generateBreadcrumbItems();

  const parsedDiff = fileDiffData ? parseDiffLines(fileDiffData) : [];

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
                className="border-blue-200 hover:bg-blue-50">
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
                {isCommitDetailLoading ? (
                  <Skeleton className="h-10 w-10 rounded-full" />
                ) : (
                  <Avatar className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                    {commitDetailData?.author?.username.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <div className="flex items-center space-x-4">
                  {isCommitDetailLoading ? (
                    <>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">
                        {commitDetailData?.author?.username}
                      </span>
                      <code className="flex items-center bg-white px-2 py-1 rounded font-mono text-sm">
                        <GitCommit className="h-3 w-3 text-gray-400" />
                        {commitDetailData?.sha?.slice(0, 6)}
                      </code>
                      <span className="text-gray-900">{commitDetailData?.commit?.message}</span>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(commitDetailData?.created)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isCommitDetailLoading ? (
                  <>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </>
                ) : (
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{commitDetailData?.stats?.filesChanged} files changed</span>
                    <span className="text-green-600">+{commitDetailData?.stats?.additions}</span>
                    <span className="text-red-600">-{commitDetailData?.stats?.deletions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Changes */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Changed Files</h2>

            <div className="border border-blue-200/50 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm">
              {/* File Header */}
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-500" />
                    {isCommitDetailLoading ? (
                      <>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16" />
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-gray-900">
                          {commitDetailData?.files[0]?.filename}
                        </span>
                        <Badge
                          className={`text-xs ${getStatusColor(
                            commitDetailData?.files[0]?.status
                          )}`}>
                          <span className="ml-1">{commitDetailData?.files[0]?.status}</span>
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {!isCommitDetailLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRollbackClick();
                        }}
                        className="hover:bg-red-100 p-1 h-auto text-red-600 hover:text-red-700">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Diff Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 text-sm font-mono overflow-x-auto">
                  {isFileDiffLoading ? (
                    // 스켈레톤 UI - diff 레이아웃과 동일하게 구성
                    <>
                      <div className="font-bold border-b px-2 py-1">이전</div>
                      <div className="font-bold border-b px-2 py-1">변경</div>
                      {/* 10개의 스켈레톤 행 표시 */}
                      {Array.from({ length: 10 }).map((_, index) => (
                        <React.Fragment key={index}>
                          <div className="px-2 py-1">
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="px-2 py-1">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  ) : parsedDiff?.length === 0 ? (
                    <>변경 이력이 없습니다</>
                  ) : (
                    <>
                      <div className="font-bold border-b px-2 py-1">이전</div>
                      <div className="font-bold border-b px-2 py-1">변경</div>
                      {parsedDiff.map((row, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className={`px-2 py-1 whitespace-pre ${
                              row.type === 'del' || row?.type === 'change'
                                ? 'bg-red-50 text-red-800'
                                : row.type === 'context'
                                  ? 'bg-gray-50 text-gray-700'
                                  : ''
                            }`}>
                            {row.left || ''}
                          </div>
                          <div
                            className={`px-2 py-1 whitespace-pre ${
                              row.type === 'add' || row?.type === 'change'
                                ? 'bg-green-50 text-green-800'
                                : row.type === 'context'
                                  ? 'bg-gray-50 text-gray-700'
                                  : ''
                            }`}>
                            {row.right || ''}
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Rollback Modal */}
      <RollbackConfirmationModal
        isOpen={rollbackModal.isOpen}
        onClose={() => setRollbackModal({ isOpen: false })}
        branch={branch}
        fileName={fileName}
        commitHash={selectSha || ''}
        commitMessage={commitDetailData?.commit?.message || ''}
        // onConfirm={handleRollbackConfirm}
      />
    </AppLayout>
  );
}
