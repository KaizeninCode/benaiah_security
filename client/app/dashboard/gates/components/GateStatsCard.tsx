"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/store/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleBgColor, getRoleTextColor, roleColors } from "@/lib/roleColors";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, ArrowUpDown, PlusCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewGateForm from "./NewGateForm";
import { Table } from "../../components/Table";
import UpdateGateForm from "./UpdateGateForm";
import { toast } from "sonner";
// import NewVisitorForm from "./NewVisitorForm";
// import { useEffect, useState } from "react";

type GuardMetricsProps = {
  stats: DashboardStats | null;
};

// const GuardMetrics = ({ stats }: GuardMetricsProps) => {
const GateStatsCard = () => {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const gates = useDashboardStore((state) => state.gates);
  const setGates = useDashboardStore((state) => state.setGates);
  const deleteGate = useDashboardStore((state) => state.deleteGate);
  const guards = useDashboardStore((state) => state.guards);
  const setGuards = useDashboardStore((state) => state.setGuards);
  const deleteGuard = useDashboardStore((state) => state.deleteGuard);
  const sites = useDashboardStore((state) => state.sites);
  const setSites = useDashboardStore((state) => state.setSites);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(0);

  // DEBUG LOGS
  console.log("Gates in table component:", gates);
  console.log("Gates length:", gates.length);

  // Fetch sites and guards when component mounts
  useEffect(() => {
    const fetchSites = async () => {
      if (sites.length > 0) return; // Don't fetch if already loaded

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/sites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch sites");

        const data = await response.json();
        const sitesWithId = data.sites.map((site: any) => ({
          ...site,
          id: site._id,
        }));
        setSites(sitesWithId);
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
      }
    };

    const fetchGuards = async () => {
      if (guards.length > 0) return; // Don't fetch if already loaded

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/guards`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch guards");

        const data = await response.json();
        const guardsWithId = data.guards.map((guards: any) => ({
          ...guards,
          id: guards._id,
        }));
        setGuards(guardsWithId);
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
      }
    };

    if (token) {
      fetchSites();
      fetchGuards();
    }
  }, [token, sites.length, guards.length, setSites, setGuards]);

  useEffect(() => {
    const fetchGates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/gates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch gates.");
        }
        const data = await response.json();
        const gatesWithId = data.gates.map((gate: any) => ({
          ...gate,
          id: gate._id,
          site: gate.site
            ? {
                ...gate.site,
                id: gate.site._id || gate.site.id,
              }
            : null,
        }));
        setGates(gatesWithId);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchGates();
  }, [token, setGates]);

  const metrics = [
    { label: "Total Gates", value: gates.length },
    {
      label: "Active Gates",
      value: gates.filter((gate) => gate.status === "active").length,
    },
    {
      label: "Inactive Gates",
      value: gates.filter((gate) => gate.status === "inactive").length,
    },
  ];

  const columns = [
    { header: "Name", key: "name" },
    {
      header: "Site",
      key: "site",
      render: (row: any) => row.site?.name || "N/A",
    },
    {
      header: "Status",
      key: "status",
      render: (row: any) =>
        row.status == "active" ? (
          <span className="px-2 py-1 bg-green-200 rounded-md text-green-700 text-sm font-semibold">
            {row.status.toUpperCase()}
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-200 rounded-md text-red-700 text-sm font-semibold">
            {row.status.toUpperCase()}
          </span>
        ),
    },

    {
      header: "Actions",
      key: "actions",
      render: (row: any) => {
        //  console.log("Row data:", row);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-center">
              <Dialog open={isEditGateOpen} onOpenChange={setIsEditGateOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuLabel className="cursor-pointer hover:text-yellow-700/90">
                    Edit
                  </DropdownMenuLabel>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle className="text-center">Edit Gate</DialogTitle>
                  <UpdateGateForm
                    gate={row}
                    onSuccess={() => setIsEditGateOpen(false)}
                  />
                  <DialogDescription></DialogDescription>
                </DialogContent>
              </Dialog>

              <DropdownMenuSeparator />
              <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuLabel className="cursor-pointer hover:text-red-700">
                    Delete
                  </DropdownMenuLabel>
                </DialogTrigger>
                <DialogContent className="text-center">
                  <DialogTitle>Delete Gate</DialogTitle>
                  <DialogDescription className="text-lg">
                    Are you sure you want to delete this gate?
                  </DialogDescription>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteClick(row.id);
                    }}
                    className="w-2/5 mx-auto"
                  >
                    Yes. Delete gate
                  </Button>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDeleteClick = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/gates/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Failed to delete gate.");
      deleteGate(id); // local store update
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting gate: ", error);
    }
  };

  const [isEditGateOpen, setIsEditGateOpen] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter visitors based on filter state
  const filteredGates = gates.filter((gate) => {
    const search = filter.toLowerCase();
    return (
      gate.name.toLowerCase().includes(search) ||
      gate.site?.name?.toLowerCase().includes(search) ||
      (gate.status ? gate.status.toLowerCase().includes(search) : false)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredGates.length / pageSize) || 1;
  const paginatedGates = filteredGates.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="gap-4 w-full h-1/4">
      <div className="rounded-lg h-full gap-4 flex items-center justify-between">
        {metrics.map((metric, i) => (
          <Card className="flex justify-center text-center w-full" key={i}>
            <CardContent>
              <div
                className={`${getRoleTextColor(user?.role)} text-3xl font-bold`}
              >
                {metric.value}
              </div>
              <div className="text-lg text-slate-800">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* {metrics.slice(2,4).map((metric, i) => (
      <div className="rounded-lg h-full space-y-4">
          <Card className="flex justify-center text-center" key={i}>
            <CardContent>
              <div className={`${getRoleTextColor(user?.role)} text-3xl font-bold`}>{metric.value}</div>
              <div className="text-lg text-slate-800">{metric.label}</div>
            </CardContent>
          </Card>
        
      </div>
        ))} */}

      {/* TABULATED LIST OF GATES */}
      <div className="mt-8 h-3/4">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search gates..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
          {/* NEW GATE BUTTON AND DIALOG */}
          <Dialog open={isGateOpen} onOpenChange={setIsGateOpen}>
            <DialogTrigger asChild>
              <Button
                className={`${roleColors[user?.role as keyof typeof roleColors]} cursor-pointer`}
              >
                <PlusCircle />
                <p className="max-lg:hidden">Create New Gate</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-center">Create New Gate</DialogTitle>
              <NewGateForm
                onSuccess={() => {
                  setIsGateOpen(false);
                }}
              />
              <DialogDescription></DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-hidden rounded-lg border max-w-6xl p-3 bg-white shadow-sm">
          <Table columns={columns} data={paginatedGates} />
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {/* <Card className="flex justify-center items-center mt-8">
          <CardContent>
          </CardContent>
      </Card> */}
    </div>
  );
};

export default GateStatsCard;
