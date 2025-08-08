import { File, Folder, CircleAlert, ImageIcon, Code, Archive } from 'lucide-react';

export function formatTimeAgo(isoTime: string): string {
  const now = new Date();
  const target = new Date(isoTime);

  // 날짜 유효성 검사
  if (!isoTime || isNaN(target.getTime())) {
    return '';
  }

  // UTC -> KST (UTC+9)
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + KST_OFFSET);
  const localTarget = new Date(target.getTime() + KST_OFFSET);

  const diffMs = localNow.getTime() - localTarget.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  const nowDate = localNow.toISOString().split('T')[0];
  const targetDate = localTarget.toISOString().split('T')[0];

  const yesterday = new Date(localNow);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split('T')[0];

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (targetDate === yesterdayDate) {
    return `어제`;
  } else {
    return targetDate;
  }
}

export function getFileIcon(type: string, extension?: string) {
  if (type === 'dir') {
    return <Folder className="h-4 w-4 text-blue-500 " />;
  }

  switch (extension) {
    case 'md':
      return <CircleAlert className="h-4 w-4 text-indigo-500" />;
    case 'json':
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'yml':
    case 'yaml':
    case 'properties':
      return <Code className="h-4 w-4 text-amber-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    case 'zip':
    case 'tar':
    case 'gz':
      return <Archive className="h-4 w-4 text-purple-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
}

export function goToBaseProjectUrl() {
  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/view$/, '');

  // 2. 쿼리스트링에서 "file" 제거
  const params = currentUrl.searchParams;
  params.delete('file');

  // 3. 최종 URL 생성
  const newUrl = `${newPath}${params.toString() ? `?${params.toString()}` : ''}`;

  // 4. 새로고침하며 이동
  window.location.href = newUrl;
}

// 메소드 별 색상 지정
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export function getMethodStyle(method: HttpMethod): string {
  const base = 'text-[11px] font-medium px-2.5 py-0.5 rounded border';

  const styles: Record<HttpMethod, string> = {
    GET: `${base} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500`,
    POST: `${base} bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-300  border-blue-300  dark:border-blue-500`,
    PUT: `${base} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500`,
    DELETE: `${base} bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-300   border-red-300   dark:border-red-500`,
    PATCH: `${base} bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500`,
    OPTIONS: `${base} bg-gray-100  dark:bg-gray-900/30  text-gray-700  dark:text-gray-300  border-gray-300  dark:border-gray-500`,
    HEAD: `${base} bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500`,
  };

  return styles[method] ?? base;
}

// 정규식은 나중에 정책 정해서

// 아무문자 가능 + 4글자
export const userIdRegex = /^.{4,}$/;
export const passwordRegex = /^.{4,}$/;
// // 아이디 유효성 검사
// export function validateUsername(username: string) {
//   // 영문 소문자로 시작 + 5~20자
//   const usernameRegex = /^[a-z][a-z0-9_]{3,11}$/;
//   return usernameRegex.test(username);
// }

// // 비밀번호 유효성 검사
// export function validatePassword(password: string) {
//   // 영문 소문자, 숫자, 특수문자 중 2종이상 포함 + 8~20자 + 공백 불가
//   const regex =
//     /^(?=(?:.*[a-z])(?:.*\d)|(?:.*[a-z])(?:.*[!@#$%^&*])|(?:.*\d)(?:.*[!@#$%^&*]))[a-z\d!@#$%^&*]{8,20}$/;
//   return regex.test(password);
// }
