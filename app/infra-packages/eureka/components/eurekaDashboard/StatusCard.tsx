import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  count?: string | number;
  themeColor: string;
  chart?: ReactNode;
  legend?: ReactNode;
  colSpan: number;
  onTabChange?: (any: string) => void;
}

export default function StatusCard({
  icon,
  title,
  desc,
  count,
  themeColor,
  chart,
  legend,
  colSpan,
  onTabChange,
}: StatusCardProps) {
  return (
    <Card
      className={`col-span-${colSpan} bg-gradient-to-br from-${themeColor}-50 to-${themeColor}-100 dark:from-${themeColor}-900/20 dark:to-${themeColor}-800/20 border-${themeColor}-200 dark:border-${themeColor}-800 hover:cursor-pointer`}
      onClick={() => onTabChange?.("services")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={`text-2xl font-bold text-${themeColor}-700 dark:text-${themeColor}-300`}
            >
              {count}
            </div>
            <p
              className={`text-xs text-${themeColor}-600 dark:text-${themeColor}-400`}
            >
              {desc}
            </p>
          </div>
          {chart}
        </div>
        {legend}
      </CardContent>
    </Card>
  );
}
