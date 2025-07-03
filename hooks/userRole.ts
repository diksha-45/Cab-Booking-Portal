import { useState, useEffect } from "react";
import { getUserRole } from "../lib/auth";

export default function useRole() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRole() {
            const userRole = await getUserRole();
            setRole(userRole);
            setLoading(false);
        }
        fetchRole();
    }, []);

    return { role, loading };
}
