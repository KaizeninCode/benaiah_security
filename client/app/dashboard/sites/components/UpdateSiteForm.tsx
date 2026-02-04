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
import { Site, useDashboardStore } from "@/store/useDashboardStore";
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
import { Spinner } from "@/components/ui/spinner";

type UpdateSiteFormProps = {
  site: Site;
  onSuccess?: () => void;
};

export default function UpdateSiteForm({ site, onSuccess }: UpdateSiteFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const updateSite = useDashboardStore((state) => state.updateSite);
  
  // Initialize with existing site data
  const [name, setName] = useState(site.name);
  const [location, setLocation] = useState(site.location);
  const [status, setStatus] = useState<"active" | "inactive">(site.status);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/sites/${site.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            location,
            status,
          }),
        },
      );
      if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Failed to update site.");
      toast.error(data.message || "Failed to update site.");
      return;
    }
     const responseData = await response.json();
     // Map _id to id for the updated site
      const updatedSiteWithId = {
        ...responseData.site,
        id: responseData.site._id,
        // site: fullSite || responseData.gate.site,
      };
    
    // Only update store if backend update succeeded
    updateSite(site.id!,updatedSiteWithId);
    toast.success("Site updated successfully!");
    onSuccess && onSuccess();
    
  } catch (err) {
    console.error("Fetch error:", err); // Debug log
    setError("An error occurred. Please try again.");
    toast.error("An error occurred. Please try again.");
  } finally {
    setIsLoading(false)
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
            <Label htmlFor="name">Site Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Site Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nairobi, Kenya"
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
              {isLoading? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}