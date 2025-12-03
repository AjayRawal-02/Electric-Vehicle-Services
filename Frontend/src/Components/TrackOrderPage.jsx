import { useParams } from "react-router-dom";
import TrackOrder from "./TrackOrder";

export default function TrackOrderPage() {
  const { bookingId } = useParams();
  return <TrackOrder bookingId={bookingId} />;
}
