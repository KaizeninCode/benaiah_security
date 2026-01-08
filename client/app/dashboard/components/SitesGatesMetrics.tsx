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

  const metrics = [
    { label: "Total Sites", value: stats.totalSites },
    { label: "Active Sites", value: stats.activeSites },
    { label: "Total Gates", value: stats.totalGates },
    { label: "Active Gates", value: stats.activeGates },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 w-full h-1/4">
      <div className="rounded-lg h-full space-y-4">
        {metrics.slice(0,2).map((metric, i) => (
          <Card className="flex justify-center text-center" key={i}>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{metric.value}</div>
              <div className="text-lg text-slate-800">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
        
      </div>
      <div className="rounded-lg h-full space-y-4">
        {metrics.slice(2,4).map((metric, i) => (
          <Card className="flex justify-center text-center" key={i}>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{metric.value}</div>
              <div className="text-lg text-slate-800">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
        
      </div>
    </div>
  );
};

export default SitesGatesMetrics;
