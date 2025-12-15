import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { requestPasswordReset } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Redirect to the reset password route in our app
        const redirectTo = `${window.location.origin}/auth/reset-password`;

        const { error } = await requestPasswordReset(email, redirectTo);
        if (error) {
            // For security, usually we don't want to reveal if email exists, 
            // but Supabase might return error for aggressive rate limiting or invalid email format.
            // We will just show generic message mostly, unless it's a structural error.
            console.error(error);
            toast.error("Unable to send reset email. Please try again.");
        } else {
            setSubmitted(true);
            toast.success("Password reset email sent!");
        }
        setIsLoading(false);
    };

    if (submitted) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Check your email</CardTitle>
                    <CardDescription className="text-center">
                        We have sent a password reset link to <strong>{email}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Link to="/auth/login">
                        <Button variant="outline">Back to Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
                <CardDescription className="text-center">
                    Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Link to="/auth/login" className="text-sm text-primary hover:underline">
                    Back to Login
                </Link>
            </CardFooter>
        </Card>
    );
}
