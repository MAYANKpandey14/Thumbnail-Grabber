import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus, Warehouse } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import heroIcon from "@/assets/Thumbnail_Grabber.avif";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-12 md:h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/" className="flex items-center gap-1.5 md:gap-2 font-bold text-base md:text-lg text-primary font-heading">
              <img src={heroIcon} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              <span>Thumbnail Grabber</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className={location.pathname === "/dashboard" ? "bg-accent" : "flex items-center justify-center"}>
                  <Link to="/dashboard">
                    <Warehouse className="w-5 h-5" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-heading font-bold text-xs">
                        {(() => {
                          const meta = user.user_metadata || {};
                          const name = meta.full_name || meta.name;

                          if (name && typeof name === 'string' && name.trim().length > 0) {
                            const parts = name.trim().split(/\s+/).filter(p => p.length > 0);
                            if (parts.length >= 2) {
                              return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                            }
                            if (parts.length === 1 && parts[0].length > 0) {
                              return parts[0][0].toUpperCase();
                            }
                          }

                          return user.email?.[0]?.toUpperCase() || "U";
                        })()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.user_metadata?.name || "Account"}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                className="font-heading font-bold border-2 border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                size="sm"
                variant="secondary"
                asChild
              >
                <Link to="/auth/signup">
                  Grab in Bulk !
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}