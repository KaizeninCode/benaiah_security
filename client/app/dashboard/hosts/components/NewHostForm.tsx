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

type NewHostFormProps = {
  onSuccess?: () => void;
};

export default function NewHostForm({ onSuccess }: NewHostFormProps) {
  const setUser = useDashboardStore((state) => state.setUser);
  const token = useDashboardStore((state) => state.token);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !phone || !username || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/auth/admin/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            phone: Number(phone),
            username,
            password,
            role: "host",
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create host.");
        toast.error(data.message || "Failed to create host.");
        return;
      }
      toast.success("Host created successfully!");
      onSuccess && onSuccess();
      // Optionally reset form or close dialog here
      
      setEmail("");
      setPhone("");
      setUsername("");
      setPassword("");
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              className=" bg-red-500 w-full hover:bg-red-800 cursor-pointer"
            >
              Create Host
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
