import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50", className)}>
            {Icon && (
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
            {children}
        </div>
    );
}
