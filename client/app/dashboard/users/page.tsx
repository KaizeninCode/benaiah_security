"use client";

import React, { useEffect } from "react";
import TopCard from "../components/TopCard";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserDashboardStore } from "@/store/useDashboardStore";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import NewHostForm from "./components/NewHostForm";
import NewGuardForm from "./components/NewGuardForm";
import NewVisitorForm from "./components/NewVisitorForm";
import NewAdminForm from "./components/NewAdminForm";
import NewManagerForm from "./components/NewManagerForm";

const UsersPage = () => {
  const router = useRouter();
  const userPageStats = useUserDashboardStore((state) => state.userPageStats);
  const token = useDashboardStore((state) => state.token);

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
    <div className="w-full py-8 px-4 md:px-12 flex flex-col gap-8">
      <TopCard title="User Management" description="Manage your users here." />

      {/* STATS CARDS */}
      <div className="flex justify-between max-w-8xl rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
      <div className="flex justify-between max-w-8xl rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* LHS CARD */}
          <Card className="bg-white border border-red-100 shadow-sm">
            <CardContent className="flex flex-col items-start justify-center py-6">
              <div className="flex flex-col items-center mx-auto w-4/5 ">
                <h1 className="text-2xl text-slate-500 font-light mb-8">Quick Actions</h1>
                <div className="flex flex-col w-full justify-between items-start gap-4 mt-2">
                  {/* NEW HOST BUTTON AND DIALOG */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 w-full bg-linear-to-r from-green-800 to-green-600 text-white shadow-sm rounded-lg cursor-pointer">
                          <h3 className="">Create New Host</h3>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center">Create New Host</DialogTitle>
                        <NewHostForm/>
                      <DialogDescription>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  {/* NEW GUARD BUTTON */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 w-full bg-linear-to-r from-blue-800 to-blue-600 text-white shadow-sm rounded-lg cursor-pointer">
                          <h3 className="">Create New Guard</h3>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center">Create New Guard</DialogTitle>
                        <NewGuardForm/>
                      <DialogDescription>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  {/* NEW VISITOR BUTTON */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 w-full bg-linear-to-r from-purple-800 to-purple-600 text-white shadow-sm rounded-lg cursor-pointer">
                          <h3 className="">Create New Visitor</h3>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center">Create New Visitor</DialogTitle>
                        <NewVisitorForm/>
                      <DialogDescription>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  {/* NEW ADMIN BUTTON */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 w-full bg-linear-to-r from-red-800 to-red-600 text-white shadow-sm rounded-lg cursor-pointer">
                          <h3 className="">Create New Admin</h3>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center">Create New Admin</DialogTitle>
                        <NewAdminForm/>
                      <DialogDescription>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  {/* NEW MANAGER BUTTON */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 w-full bg-linear-to-r from-cyan-800 to-cyan-600 text-white shadow-sm rounded-lg cursor-pointer">
                          <h3 className="">Create New Manager</h3>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center">Create New Manager</DialogTitle>
                        <NewManagerForm/>
                      <DialogDescription>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  
                </div>
              </div>
              
            </CardContent>
          </Card>

          {/* RHS CARD */}
          <Card className="bg-white border border-red-100 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="text-3xl font-bold text-red-500 flex items-center">
                Some Text
                {/* <Badge className="bg-red-500 ml-2">
                      <stat.icon size={8} className="mr-1" />
                    </Badge> */}
              </div>
              <div className="text-md text-slate-600 mt-2 text-center">
                Some Other Text
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
