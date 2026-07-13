import ApprobationsClient from "./ApprobationClient";
import RequireRole from "@/components/RequireRole";

export default function ApprobationsPage() {
    return (
        <RequireRole>
            <ApprobationsClient />
        </RequireRole>
    );
}