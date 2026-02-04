"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Host, useDashboardStore } from "@/store/useDashboardStore";
import { toast } from "sonner";
import {
  roleColors,
  getRoleBgColor,
  getRoleTextColor,
  getHoverRoleColor,
} from "@/lib/roleColors";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UpdateHostFormProps = {
  host: Host;
  onSuccess?: () => void;
};

export default function UpdateHostForm({
  host,
  onSuccess,
}: UpdateHostFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const sites = useDashboardStore((state) => state.sites);
  const updateHost = useDashboardStore((state) => state.updateHost);

  // Initialize with existing host data
  const [name, setName] = useState(host.name);

  const [status, setStatus] = useState<"active" | "inactive">(host.status);
  const [idNumber, setIdNumber] = useState(Number(host.idNumber));
  const [phoneNumber, setPhoneNumber] = useState(Number(host.phoneNumber));
  const [email, setEmail] = useState(host.email);
  const [unit, setUnit] = useState(host.unit);
  const [siteId, setSiteId] = useState(() => {
    // Handle different formats of host.site
    if (typeof host.site === "string") {
      return host.site;
    } else if (host.site && typeof host.site === "object") {
      return host.site.id || host.site._id || "";
    }
    return "";
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/hosts/${host.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            idNumber,
            phoneNumber,
            email,
            unit,
            site: siteId,
            status,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update host.");
        toast.error(data.message || "Failed to update host.");
        setIsLoading(false);
        return;
      }
      const responseData = await response.json();

      // Find the full site object from the store
      const fullSite = sites.find((s) => s.id === siteId);

      // Map _id to id for the updated host
      const updatedHostWithId = {
        ...responseData.host,
        id: responseData.host._id,
        site: fullSite || responseData.host.site,
      };

      // Update store with response data
      updateHost(host.id!, updatedHostWithId);
      toast.success("Host updated successfully!");
      onSuccess && onSuccess();
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-4/5 m-auto max-md:my-10 h-fit">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Host Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gate Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              type="number"
              value={idNumber}
              onChange={(e) => setIdNumber(Number(e.target.value))}
              placeholder="ID Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(Number(e.target.value))}
              placeholder="Phone Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Select
              value={siteId}
              onValueChange={(value: string) => setSiteId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "active" | "inactive") => setStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              disabled={isLoading}
              className={`${roleColors[user?.role as keyof typeof roleColors]} w-full cursor-pointer`}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
