export type Booking = {
    id: string;
    company_id: string;
    vendor_id: string;
    driver_id?: string;
    vehicle_id?: string;
    pickup_location: string;
    dropoff_location: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    trip_type: "local" | "outstation";
    date_time: string;
    passenger_count: number;
    created_at: string;
};
