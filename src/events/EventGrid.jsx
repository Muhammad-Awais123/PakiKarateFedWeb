import EventCard from "./EventCard";

export default function EventGrid({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center text-slate-400 mt-8">
        No events to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev) => (
        <EventCard key={ev._id} event={ev} />
      ))}
    </div>
  );
}