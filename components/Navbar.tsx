"use client";

import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { LayoutGrid, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useLocation();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    setLocation("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-lg text-primary">
               <span>YT Thumb Grabber</span>
            </a>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
               <Button variant="ghost" asChild className={location === "/dashboard" ? "bg-accent" : ""}>
                <Link href="/dashboard">
                  <a className="gap-2 flex items-center">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </a>
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.email?.[0].toUpperCase()}
                 </div>
                 <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                 </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}