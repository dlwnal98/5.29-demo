"use client";

import { AppLayout } from "@/components/layout/AppLayout";
export default function ModelsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Models</h1>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
