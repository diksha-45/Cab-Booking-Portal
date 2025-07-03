import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Booking } from "@/types/booking";

export default function VendorDashboard() {
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetchPendingBookings();

        const channel = supabase
            .channel('bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
                console.log('Realtime update:', payload);
                fetchPendingBookings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPendingBookings = async () => {
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .eq("status", "pending") // assuming new bookings default to 'pending'
            .order("date_time", { ascending: true });
        if (error) console.error(error);
        else setPendingBookings(data || []);
    };

    const handleAction = async (id: string, action: "accept" | "reject" | "open_market") => {
        let updateData = {};
        if (action === "accept") {
            // Mock assign driver + vehicle
            updateData = { status: "upcoming", driver_id: "<mock-driver-id>", vehicle_id: "<mock-vehicle-id>" };
        } else if (action === "reject") {
            updateData = { status: "cancelled" };
        } else if (action === "open_market") {
            updateData = { status: "open_market" };
        }
        const { error } = await supabase
            .from("bookings")
            .update(updateData)
            .eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            alert(`Booking ${action}ed successfully`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings currently.</p>
            ) : (
                <div className="space-y-4">
                    {pendingBookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 rounded shadow border hover:shadow-md transition">
                            <h3 className="text-lg font-semibold mb-1">{booking.guest_name}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Pickup:</strong> {booking.pickup_location} | <strong>Drop-off:</strong> {booking.dropoff_location}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Trip Type:</strong> {booking.trip_type} | <strong>Passengers:</strong> {booking.passenger_count}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Date:</strong> {new Date(booking.date_time).toLocaleString()}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(booking.id, "accept")}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction(booking.id, "reject")}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction(booking.id, "open_market")}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Open Market
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
