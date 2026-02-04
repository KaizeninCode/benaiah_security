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
import { useDashboardStore } from "@/store/useDashboardStore";
import { toast } from "sonner";
import {
  roleColors,
  getRoleBgColor,
  getRoleTextColor,
  getHoverRoleColor,
} from "@/lib/roleColors";

type NewSiteFormProps = {
  onSuccess?: () => void;
};

export default function NewSiteForm({ onSuccess }: NewSiteFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const addSite = useDashboardStore((state) => state.addSite);
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true)

    // Basic validation
    if (!name || !location) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/sites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            location,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create site.");
        toast.error(data.message || "Failed to create site.");
        return;
      }

      const responseData = await response.json();

      const siteWithId = {
        ...responseData.site,
        id: responseData.site._id,
      };

      addSite(siteWithId); // This updates the store
      toast.success("Site created successfully!");
      onSuccess && onSuccess();
      // Optionally reset form or close dialog here

      setName("");
      setLocation("");
      setError("");
      // Optionally, show a success message or refresh the list
    } catch (err) {
      setError("An error occurred. Please try again.");
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
              required
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
              required
              placeholder="Nairobi, Kenya"
            />
          </div>
          

          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              disabled={isLoading}
              className={`${roleColors[user?.role as keyof typeof roleColors]} w-full cursor-pointer`}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
