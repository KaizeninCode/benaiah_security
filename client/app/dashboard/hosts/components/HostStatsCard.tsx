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
import NewHostForm from "./NewHostForm";
import { toast } from "sonner";
import UpdateHostForm from "./UpdateHostForm";
import { Table } from "../../components/Table";

type GuardMetricsProps = {
  stats: DashboardStats | null;
};

// const GuardMetrics = ({ stats }: GuardMetricsProps) => {
const HostStatsCard = () => {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const hosts = useDashboardStore((state) => state.hosts);
  // DEBUG LOGS
  console.log("Hosts in table:", hosts);
  console.log("First host site:", hosts[0]?.site);
  const setHosts = useDashboardStore((state) => state.setHosts);
  const deleteHost = useDashboardStore((state) => state.deleteHost);
  const sites = useDashboardStore((state) => state.sites);
  const setSites = useDashboardStore((state) => state.setSites);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch sites and hosts when component mounts
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

    const fetchHosts = async () => {
      if (hosts.length > 0) return; // Don't fetch if already loaded

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/hosts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch hosts");

        const data = await response.json();
        const hostsWithId = data.hosts.map((hosts: any) => ({
          ...hosts,
          id: hosts._id,
          site: hosts.site
            ? {
                ...hosts.site,
                id: hosts.site._id || hosts.site.id,
              }
            : null,
        }));
        setHosts(hostsWithId);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        toast.error("Failed to load hosts");
      }
    };

    if (token) {
      fetchSites();
      fetchHosts();
    }
  }, [token, sites.length, hosts.length, setSites, setHosts]);

  const metrics = [
    { label: "Total", value: hosts.length },
    {
      label: "Active",
      value: hosts.filter((host) => host.status === "active").length,
    },
    {
      label: "Inactive",
      value: hosts.filter((host) => host.status === "inactive").length,
    },
  ];

  const columns = [
    { header: "Name", key: "name" },
    //  { header: "ID", key: "idNumber" },
    //  { header: "Phone", key: "phoneNumber" },
    {
      header: "Site",
      key: "site",
      render: (row: any) => row.site?.name || "N/A",
    },
    { header: "Unit", key: "unit" },
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
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-center">
              <Dialog open={isEditHostOpen} onOpenChange={setIsEditHostOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuLabel className="cursor-pointer hover:text-yellow-700/90">
                    Edit
                  </DropdownMenuLabel>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle className="text-center">Edit Host</DialogTitle>
                  <UpdateHostForm
                    host={row}
                    onSuccess={() => setIsEditHostOpen(false)}
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
                  <DialogTitle>Delete Host</DialogTitle>
                  <DialogDescription className="text-lg">
                    Are you sure you want to delete this host?
                  </DialogDescription>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteClick(row.id);
                    }}
                    className="w-2/5 mx-auto"
                  >
                    {isLoading ? "Deleting..." : "Yes, Delete Host"}
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
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/hosts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Failed to delete host.");
      deleteHost(id); // local store update
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting host: ", error);
    }
  };

  const [isEditHostOpen, setIsEditHostOpen] = useState(false);
  const [isHostOpen, setIsHostOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter hosts based on filter state
  const filteredHosts = hosts.filter((host) => {
    const search = filter.toLowerCase();
    return (
      host.name.toLowerCase().includes(search) ||
      host.phoneNumber.toString().includes(search) ||
      host.idNumber.toString().includes(search) ||
      host.unit.toString().includes(search) ||
      (host.status ? host.status.toLowerCase().includes(search) : false)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHosts.length / pageSize) || 1;
  const paginatedHosts = filteredHosts.slice(
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

      {/* TABULATED LIST OF HOSTS */}
      <div className="mt-8 h-3/4">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search hosts..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
          {/* NEW HOST BUTTON AND DIALOG */}
          <Dialog open={isHostOpen} onOpenChange={setIsHostOpen}>
            <DialogTrigger asChild>
              <Button
                className={`${roleColors[user?.role as keyof typeof roleColors]} cursor-pointer`}
              >
                <PlusCircle />
                <p className="max-lg:hidden">Create New Host</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-center">Create New Host</DialogTitle>
              <NewHostForm onSuccess={() => setIsHostOpen(false)} />
              <DialogDescription></DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-hidden rounded-lg border max-w-6xl p-3 bg-white shadow-sm">
          <Table columns={columns} data={paginatedHosts} />
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

export default HostStatsCard;
