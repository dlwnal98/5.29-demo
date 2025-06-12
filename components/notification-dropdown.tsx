"use client"

import * as React from "react"
import { Bell, CheckCircle2, XCircle, Clock, X, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "error" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
  severity?: "high" | "medium" | "low"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "error",
    title: "API Gateway 연결 실패",
    message: "Gateway 서버와의 연결이 끊어졌습니다. 네트워크 상태를 확인해주세요.",
    timestamp: "2분 전",
    read: false,
    severity: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "메모리 사용량 경고",
    message: "시스템 메모리 사용량이 85%를 초과했습니다. 성능에 영향을 줄 수 있습니다.",
    timestamp: "5분 전",
    read: false,
    severity: "medium",
  },
  {
    id: "3",
    type: "error",
    title: "데이터베이스 연결 오류",
    message: "Primary 데이터베이스 연결에 실패했습니다. Failover가 활성화되었습니다.",
    timestamp: "8분 전",
    read: false,
    severity: "high",
  },
  {
    id: "4",
    type: "info",
    title: "시스템 업데이트 알림",
    message: "새로운 보안 업데이트가 사용 가능합니다. 유지보수 시간에 적용 예정입니다.",
    timestamp: "15분 전",
    read: true,
    severity: "low",
  },
  {
    id: "5",
    type: "success",
    title: "백업 완료",
    message: "일일 데이터베이스 백업이 성공적으로 완료되었습니다.",
    timestamp: "1시간 전",
    read: true,
    severity: "low",
  },
  {
    id: "6",
    type: "warning",
    title: "디스크 공간 부족",
    message: "서버 디스크 사용량이 90%를 초과했습니다. 정리가 필요합니다.",
    timestamp: "2시간 전",
    read: true,
    severity: "medium",
  },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = React.useState(mockNotifications)
  const [isOpen, setIsOpen] = React.useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const highPriorityUnread = notifications.filter((n) => !n.read && n.severity === "high").length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
      case "low":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative hover:bg-red-100 dark:hover:bg-red-900`}
        >
          <Bell className={`h-4 w-4 ${unreadCount > 0 ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={`absolute -top-0.5 -right-1 h-4 w-4 rounded-full p-0 pb-[1px] text-[11px] flex items-center justify-center ${
                highPriorityUnread > 0 ? "animate-bounce bg-red-600" : "bg-red-500"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">시스템 알림</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount}개 읽지 않음
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs hover:bg-blue-100 dark:hover:bg-gray-800"
            >
              모두 읽음
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">새로운 알림이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-4 ${getSeverityColor(
                    notification.severity || "low",
                  )} ${!notification.read ? "bg-blue-50/50 dark:bg-blue-950/10" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                            {notification.severity && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  notification.severity === "high"
                                    ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                                    : notification.severity === "medium"
                                      ? "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
                                      : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                }`}
                              >
                                {notification.severity === "high"
                                  ? "높음"
                                  : notification.severity === "medium"
                                    ? "보통"
                                    : "낮음"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 ml-2"
                          onClick={(e) => removeNotification(notification.id, e)}
                        >
                          <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                        </Button>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-3 right-8 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-blue-100 dark:hover:bg-gray-800">
                모든 알림 보기
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
