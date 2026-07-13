import Sidebar from "@/components/dashboard/SIdebar";
import Header from "@/components/dashboard/header";
import Providers from "@/lib/provider";
import { AuthProvider } from "@/lib/authContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <AuthProvider>
                <div className="flex h-screen overflow-hidden dark:bg-surface-page-dark bg-surface-page">
                    <Sidebar />
                    <div className="flex flex-col flex-1 min-w-0 h-screen">
                        <Header />                          {/* natural height, no wrapper div */}
                        <main className="flex-1 pt-0 scroll-smooth overflow-y-auto dark:bg-surface-page-dark dark:text-white text-zinc-900 bg-surfac-page">
                            {children}
                        </main>
                    </div>
                </div>
            </AuthProvider>
        </Providers>

    );
}