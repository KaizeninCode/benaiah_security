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
import { toast } from "sonner"

type NewVisitorFormProps = {
  onSuccess?: () => void;
};

export default function NewVisitorForm({ onSuccess }: NewVisitorFormProps) {
  const setUser = useDashboardStore((state) => state.setUser);
  const token = useDashboardStore((state) => state.token);
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [host, setHost] = useState("");
  const [site, setSite] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name || !phone || !idNumber || !purpose || !host || !site) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/visitors`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone: Number(phone),
            idNumber,
            purpose,
            host,
            site,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create visitor.");
        toast.error(data.message || "Failed to create visitor.");
        return;
      }
      toast.success("Visitor created successfully!");
      onSuccess && onSuccess();
      // Optionally reset form or close dialog here
      
      setName("");
      setPhone("");
      setIdNumber("");
      setPurpose("");
      setHost("");
      setSite("");
      setError("");
      // Optionally, show a success message or refresh the list
    } catch (err) {
      setError("An error occurred. Please try again.");
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
            <Label htmlFor="name">Visitor Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Visitor Name"
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
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              placeholder="Purpose of visit"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
              placeholder="Host"
            />
          </div>

          

          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              className=" bg-red-500 w-full hover:bg-red-800 cursor-pointer"
            >
              Create Visitor
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
