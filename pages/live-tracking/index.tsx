import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function LiveTracking() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (map.current) return; // initialize only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [77.5946, 12.9716], // Bangalore as default
            zoom: 12,
        });

        const marker = new mapboxgl.Marker().setLngLat([77.5946, 12.9716]).addTo(map.current);

        // Simulate driver moving
        let lng = 77.5946;
        let lat = 12.9716;
        const interval = setInterval(() => {
            lng += 0.0005;
            lat += 0.0005;
            marker.setLngLat([lng, lat]);
            map.current!.setCenter([lng, lat]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Live Tracking</h1>
            <div ref={mapContainer} className="w-full h-[500px] rounded shadow"></div>
        </div>
    );
}

