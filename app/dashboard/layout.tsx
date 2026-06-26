import Sidebar from "@/components/dashboard/SIdebar";
import Header from "@/components/dashboard/header";
import Providers from "@/lib/provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <div className="flex h-screen overflow-hidden dark:bg-black bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1 min-w-0 h-screen">
                    <Header />                          {/* natural height, no wrapper div */}
                    <main className="flex-1 pt-20 overflow-y-auto dark:bg-black dark:text-white text-zinc-900 bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </Providers>

    );
}