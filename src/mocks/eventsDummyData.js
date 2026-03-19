const LEVELS = ["National", "International"];
const TYPES = ["Games", "Championship"];
const CATEGORIES = ["Men", "Women", "Junior", "Senior"];

const MS_MIN = 60 * 1000;
const MS_HOUR = 60 * MS_MIN;
const MS_DAY = 24 * MS_HOUR;

const LOCATIONS = [
  "Lahore, Pakistan",
  "Tokyo, Japan",
  "Paris, France",
  "Dubai, UAE",
  "Istanbul, Turkey",
  "Cairo, Egypt",
  "Madrid, Spain",
  "Jakarta, Indonesia",
];

function isoFromNow(ms) {
  return new Date(Date.now() + ms).toISOString();
}

function buildMatrixEvents() {
  const events = [];
  let idx = 0;

  for (const level of LEVELS) {
    for (const type of TYPES) {
      for (const category of CATEGORIES) {
        const completed = idx % 4 === 0;

        let date;
        let status;
        if (completed) {
          date = isoFromNow(-(idx + 5) * MS_DAY);
          status = "completed";
        } else if (idx % 4 === 1) {
          date = isoFromNow(3 * MS_MIN);
          status = "upcoming";
        } else if (idx % 4 === 2) {
          date = isoFromNow(2 * MS_DAY);
          status = "upcoming";
        } else {
          date = isoFromNow((idx + 5) * MS_DAY);
          status = "upcoming";
        }

        events.push({
          _id: `dummy-event-${idx + 1}`,
          event_name: `${level} ${type} — ${category}`,
          level,
          type,
          category,
          date,
          startDate: date,
          endDate: isoFromNow(
            completed
              ? -(idx + 3) * MS_DAY
              : new Date(date).getTime() - Date.now() + 2 * MS_DAY
          ),
          location: LOCATIONS[idx % LOCATIONS.length],
          description: `${level} level ${type.toLowerCase()} event for the ${category.toLowerCase()} division. Organized by Pakistan Karate Federation.`,
          image: "",
          status,
        });
        idx++;
      }
    }
  }

  return events;
}

let _cached = null;

export function getDummyEvents() {
  if (!_cached) _cached = buildMatrixEvents();
  return _cached;
}

export function getDummyEventById(id) {
  return getDummyEvents().find((e) => e._id === id) || null;
}

export function getDummyCoverageSummary() {
  const list = getDummyEvents();
  return {
    total: list.length,
    levels: [...new Set(list.map((e) => e.level))],
    types: [...new Set(list.map((e) => e.type))],
    categories: [...new Set(list.map((e) => e.category))],
    statuses: [...new Set(list.map((e) => e.status))],
  };
}
