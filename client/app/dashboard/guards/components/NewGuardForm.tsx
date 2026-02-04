"use client";

import { useState, useEffect } from "react";
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
import { roleColors } from "@/lib/roleColors";

type NewGuardFormProps = {
  onSuccess?: () => void;
};

export default function NewGuardForm({ onSuccess }: NewGuardFormProps) {
  const user = useDashboardStore((state) => state.user);
  const token = useDashboardStore((state) => state.token);
  const addGuard = useDashboardStore((state) => state.addGuard);
  const setSites = useDashboardStore((state) => state.setSites);
  const router = useRouter();
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email || !phoneNumber || !name || !idNumber) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/guards`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            phoneNumber: Number(phoneNumber),
            idNumber: Number(idNumber),
            name,
            status,
          }),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create guard.");
        return;
      }
      const responseData = await response.json();

      const guardWithId = {
        ...responseData.guard,
        id: responseData.guard._id,
      };

      addGuard(guardWithId); // This updates the store
      toast.success("Guard created successfully!");
      onSuccess && onSuccess();
      // Optionally reset form or close dialog here

      setEmail("");
      setPhoneNumber("");
      setIdNumber("");
      setName("");
      setError("");
      // Optionally, show a success message or refresh the list
    } catch (err) {
      setError("An error occurred. Please try again.");
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
            <Label htmlFor="Name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
              placeholder="ID Number"
            />
          </div>

          <div className="w-2/5 mx-auto">
            <Button
              disabled={isLoading}
              type="submit"
              className={`${roleColors[user?.role as keyof typeof roleColors]} w-full cursor-pointer`}
            >
              {isLoading ? "Creating guard..." : "Create Guard"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
