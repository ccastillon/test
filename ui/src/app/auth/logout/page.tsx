"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: "/auth/signin" });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen"></div>
  );
}
