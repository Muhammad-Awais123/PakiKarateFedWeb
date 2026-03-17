import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <img
        src={event.image}
        alt={event.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">{event.name}</h3>

        <p className="text-sm text-gray-500 mt-1">
          {new Date(event.startDate).toLocaleDateString()}
        </p>

        <p className="text-sm text-gray-600">{event.location}</p>

        <Link
          to={`/events/${event._id}`}
          className="block mt-4 text-center bg-[#008000] text-white py-2 rounded-xl font-semibold"
        >
          Go To Event →
        </Link>
      </div>
    </div>
  );
}