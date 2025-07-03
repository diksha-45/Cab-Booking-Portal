import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<string[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase.from("bookings").select("*");
            if (error) {
                console.error("Error fetching bookings:", error);
            } else {
                setBookings(data);
            }
        };

        fetchBookings();

        const channel = supabase
            .channel("realtime_bookings")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "bookings" },
                (payload) => {
                    console.log("Realtime payload:", payload);

                    if (payload.eventType === "INSERT") {
                        setBookings((prev) => [payload.new, ...prev]);
                        setRecentActivity((prev) => [
                            `Booking ID ${payload.new.id} created for ${payload.new.customer_name}`,
                            ...prev,
                        ]);
                    } else if (payload.eventType === "UPDATE") {
                        setBookings((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? payload.new : b))
                        );
                        setRecentActivity((prev) => [
                            `Booking ID ${payload.new.id} updated`,
                            ...prev,
                        ]);
                    } else if (payload.eventType === "DELETE") {
                        setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
                        setRecentActivity((prev) => [
                            `Booking ID ${payload.old.id} deleted`,
                            ...prev,
                        ]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden block text-white focus:outline-none"
                >
                    ☰
                </button>
                <h1 className="text-xl font-bold">Company Dashboard</h1>
                <button
                    onClick={() => router.push("/login")}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                    Logout
                </button>
            </nav>

            {/* Main content with sidebar */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside
                    className={`bg-gray-100 w-64 p-4 space-y-4 ${
                        sidebarOpen ? "block" : "hidden"
                    } md:block`}
                >
                    <button
                        className="w-full text-left p-2 rounded hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push("/dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push("/bookings")}
                    >
                        Bookings
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push("/new-booking")}
                    >
                        New Booking
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push("/invoices")}
                    >
                        Invoices
                    </button>
                    <button
                        className="w-full text-left p-2 rounded hover:bg-blue-500 hover:text-white"
                        onClick={() => router.push("/live-tracking")}
                    >
                        Live Tracking
                    </button>
                </aside>

                {/* Dashboard content */}
                <main className="flex-1 p-6 bg-white">
                    <h2 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h2>

                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-100 p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">Total Bookings</h3>
                            <p className="text-2xl font-bold mt-2">{bookings.length}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">Upcoming Trips</h3>
                            <p className="text-2xl font-bold mt-2">
                                {bookings.filter((b) => b.status === "upcoming").length}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">Ongoing Trips</h3>
                            <p className="text-2xl font-bold mt-2">
                                {bookings.filter((b) => b.status === "ongoing").length}
                            </p>
                        </div>
                        <div className="bg-red-100 p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">Cancelled</h3>
                            <p className="text-2xl font-bold mt-2">
                                {bookings.filter((b) => b.status === "cancelled").length}
                            </p>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="bg-gray-50 p-4 rounded shadow">
                        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500">No recent activity yet.</p>
                        ) : (
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {recentActivity.slice(0, 10).map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
