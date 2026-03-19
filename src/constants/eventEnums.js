/**
 * Must stay in sync with backend `models/Event.js` enum values.
 * Used by admin Events form so saves always match Mongoose validation.
 */

export const EVENT_LEVEL_OPTIONS = ["National", "International"];

export const EVENT_TYPE_OPTIONS = ["Games", "Championship"];

export const EVENT_CATEGORY_OPTIONS = [
  "Men",
  "Women",
  "Junior",
  "Senior",
  "our_event",
  "external_event",
];

export const EVENT_STATUS_OPTIONS = ["upcoming", "ongoing", "completed", "cancelled"];

export const EVENT_MAJOR_CATEGORY_OPTIONS = [
  "national_championship",
  "provincial_circuit",
  "open_tournament",
  "youth_circuit",
  "international",
  "multisport",
  "para_karate",
  "training_camp",
  "other",
];

/** Optional sub-series; empty string in UI → stored as null on backend. */
export const EVENT_SERIES_NAME_OPTIONS = [
  "PKF Premier League",
  "PKF Provincial Circuit",
  "PKF Youth League",
  "PKF Cadet Circuit",
  "PKF Open Series",
  "South Asian Games",
  "Asian Karate Championships",
  "World Karate Championships",
  "Commonwealth Games",
  "Islamic Solidarity Games",
  "Other International",
];

export const EVENT_OWNERSHIP_OPTIONS = ["pkf_event", "external_event"];
