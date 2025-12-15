import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecovery, setIsRecovery] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we are in a password recovery session
        // supabase.auth.onAuthStateChange fires when local session is established from URL hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setIsRecovery(true);
            }
        });

        // Also check if we already have a session that might be from recovery (rare if loaded fast)
        // But usually the event is the reliable way.
        // Alternatively, check hash.

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        const { error } = await resetPassword(password);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password updated successfully!");
            navigate("/auth/login");
        }
        setLoading(false);
    };

    // If not in recovery mode (and maybe no hash), show warning or redirect loop avoidance?
    // But wait, the `onAuthStateChange` might take a moment. 
    // We can just show the form. If `updateUser` fails, it fails.

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">New Password</label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
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
