"use client";

import React, { useEffect, useState } from "react";
import TopCard from "../components/TopCard";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserDashboardStore } from "@/store/useDashboardStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import NewHostForm from "./components/NewHostForm";
// import NewGuardForm from "./components/NewGuardForm";
// import NewVisitorForm from "./components/NewVisitorForm";
// import NewAdminForm from "./components/NewAdminForm";
// import NewManagerForm from "./components/NewManagerForm";
import { getRoleTextColor, roleColors } from "@/lib/roleColors";
import { ChartAreaInteractive } from "@/app/components/InteractiveChart";
import HostStatsCard from "./components/HostStatsCard";
// import { ChartBarStacked } from "./components/StackedBarChart";
// import   {NotificationsList}  from "./components/NotificationsList";

const HostsPage = () => {
  const router = useRouter();
  const userPageStats = useUserDashboardStore((state) => state.userPageStats);
  const token = useDashboardStore((state) => state.token);
  const user = useDashboardStore((state) => state.user);

  const [isHostOpen, setIsHostOpen] = useState(false);
  const [isGuardOpen, setIsGuardOpen] = useState(false);
  const [isVisitorOpen, setIsVisitorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/auth/login");
    // fetch dashboard stats
    fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const users = data.users || [];
        const stats = {
          hosts: users.filter((u: any) => u.role === "host").length,
          guards: users.filter((u: any) => u.role === "guard").length,
          visitors: users.filter((u: any) => u.role === "visitor").length,
        };
        useUserDashboardStore.getState().setUserPageStats(stats);
      });
  }, [token, router]);

  const statsArray = userPageStats
    ? [
        { label: "Hosts", value: userPageStats.hosts },
        {
          label: "Guards",
          value: userPageStats.guards,
        },
        { label: "Visitors", value: userPageStats.visitors },
      ]
    : [];

  return (
    <div className="w-full py-8 px-4 md:px-12 flex flex-col gap-4">
      <TopCard title="Host Management" description="Manage your hosts here." />

      <HostStatsCard />
    </div>
  );
};

export default HostsPage;
