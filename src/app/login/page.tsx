import { redirect } from "next/navigation";

// Auth flow is removed for the MVP. Keep this route for backwards compatibility,
// but immediately send users to the dashboard.
export default function LoginPage() {
    redirect("/dashboard");
}
