import { useEffect, useState } from "react";
import api from "../services/api";
import EventGrid from "../components/events/EventGrid";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then((res) => {
      setEvents(res.data);
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-10">
        Events & Championships
      </h2>

      <EventGrid events={events} />
    </section>
  );
}