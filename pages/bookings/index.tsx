import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import BookingCard from "@/components/BookingCard";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase.from("bookings").select("*");
            if (error) {
                console.error(error);
            } else {
                setBookings(data);
            }
            setLoading(false);
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
                    } else if (payload.eventType === "UPDATE") {
                        setBookings((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? payload.new : b))
                        );
                    } else if (payload.eventType === "DELETE") {
                        setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleAction = async (id: string, action: string) => {
         if (action === "startTrip") {
        const { error } = await supabase
        .from("bookings")
        .update({ status: "ongoing" })
        .eq("id", id);
        if (error) 
        alert(error.message);
        else alert("Trip started.");
    } 
    else if (action === "endTrip") {
        const { error } = await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", id);
        if (!error) {
        await supabase.from("invoices").insert([
            { booking_id: id, payment_status: "unpaid" }
        ]);
        alert("Trip completed and invoice generated.");
    } else {
        alert(error.message);
    }
    } 
        else if (action === "cancel") {
            const { error } = await supabase
                .from("bookings")
                .update({ status: "cancelled" })
                .eq("id", id);
            if (error) {
                console.error("Error cancelling booking:", error);
                alert("Failed to cancel booking.");
            } else {
                alert("Booking cancelled.");
            }
        } else if (action === "view") {
            // Future: open booking details modal or page
            alert(`View booking ${id}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Bookings</h1>

            {loading ? (
                <p>Loading...</p>
            ) : bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
