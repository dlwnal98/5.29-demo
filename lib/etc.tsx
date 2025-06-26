import {
  File,
  Folder,
  CircleAlert,
  ImageIcon,
  Code,
  Archive,
} from "lucide-react";

export function formatTimeAgo(isoTime: string): string {
  const now = new Date();
  const target = new Date(isoTime);

  // 날짜 유효성 검사
  if (!isoTime || isNaN(target.getTime())) {
    return "";
  }

  // UTC -> KST (UTC+9)
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + KST_OFFSET);
  const localTarget = new Date(target.getTime() + KST_OFFSET);

  const diffMs = localNow.getTime() - localTarget.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  const nowDate = localNow.toISOString().split("T")[0];
  const targetDate = localTarget.toISOString().split("T")[0];

  const yesterday = new Date(localNow);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split("T")[0];

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
  if (type === "dir") {
    return <Folder className="h-4 w-4 text-blue-500 " />;
  }

  switch (extension) {
    case "md":
      return <CircleAlert className="h-4 w-4 text-indigo-500" />;
    case "json":
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "yml":
    case "yaml":
    case "properties":
      return <Code className="h-4 w-4 text-amber-500" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    case "zip":
    case "tar":
    case "gz":
      return <Archive className="h-4 w-4 text-purple-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
}

export function goToBaseProjectUrl() {
  const currentUrl = new URL(window.location.href);
  const pathname = currentUrl.pathname;

  // 1. 경로에서 "/view" 제거
  const newPath = pathname.replace(/\/view$/, "");

  // 2. 쿼리스트링에서 "file" 제거
  const params = currentUrl.searchParams;
  params.delete("file");

  // 3. 최종 URL 생성
  const newUrl = `${newPath}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  // 4. 새로고침하며 이동
  window.location.href = newUrl;
}
