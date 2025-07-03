import { Booking } from "@/types/booking";

interface BookingCardProps {
    booking: Booking;
    onAction?: (id: string, action: string) => void; // optional for actions
}

export default function BookingCard({ booking, onAction }: BookingCardProps) {
    const statusColor = {
        upcoming: "text-blue-600",
        ongoing: "text-yellow-600",
        completed: "text-green-600",
        cancelled: "text-red-600",
    }[booking.status];

    return (
        <div className="bg-white p-4 rounded shadow border hover:shadow-md transition space-y-1">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold">{booking.guest_name}</h3>
                <span className={`text-sm font-semibold ${statusColor}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </div>
            <p className="text-sm text-gray-700">
                <strong>Pickup:</strong> {booking.pickup_location}
            </p>
            <p className="text-sm text-gray-700">
                <strong>Drop-off:</strong> {booking.dropoff_location}
            </p>
            <p className="text-sm text-gray-700">
                <strong>Trip Type:</strong> {booking.trip_type.charAt(0).toUpperCase() + booking.trip_type.slice(1)} |{" "}
                <strong>Passengers:</strong> {booking.passenger_count}
            </p>
            <p className="text-sm text-gray-700">
                <strong>Date:</strong> {new Date(booking.date_time).toLocaleString()}
            </p>

            {onAction && (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onAction(booking.id, "view")}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                        View
                    </button>
                    {booking.status === "upcoming" && (
                        <button
                            onClick={() => onAction(booking.id, "cancel")}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                            Cancel
                        </button>
                    )}
                     {booking.status === "ongoing" && (
            <button
                onClick={() => onAction(booking.id, "endTrip")}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
            >
                End Trip
            </button>
        )}
        {booking.status === "upcoming" && (
            <button
                onClick={() => onAction(booking.id, "cancel")}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
            >
                Cancel
            </button>
        )}
                </div>
            )}
        </div>
    );
}
