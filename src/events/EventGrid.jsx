import EventCard from "./EventCard";

export default function EventGrid({ events }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev) => (
        <EventCard key={ev._id} event={ev} />
      ))}
    </div>
  );
}