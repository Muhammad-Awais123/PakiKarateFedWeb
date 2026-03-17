import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => {
      setEvent(res.data);
    });
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <img
        src={event.image}
        className="rounded-2xl mb-6 w-full"
      />

      <h1 className="text-3xl font-bold">{event.name}</h1>

      <p className="mt-4 text-gray-600">{event.description}</p>

      <Link
        to={`/register/${event._id}`}
        className="inline-block mt-6 bg-[#008000] text-white px-6 py-3 rounded-xl font-semibold"
      >
        Register Now
      </Link>
    </div>
  );
}