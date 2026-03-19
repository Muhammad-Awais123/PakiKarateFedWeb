import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Event from "../models/Event.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const LEVELS = ["National", "International"];
const TYPES = ["Games", "Championship"];
const CATEGORIES = ["Men", "Women", "Junior", "Senior"];

function addMs(ms) {
  return new Date(Date.now() + ms);
}

function getDateRangeByIndex(index) {
  if (index % 3 === 0) {
    const start = addMs(-(index + 2) * 24 * 60 * 60 * 1000);
    const end = addMs(-(index + 1) * 24 * 60 * 60 * 1000);
    return { startDate: start, endDate: end, status: "completed" };
  }

  if (index === 1) {
    const start = addMs(2 * 60 * 1000);
    const end = addMs(2 * 60 * 60 * 1000);
    return { startDate: start, endDate: end, status: "upcoming" };
  }

  if (index === 2) {
    const start = addMs(5 * 60 * 1000);
    const end = addMs(3 * 60 * 60 * 1000);
    return { startDate: start, endDate: end, status: "upcoming" };
  }

  const start = addMs((index + 3) * 24 * 60 * 60 * 1000);
  const end = addMs((index + 4) * 24 * 60 * 60 * 1000);
  return { startDate: start, endDate: end, status: "upcoming" };
}

function buildDummyEvents() {
  const records = [];
  let index = 0;

  for (const level of LEVELS) {
    for (const type of TYPES) {
      for (const category of CATEGORIES) {
        const { startDate, endDate, status } = getDateRangeByIndex(index);
        const event_name = `${level} ${type} ${category}`;
        records.push({
          event_name,
          name: event_name,
          title: event_name,
          level,
          type,
          category,
          startDate,
          endDate,
          location: index % 2 === 0 ? "Lahore" : "Tokyo",
          description: `[DUMMY] ${level} level ${type.toLowerCase()} for ${category.toLowerCase()} division.`,
          image: "",
          bannerImage: "",
          status,
          isPublished: true,
          isFeatured: index < 3,
          showCountdown: true,
        });
        index += 1;
      }
    }
  }

  return records;
}

async function seed() {
  const events = buildDummyEvents();
  for (const event of events) {
    await Event.findOneAndUpdate(
      { event_name: event.event_name },
      event,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${events.length} dummy events with start/end dates.`);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await seed();
    await mongoose.disconnect();
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Dummy event seed failed:", error);
    process.exit(1);
  });
