import { useState, useRef } from "react";
import { Activity, Server } from "lucide-react";

interface TabMenuType {
  activeTab: string;
  onTabChange: (any: string) => void;
}

export default function TabMenu({ activeTab, onTabChange }: TabMenuType) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-8">
        <button
          onClick={() => onTabChange("overview")}
          className={`py-4 px-1 relative font-medium text-sm transition-colors ${
            activeTab === "overview"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            전역 대시보드
          </span>
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400"></span>
          )}
        </button>
        <button
          onClick={() => onTabChange("services")}
          className={`py-4 px-1 relative font-medium text-sm transition-colors ${
            activeTab === "services"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            서비스 목록
          </span>
          {activeTab === "services" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400"></span>
          )}
        </button>
      </div>
    </div>
  );
}
