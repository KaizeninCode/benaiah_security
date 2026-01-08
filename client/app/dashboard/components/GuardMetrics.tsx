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

  return (
    <div className="grid grid-cols-2 gap-4 w-full h-1/4">
      <div className="rounded-lg h-full space-y-4">
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Total Guards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.totalGuards}
            </p>
          </CardContent>
        </Card>
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Active Guards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.activeGuards}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-lg h-full space-y-4">
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Guards on Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.guardsOnLeave}
            </p>
          </CardContent>
        </Card>
        <Card className="flex  justify-center text-center">
          <CardHeader>
            <CardTitle className="text-lg font-medium mb-4">
              Guards Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-500">
              {stats.guardsAvailable}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuardMetrics;
