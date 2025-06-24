"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileBrowser } from "@/components/file-browser";
import TabMenu from "./components/common/TabMenu";
import SecretKey from "@/components/secretKey";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: ProjectPageProps) {
  console.log(params);

  return (
    <AppLayout projectSlug={params.slug}>
      <FileBrowser projectSlug={params.slug} />
    </AppLayout>
  );
}
