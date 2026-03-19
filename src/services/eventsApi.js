import axios from "../utils/axiosConfig";
import normalizeEvent from "../events/normalizeEvent";

export async function fetchEvents(params = {}) {
  const response = await axios.get("/events", { params });
  const list = Array.isArray(response?.data?.data) ? response.data.data : [];
  return list.map(normalizeEvent);
}

export async function fetchEventById(id) {
  const response = await axios.get(`/events/${id}`);
  const item = response?.data?.data ?? null;
  return item ? normalizeEvent(item) : null;
}
