import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { cn } from "@/lib/utils";

interface ErrorBlockProps {
    title?: string;
    message: string;
    className?: string;
}

export function ErrorBlock({ title = "Error", message, className }: ErrorBlockProps) {
    return (
        <Alert variant="destructive" className={cn("my-4", className)}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    );
}
