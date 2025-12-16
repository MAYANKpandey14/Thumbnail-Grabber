import { Outlet, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 relative">
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="absolute top-3 left-3 md:top-6 md:left-6 bg-red-600 text-white hover:bg-red-700 hover:text-white"
            >
                <Link to="/" className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                </Link>
            </Button>
            <div className="w-full max-w-md px-4 sm:px-0">
                <Outlet />
            </div>
        </div>
    );
}
