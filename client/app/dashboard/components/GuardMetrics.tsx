"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/store/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
// import { useEffect, useState } from "react";

type GuardMetricsProps = {
  stats: DashboardStats | null;
};

const GuardMetrics = ({ stats }: GuardMetricsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  const metrics = [
    { label: "Total Guards", value: stats.totalGuards },
    { label: "Active Guards", value: stats.activeGuards },
    { label: "Guards on Leave", value: stats.guardsOnLeave },
    { label: "Guards Available", value: stats.guardsAvailable },
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

export default GuardMetrics;
