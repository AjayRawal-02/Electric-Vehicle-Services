import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import GoogleMapReact from "google-map-react";

const Marker = ({ text }) => (
  <div className="font-bold text-red-600">{text} 📍</div>
);

const TrackOrder = ({ bookingId }) => {
  const [location, setLocation] = useState(null);

  const fetchLocation = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/bookings/location/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLocation(data);
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000); // fetch every 5 sec
    return () => clearInterval(interval);
  }, []);

  if (!location) return <p className="p-4">Loading live location...</p>;

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_KEY }}
        center={{
          lat: location.provider?.lat || location.customer.lat,
          lng: location.provider?.lng || location.customer.lng
        }}
        defaultZoom={14}
      >
        {location.customer && (
          <Marker lat={location.customer.lat} lng={location.customer.lng} text="Customer"/>
        )}
        {location.provider && (
          <Marker lat={location.provider.lat} lng={location.provider.lng} text="Provider" />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default TrackOrder;
