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
import { Spinner } from "@/components/ui/spinner";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const setUser = useDashboardStore((state) => state.setUser);
  const setToken = useDashboardStore((state) => state.setToken);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // basic validation
    switch (type) {
      case "register":
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        if (!email || !password || !username || !phone) {
          setError("Email, password, username, and phone are required.");
          return;
        }
        break;
      case "login":
        if (!email || !password) {
          setError("Email and password are required.");
          return;
        }
        break;
      default:
        break;
    }

    setIsLoading(true);
    try {
      let response;
      switch (type) {
        case "login":
          response = await fetch(
            `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            },
          );
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
          } else {
            setError("Login failed. Please check your credentials.");
          }
          break;
        case "register":
          response = await fetch(
            `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL}/auth/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, phone, username }),
            },
          );
          if (response.ok) {
            router.push("/auth/login");
          } else {
            setError("Registration failed. Please try again.");
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-4/5 m-auto max-md:my-10 h-fit">
      <CardHeader>
        <CardTitle className="text-3xl text-red-500 text-center font-bold inline-block">
          {type == "register" ? "Register" : "Sign In"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {type == "register" && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
          )}
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
          {type == "register" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="123-456-7890"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </span>
            </div>
          </div>
          {type == "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              {type == "register" ? (
                <p className="lg:text-md text-sm">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="text-red-500 transition-all hover:scale-105"
                  >
                    Sign In
                  </a>
                </p>
              ) : (
                <p className="lg:text-md text-sm">
                  Don't have an account?{" "}
                  <a
                    href="/auth/register"
                    className="text-red-500 transition-all ease-in-out duration-300 hover:scale-105"
                  >
                    Register
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="w-2/5 mx-auto">
            <Button
              type="submit"
              className=" bg-red-500 w-full hover:bg-red-800 cursor-pointer"
            >
              <div className="w-fit flex items-center gap-2">
                {isLoading && <Spinner className="mx-auto size-4" />}
                {type == "register" ? "Register" : "Sign In"}
              </div>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
