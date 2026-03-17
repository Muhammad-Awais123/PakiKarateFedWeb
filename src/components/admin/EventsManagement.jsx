import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig.js";

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    categoryId: "",
    location: "",
    startDate: "",
    endDate: "",
    type: "",
    status: "upcoming",
    description: "",
    registrationLink: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchEvents = async () => {
    const { data } = await axios.get("/events");
    setEvents(Array.isArray(data?.data) ? data.data : []);
  };

  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    setCategories(Array.isArray(data?.data) ? data.data : []);
  };

  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    const fd = new FormData();
    Object.entries(newEvent).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);

    await axios.post("/admin/events", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setNewEvent({
      name: "",
      categoryId: "",
      location: "",
      startDate: "",
      endDate: "",
      type: "",
      status: "upcoming",
      description: "",
      registrationLink: "",
    });
    setImage(null);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/admin/events/${id}`);
    fetchEvents();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Events</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={newEvent.name}
            onChange={(e) => setNewEvent((p) => ({ ...p, name: e.target.value }))}
            placeholder="Event title"
            className="border rounded-xl px-3 py-2"
          />
          <select
            value={newEvent.categoryId}
            onChange={(e) => setNewEvent((p) => ({ ...p, categoryId: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={newEvent.location}
            onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))}
            placeholder="Location"
            className="border rounded-xl px-3 py-2"
          />
          <input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent((p) => ({ ...p, startDate: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          />
          <input
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent((p) => ({ ...p, endDate: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          />
          <input
            value={newEvent.type}
            onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value }))}
            placeholder="Type (optional)"
            className="border rounded-xl px-3 py-2"
          />
          <select
            value={newEvent.status}
            onChange={(e) => setNewEvent((p) => ({ ...p, status: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <input
            value={newEvent.registrationLink}
            onChange={(e) => setNewEvent((p) => ({ ...p, registrationLink: e.target.value }))}
            placeholder="Registration link (optional)"
            className="border rounded-xl px-3 py-2"
          />
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description"
            className="border rounded-xl px-3 py-2 sm:col-span-2"
            rows={3}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="sm:col-span-2"
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 px-5 py-2 rounded-xl bg-[#008000] text-white font-semibold"
        >
          Add Event
        </button>
      </div>

      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev._id}
            className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{ev.name}</div>
              <div className="text-sm text-gray-600">
                {ev.location} • {String(ev.status || "").toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => handleDelete(ev._id)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManagement;