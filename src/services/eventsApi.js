import axios from "../utils/axiosConfig";
import normalizeEvent from "../events/normalizeEvent";
import { getDummyEventById, getDummyEvents } from "../mocks/eventsDummyData";

const USE_MOCK_EVENTS = import.meta.env.VITE_USE_MOCK_EVENTS === "true";

function delay(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function applyParamsFilter(list, params = {}) {
  return list
    .filter((event) => (params.level ? event.level === params.level : true))
    .filter((event) => (params.type ? event.type === params.type : true))
    .filter((event) => (params.category ? event.category === params.category : true))
    .filter((event) => (params.status ? event.status === params.status : true));
}

export async function fetchEvents(params = {}) {
  if (USE_MOCK_EVENTS) {
    await delay(450);
    const mockList = applyParamsFilter(getDummyEvents(), params);
    return mockList.map(normalizeEvent);
  }

  const response = await axios.get("/events", { params });
  const list = Array.isArray(response?.data?.data) ? response.data.data : [];
  return list.map(normalizeEvent);
}

export async function fetchEventById(id) {
  if (USE_MOCK_EVENTS) {
    await delay(250);
    const item = getDummyEventById(id);
    return item ? normalizeEvent(item) : null;
  }

  const response = await axios.get(`/events/${id}`);
  const item = response?.data?.data ?? null;
  return item ? normalizeEvent(item) : null;
}
