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
import { Guard, useDashboardStore } from "@/store/useDashboardStore";
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

type UpdateGuardFormProps = {
  guard: Guard;
  onSuccess?: () => void;
};

export default function UpdateGuardForm({
  guard,
  onSuccess,
}: UpdateGuardFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const sites = useDashboardStore((state) => state.sites);
  const updateGuard = useDashboardStore((state) => state.updateGuard);

  
  

  // Initialize with existing guard data
  const [name, setName] = useState(guard.name);
  
  const [status, setStatus] = useState<"active" | "inactive">(guard.status);
  const [idNumber, setIdNumber] = useState(guard.idNumber);
  const [phoneNumber, setPhoneNumber] = useState(guard.phoneNumber);
  const [email, setEmail] = useState(guard.email);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

   
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/guards/${guard.id}`,
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
            status,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update guard.");
        toast.error(data.message || "Failed to update guard.");
        setIsLoading(false);
        return;
      }
      const responseData = await response.json();

      // Map _id to id for the updated guard
      const updatedGuardWithId = {
        ...responseData.guard,
        id: responseData.guard._id,
        // site: fullSite || responseData.gate.site,
      };


      // Update store with response data
      updateGuard(guard.id!, updatedGuardWithId);
      toast.success("Guard updated successfully!");
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
            <Label htmlFor="name">Guard Name</Label>
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
              {isLoading ? "Updating..." : "Update Guard"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
