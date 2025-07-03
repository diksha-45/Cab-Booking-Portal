import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function NewBooking() {
    const [formData, setFormData] = useState({
        pickup_location: "",
        dropoff_location: "",
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        passenger_count: 1,
        trip_type: "local",
        date_time: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("bookings").insert([
            {
                ...formData,
                status: "upcoming",
                company_id: "<mock-company-id>", // Replace with your company_id logic
                vendor_id: "<mock-vendor-id>",   // Replace with selection later
                date_time: new Date(formData.date_time).toISOString(),
            },
        ]);
        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            alert("Booking created successfully!");
            router.push("/bookings");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Booking</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="pickup_location"
                    onChange={handleChange}
                    placeholder="Pickup Location"
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    name="dropoff_location"
                    onChange={handleChange}
                    placeholder="Drop-off Location"
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    name="guest_name"
                    onChange={handleChange}
                    placeholder="Guest Name"
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    name="guest_email"
                    type="email"
                    onChange={handleChange}
                    placeholder="Guest Email"
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    name="guest_phone"
                    onChange={handleChange}
                    placeholder="Guest Phone"
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    name="passenger_count"
                    type="number"
                    min="1"
                    onChange={handleChange}
                    placeholder="Passenger Count"
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    name="trip_type"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="local">Local</option>
                    <option value="outstation">Outstation</option>
                </select>
                <input
                    name="date_time"
                    type="datetime-local"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
                >
                    {loading ? "Creating..." : "Create Booking"}
                </button>
            </form>
        </div>
    );
}
