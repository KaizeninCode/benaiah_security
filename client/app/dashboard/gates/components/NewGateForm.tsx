"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { toast } from "sonner";
import { roleColors } from "@/lib/roleColors";

type NewGateFormProps = {
  onSuccess?: () => void;
};

export default function NewGateForm({ onSuccess }: NewGateFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const sites = useDashboardStore((state) => state.sites);
  const setSites = useDashboardStore((state) => state.setSites);
  const guards = useDashboardStore((state) => state.guards);
  const setGuards = useDashboardStore((state) => state.setGuards);
  const addGate = useDashboardStore((state) => state.addGate);

  const [name, setName] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [siteId, setSiteId] = useState("");
  const [selectedGuards, setSelectedGuards] = useState<string[]>([]); // Store guard IDs
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!name || !siteId) {
      setError("Name and site are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/gates`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            status,
            site: siteId, // Send site ID
            guards: selectedGuards, // Send array of guard IDs
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create gate.");
        toast.error(data.message || "Failed to create gate.");
        setIsLoading(false);
        return;
      }

      const responseData = await response.json();
      // Map _id to id for consistency
      const gateWithId = {
        ...responseData.gate,
        id: responseData.gate._id,
      };

      addGate(gateWithId); // Add gate with the MongoDB-generated ID
      toast.success("Gate created successfully!");
      onSuccess && onSuccess();

      // Reset form
      setName("");
      setStatus("inactive");
      setSiteId("");
      setSelectedGuards([]);
      setError("");
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const anchor = useComboboxAnchor();

  // Create a map of guard names to IDs for the combobox
  const guardItems = guards.map((guard) => ({
    id: guard.id,
    name: guard.name,
  }));

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
                      {site.name} - {site.location}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Gate Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Main Gate"
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

          <div className="space-y-2">
            <Label htmlFor="guards">Assign Guards (Optional)</Label>
            <Combobox
              multiple
              autoHighlight
              items={guardItems}
              value={selectedGuards}
              onValueChange={setSelectedGuards}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((guardId: string) => {
                        const guard = guards.find((g) => g.id === guardId);
                        return (
                          <ComboboxChip key={guardId}>
                            {guard?.name || guardId}
                          </ComboboxChip>
                        );
                      })}
                      <ComboboxChipsInput placeholder="Select guards..." />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No guards found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.id}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              disabled={isLoading}
              className={`${roleColors[user?.role as keyof typeof roleColors]} w-full cursor-pointer`}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
