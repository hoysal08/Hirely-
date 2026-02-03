import Link from "next/link";
import { redirect } from "next/navigation";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
    searchParams: { message?: string };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return redirect("/dashboard");
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Recruiter Login</CardTitle>
                    <CardDescription>
                        Enter your email to sign in to your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" method="POST">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        {searchParams?.message && (
                            <p className="text-sm font-medium text-red-500">
                                {searchParams.message}
                            </p>
                        )}
                        <div className="flex flex-col gap-2">
                            <Button formAction={login} className="w-full">
                                Sign In
                            </Button>
                            <Button
                                formAction={signup}
                                variant="outline"
                                className="w-full"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
