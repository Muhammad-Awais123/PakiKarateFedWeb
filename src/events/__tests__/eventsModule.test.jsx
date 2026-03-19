import { MemoryRouter } from "react-router-dom";
import { act } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import CountdownTimer from "../CountdownTimer";
import EventCard from "../EventCard";
import { getDummyCoverageSummary, getDummyEvents } from "../../mocks/eventsDummyData";
import EventsPage from "../../pages/Events";

vi.mock("../../services/eventsApi", async () => {
  const actual = await vi.importActual("../../mocks/eventsDummyData");
  return {
    fetchEvents: vi.fn(async () => actual.getDummyEvents()),
    fetchEventById: vi.fn(async (id) => actual.getDummyEventById(id)),
  };
});

describe("Events module — dummy data coverage", () => {
  it("covers all required level/type/category/status combinations", () => {
    const summary = getDummyCoverageSummary();
    expect(summary.total).toBe(16);
    expect(summary.levels).toEqual(expect.arrayContaining(["National", "International"]));
    expect(summary.types).toEqual(expect.arrayContaining(["Games", "Championship"]));
    expect(summary.categories).toEqual(
      expect.arrayContaining(["Men", "Women", "Junior", "Senior"])
    );
    expect(summary.statuses).toEqual(expect.arrayContaining(["upcoming", "completed"]));
  });

  it("filters events by manual JS filter matching drill-down logic", () => {
    const list = getDummyEvents();
    const filtered = list.filter(
      (e) =>
        e.level === "International" &&
        e.type === "Championship" &&
        e.category === "Women"
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0]).toMatchObject({
      level: "International",
      type: "Championship",
      category: "Women",
    });
  });
});

describe("Countdown behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-19T18:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates every second and expires to Event Started", () => {
    render(
      <CountdownTimer
        targetDate="2026-03-19T18:00:03.000Z"
        size="sm"
        expiredLabel="Event Started"
      />
    );

    const timer = screen.getByRole("timer");
    expect(timer).toHaveTextContent(/03s/i);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(timer).toHaveTextContent(/02s/i);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Event Started")).toBeInTheDocument();
  });

  it("hides countdown for completed event cards", () => {
    const completed = {
      _id: "x1",
      event_name: "Completed Test Event",
      level: "National",
      type: "Games",
      category: "Men",
      date: "2026-03-18T18:00:00.000Z",
      location: "Lahore",
      description: "Done event",
      image: "",
      status: "completed",
    };

    render(
      <MemoryRouter>
        <EventCard event={completed} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });
});

describe("Events page — nested drill-down tabs", () => {
  it("renders hero, level tabs, and default events for National > Men > Games", async () => {
    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Karate Events")).toBeInTheDocument();

    const nationalBtns = screen.getAllByRole("button", { name: /National/i });
    expect(nationalBtns.length).toBeGreaterThanOrEqual(1);

    const intlBtns = screen.getAllByRole("button", { name: /International/i });
    expect(intlBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("switches level tab and updates breadcrumb", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    await screen.findByText("Karate Events");

    const intlBtns = screen.getAllByRole("button", { name: /International/i });
    await user.click(intlBtns[0]);

    expect(screen.getByText(/International › Men › Games/)).toBeInTheDocument();
  });
});
