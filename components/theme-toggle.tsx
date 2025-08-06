"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-[64px] h-[32px] bg-neutral-200 rounded-full animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={handleToggle}
      className="relative block  top-[-7px] w-full h-[32px] rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300 flex items-center"
      aria-label="Toggle Theme"
      style={{ padding: 0 }}
    >
      {/* Sun Icon (왼쪽) */}
      <span className="flex items-center justify-center w-1/2 h-full z-20">
        <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />
      </span>
      {/* Moon Icon (오른쪽) */}
      <span className="flex items-center justify-center w-1/2 h-full z-20">
        <Moon className="w-5 h-5 text-neutral-600" />
      </span>
      {/* 토글 원 */}
      <div
        className={`absolute top-0.5 left-1 w-[50%] h-7 bg-white z-10 rounded-full shadow transition-transform duration-300 ${
          isDark ? "translate-x-[99%]" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export function CollapseThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-[64px] h-[32px] bg-neutral-200 rounded-full animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={handleToggle}
      className="relative top-[-10px] flex flex-col items-center w-8 h-[60px] rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300 flex items-center"
      aria-label="Toggle Theme"
      style={{ padding: 0 }}
    >
      {/* Sun Icon (왼쪽) */}
      <span className="flex items-center justify-center w-1/2 h-full z-20">
        <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />
      </span>
      {/* Moon Icon (오른쪽) */}
      <span className="flex items-center justify-center w-1/2 h-full z-20">
        <Moon className="w-5 h-5 text-neutral-600" />
      </span>
      {/* 토글 원 */}
      <div
        className={`absolute top-0.5 left-0.5 w-7 h-7 bg-white z-10 rounded-full shadow transition-transform duration-300 ${
          isDark ? "translate-y-[99%]" : "translate-y-0"
        }`}
      />
    </button>
  )
}
