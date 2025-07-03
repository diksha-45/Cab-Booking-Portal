import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Booking } from "@/types/booking";

interface Invoice {
    id: string;
    booking_id: string;
    payment_status: "paid" | "unpaid";
    created_at: string;
    booking: Booking;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("invoices")
            .select("*, booking:booking_id(*)")
            .order("created_at", { ascending: false });
        if (error) console.error(error);
        else setInvoices(data || []);
        setLoading(false);
    };

    const markAsPaid = async (id: string) => {
        const { error } = await supabase.from("invoices").update({ payment_status: "paid" }).eq("id", id);
        if (error) alert(error.message);
        else {
            alert("Invoice marked as paid.");
            fetchInvoices();
        }
    };

    const downloadInvoice = (invoice: Invoice) => {
        const content = `
        Invoice ID: ${invoice.id}
        Booking ID: ${invoice.booking_id}
        Guest Name: ${invoice.booking.guest_name}
        Pickup: ${invoice.booking.pickup_location}
        Drop-off: ${invoice.booking.dropoff_location}
        Date: ${new Date(invoice.booking.date_time).toLocaleString()}
        Payment Status: ${invoice.payment_status}
        `;
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${invoice.id}.txt`;
        link.click();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Invoices</h1>
            {loading ? (
                <p>Loading...</p>
            ) : invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <div className="space-y-4">
                    {invoices.map(invoice => (
                        <div key={invoice.id} className="bg-white p-4 rounded shadow border hover:shadow-md transition space-y-1">
                            <p className="text-sm text-gray-700">
                                <strong>Invoice ID:</strong> {invoice.id}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Guest:</strong> {invoice.booking.guest_name}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Pickup:</strong> {invoice.booking.pickup_location} | <strong>Drop-off:</strong> {invoice.booking.dropoff_location}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Date:</strong> {new Date(invoice.booking.date_time).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Payment Status:</strong>{" "}
                                <span className={invoice.payment_status === "paid" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                    {invoice.payment_status}
                                </span>
                            </p>
                            <div className="flex gap-2 mt-2">
                                {invoice.payment_status === "unpaid" && (
                                    <button
                                        onClick={() => markAsPaid(invoice.id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                                    >
                                        Mark as Paid
                                    </button>
                                )}
                                <button
                                    onClick={() => downloadInvoice(invoice)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

