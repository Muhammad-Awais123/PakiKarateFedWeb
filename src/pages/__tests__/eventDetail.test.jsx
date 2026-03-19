import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EventDetail from "../EventDetail";

vi.mock("../../services/eventsApi", () => ({
  fetchEventById: vi.fn(async (id) => ({
    _id: id,
    event_name: "Near Time Event",
    level: "National",
    type: "Games",
    category: "Junior",
    date: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    location: "Karachi",
    description: "Near future event for countdown testing.",
    image: "",
    status: "upcoming",
  })),
  fetchEvents: vi.fn(async () => []),
}));

describe("Event detail page", () => {
  it("renders details and large countdown for upcoming events", async () => {
    render(
      <MemoryRouter initialEntries={["/events/dummy-1"]}>
        <Routes>
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: "Near Time Event" })
    ).toBeInTheDocument();
    expect(screen.getByText("Event Starts In")).toBeInTheDocument();
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });
});
