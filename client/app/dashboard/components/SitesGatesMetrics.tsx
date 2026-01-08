"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { useEffect, useState } from "react";
import type { DashboardStats } from "@/store/useDashboardStore";

type GuardMetricsProps = {
  stats: DashboardStats | null;
};

const SitesGatesMetrics = ({ stats }: GuardMetricsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-full h-1/4">
      <div className="rounded-lg h-full space-y-4">
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Total Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.totalSites}
            </p>
          </CardContent>
        </Card>
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Active Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.activeSites}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-lg h-full space-y-4">
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Total Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.totalGates}
            </p>
          </CardContent>
        </Card>
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Inactive Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.inactiveGates}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SitesGatesMetrics;
