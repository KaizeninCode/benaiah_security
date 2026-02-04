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
import { Gate, useDashboardStore } from "@/store/useDashboardStore";
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

type UpdateGateFormProps = {
  gate: Gate;
  onSuccess?: () => void;
};

export default function UpdateGateForm({
  gate,
  onSuccess,
}: UpdateGateFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const sites = useDashboardStore((state) => state.sites);
  const updateGate = useDashboardStore((state) => state.updateGate);

  
  

  // Initialize with existing gate data
  const [name, setName] = useState(gate.name);
  // const [site, setSite] = useState(gate.site.name);
  const [siteId, setSiteId] = useState(() => {
    // Handle different formats of gate.site
    if (typeof gate.site === 'string') {
      return gate.site;
    } else if (gate.site && typeof gate.site === 'object') {
      return gate.site.id || gate.site._id || "";
    }
    return "";
  });
  const [status, setStatus] = useState<"active" | "inactive">(gate.status);
  const [guards, setGuards] = useState<string[]>(gate.guards || []);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/gates/${gate.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            site: siteId,
            // site,
            status,
            guards,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update gate.");
        toast.error(data.message || "Failed to update gate.");
        setIsLoading(false);
        return;
      }
      const responseData = await response.json();

      // Find the full site object from the store
      const fullSite = sites.find((s) => s.id === siteId);

      // Map _id to id for the updated gate
      const updatedGateWithId = {
        ...responseData.gate,
        id: responseData.gate._id,
        site: fullSite || responseData.gate.site,
      };


      // Update store with response data
      updateGate(gate.id!, updatedGateWithId);
      toast.success("Gate updated successfully!");
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
            <Label htmlFor="name">Gate Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gate Name"
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
