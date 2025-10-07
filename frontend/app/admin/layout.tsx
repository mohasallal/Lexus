"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types/auth";
import NavBar from "@/components/layout/nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isInitialized, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (!token || !user) {
        router.push("/auth/login");
      } else if (
        user.role !== Role.ADMIN &&
        user.role !== Role.SUPERADMIN &&
        user.role !== Role.SUPERVISOR
      ) {
        router.push("/");
      }
    }
  }, [isInitialized, token, user, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">🏎️</div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="font-bold">Loading Dashboard</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
