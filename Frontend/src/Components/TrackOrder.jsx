import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import GoogleMapReact from "google-map-react";

/* Modern Marker */
const Marker = ({ label, color }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-4 h-4 rounded-full ${color} animate-pulse`}
    />
    <span className="text-xs font-semibold mt-1 bg-white px-2 py-0.5 rounded shadow">
      {label}
    </span>
  </div>
);

const TrackOrder = ({ bookingId }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://electric-vehicle-services.onrender.com/api/bookings/location/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch location");

      const data = await res.json();
      setLocation(data);
      setLoading(false);
    } catch (error) {
      toast.error("Unable to fetch live location");
      console.error(error);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [fetchLocation]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">
          Tracking live location…
        </p>
      </div>
    );
  }

  const center = {
    lat: location?.provider?.lat ?? location?.customer?.lat,
    lng: location?.provider?.lng ?? location?.customer?.lng,
  };

  return (
    <div className="h-[80vh] w-full rounded-lg overflow-hidden shadow">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_KEY }}
        center={center}
        defaultZoom={14}
      >
        {location?.customer && (
          <Marker
            lat={location.customer.lat}
            lng={location.customer.lng}
            label="Customer"
            color="bg-blue-500"
          />
        )}

        {location?.provider && (
          <Marker
            lat={location.provider.lat}
            lng={location.provider.lng}
            label="Provider"
            color="bg-red-500"
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default TrackOrder;
