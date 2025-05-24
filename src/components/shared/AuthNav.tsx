"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";

export function AuthNav() {
  return (
    <div className="flex gap-4">
      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
}

export default AuthNav;