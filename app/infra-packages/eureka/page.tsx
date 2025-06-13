"use client";

import { useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Activity, Server } from "lucide-react";
import {
  eurekaDashboardData,
  eurekaServicesData,
} from "@/constants/eurekaData";
import { StatusCard } from "./components/dashboard/StatusCard";
import { ZoneCard } from "./components/dashboard/ZoneCard";
import { ServiceCountCard } from "./components/dashboard/ServiceCountCard";
import { InstanceCountCard } from "./components/dashboard/InstanceCountCard";
import { SelfPreservationCard } from "./components/dashboard/SelfPreservationCard";
import { ServiceList } from "./components/services/ServiceList";
import { TabMenu } from "./components/common/TabMenu";

export default function EurekaPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const modalContentRef = useRef<HTMLDivElement>(null);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              <SelfPreservationCard
                isEnabled={eurekaDashboardData.selfPreservation}
              />
              <ServiceCountCard
                totalServices={eurekaDashboardData.totalServices}
              />
              <InstanceCountCard
                totalInstances={eurekaDashboardData.totalInstances}
              />
              <StatusCard
                statusCount={eurekaDashboardData.statusCount}
                totalInstances={eurekaDashboardData.totalInstances}
              />
              <ZoneCard zoneCount={eurekaDashboardData.zoneCount} />
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <ServiceList
            services={eurekaServicesData}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}
      </div>
    </AppLayout>
  );
}
