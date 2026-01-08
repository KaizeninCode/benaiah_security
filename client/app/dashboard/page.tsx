"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { ChartAreaInteractive } from "../components/InteractiveChart";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import GuardMetrics from "./components/GuardMetrics";
import SitesGatesMetrics from "./components/SitesGatesMetrics";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const stats = useDashboardStore((state) => state.stats);
  // // Example user data and stats
  // const user = {
  //   name: "John Doe",
  //   email: "john@example.com",
  //   role: "Client",
  // };
  // const stats = [
  //   { label: "Hosts", value: 344, icon: IconTrendingUp },
  //   { label: "Sites", value: 15, icon: IconTrendingUp },
  //   { label: "Visitors This Month", value: 100, icon: IconTrendingDown },
  //   { label: "Guards", value: 54, icon: IconTrendingUp },
  // ];

  /*
    STATS TO BE FETCHED FROM API AND STORED IN ZUSTAND STORE
    - hosts [not present yet. fetched all users instead]
    - total sites [DONE]
    - visitors this month [fetched all visitors instead]
    - total guards [DONE]
    - guards on leave [not present yet. fetched all guards instead]
    - active guards [not present yet. fetched all guards instead]
    - available guards [not present yet. fetched all guards instead]
    - active sites [not present yet. fetched all sites instead]
    - total gates [DONE]
    - inactive gates [not present yet. fetched all gates instead]
    
  */

  useEffect(() => {
    if (!token) router.replace("/auth/login");
    // fetch dashboard stats
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/guards`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/gates`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ]).then(([users, sites, visitors, guards, gates]) => {
      const stats = {
        totalGuards: guards.total,
        activeGuards: guards.total, // placeholder
        guardsOnLeave: 0, // placeholder
        guardsAvailable: guards.total, // placeholder
        hosts: users.total,
        totalSites: sites.total,
        activeSites: sites.total, // placeholder
        totalGates: gates.total,
        activeGates: gates.gates.filter((g: { status: string; }) => g.status === 'active').length, // placeholder
        visitorsThisMonth: visitors.total,
      };
      useDashboardStore.getState().setStats(stats);
    });
  }, [token, router]);

  const statsArray = stats
    ? [
        { label: "Hosts", value: stats.hosts },
        {
          label: "Total Guards",
          value: stats.totalGuards,
          icon: IconTrendingUp,
        },
        { label: "Total Sites", value: stats.totalSites },
        {
          label: "Visitors This Month",
          value: stats.visitorsThisMonth,
        },
        // { label: "Total Gates", value: stats.totalGates },
      ]
    : [];
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 ">
      <div className="w-full py-8 px-4 md:px-12 flex flex-col gap-8">
        {/* TOP CARD - WELCOME MESSAGE */}
        <Card className="w-full max-w-8xl mx-auto bg-linear-to-r from-red-700 to-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-2xl ">Welcome, {user?.name || 'User'}.</CardTitle>
            <CardDescription className="mt-2 text-white/70">
              Your dashboard overview
            </CardDescription>
          </CardHeader>
          {/* <CardContent>
            <div className="mb-6">
              <div className="text-lg font-medium">Account Info</div>
              <div className="text-slate-700">Email: {user.email}</div>
              <div className="text-slate-700">Role: {user.role}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <Card
                  key={idx}
                  className="bg-white border border-red-100 shadow-sm"
                >
                  <CardContent className="flex flex-col items-center py-6">
                    <div className="text-3xl font-bold text-red-500">
                      {stat.value}
                    </div>
                    <div className="text-md text-slate-600 mt-2">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent> */}
          <CardFooter className="flex justify-end">
            <span className="text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </CardFooter>
        </Card>
        {/* STATS */}
        <div className="flex justify-between max-w-8xl rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {statsArray.map((stat, idx) => (
              <Card
                key={idx}
                className="bg-white border border-red-100 shadow-sm"
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="text-3xl font-bold text-red-500 flex items-center">
                    {stat.value}
                    {/* <Badge className="bg-red-500 ml-2">
                      <stat.icon size={8} className="mr-1" />
                    </Badge> */}
                  </div>
                  <div className="text-md text-slate-600 mt-2 text-center">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* GUARD METRICS */}
        <GuardMetrics stats={stats} />
        {/* INTERACTIVE CHART */}
        <ChartAreaInteractive />
        {/* SITES AND GATES METRICS */}
        <SitesGatesMetrics stats={stats} />
      </div>
    </div>
  );
}
