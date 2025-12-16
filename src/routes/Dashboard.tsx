import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { History, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    const location = useLocation();

    const navItems = [
        { href: "/dashboard/history", label: "History", icon: History },
        { href: "/dashboard/folders", label: "Folders", icon: FolderOpen },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container py-4 md:py-8 flex-1 flex flex-col md:flex-row gap-4 md:gap-8 px-4">
                <aside className="w-full md:w-56 lg:w-64 flex-shrink-0">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">Dashboard</h1>
                    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
