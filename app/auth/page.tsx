"use client"

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Auth() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left column: Login Form */}
      <div className="flex items-center justify-center py-12 lg:py-0">
        <div className="mx-auto grid w-full max-w-md gap-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Concierge Login</h1>
            <p className="text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="rounded-none"
              />
            </div>
            {/* Password Input */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required className="rounded-none" />
            </div>
            {/* Login Button */}
            <Button type="button" className="w-full rounded-none" onClick={handleLogin}>
              Login
            </Button>
            {/* Google Login Button */}
            <Button variant="outline" className="w-full rounded-none">
              Login with Google
            </Button>
          </div>
          {/* Sign up link */}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      {/* Right column: Cover Image */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/image.png"
          alt="Cover Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
