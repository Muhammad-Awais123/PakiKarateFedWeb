import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";
import {
  CalendarDays,
  Clock,
  ClipboardList,
  Trophy,
  User,
  Megaphone,
  Star,
} from "lucide-react";

const Card = ({
  icon: IconComponent,
  number,
  label,
  trendText,
  viewAllTo,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#008000]/10 text-[#008000]">
          {React.createElement(IconComponent, { size: 18 })}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{number}</div>
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        </div>
      </div>

      {trendText ? (
        <div className="mt-2 text-xs text-gray-500">{trendText}</div>
      ) : null}

      <Link
        to={viewAllTo}
        className="mt-4 inline-flex items-center text-sm font-semibold text-[#008000] hover:underline"
      >
        View All
      </Link>
    </div>
  );
};

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          axios.get("/admin/events"),
          axios.get("/admin/registrations"),
          axios.get("/admin/players"),
          axios.get("/admin/coaches"),
          axios.get("/rankings"),
          axios.get("/admin/legends"),
        ]);

        const getData = (r) => (r.status === "fulfilled" ? r.value?.data : null);
        const eventsRes = getData(results[0]);
        const regsRes = getData(results[1]);
        const playersRes = getData(results[2]);
        const coachesRes = getData(results[3]);
        const rankingsRes = getData(results[4]);
        const legendsRes = getData(results[5]);

        const events = Array.isArray(eventsRes?.data) ? eventsRes.data : [];
        const regs = Array.isArray(regsRes?.data) ? regsRes.data : [];
        const players = Array.isArray(playersRes?.data) ? playersRes.data : [];
        const coaches = Array.isArray(coachesRes?.data) ? coachesRes.data : [];
        const rankings = Array.isArray(rankingsRes?.data)
          ? rankingsRes.data
          : Array.isArray(rankingsRes) ? rankingsRes : [];
        const legends = Array.isArray(legendsRes?.data) ? legendsRes.data : [];

        const totalEvents = events.length;
        const now = new Date();
        const upcomingEvents = events.filter(
          (e) =>
            (e?.computedStatus === "upcoming" ||
              (e?.startDate && new Date(e.startDate) > now)) &&
            e?.computedStatus !== "cancelled"
        ).length;
        const pendingRegistrations = regs.filter(
          (r) => r?.status === "pending"
        ).length;

        const totalAthletes = players.length;
        const totalCoaches = coaches.length;
        const totalRankings = rankings.length;

        const totalLegends = legends.length;

        const nextCounts = {
          totalEvents,
          upcomingEvents,
          pendingRegistrations,
          totalAthletes,
          totalCoaches,
          totalRankings,
          totalLegends,
        };

        if (alive) setCounts(nextCounts);
      } catch {
        if (alive) setCounts(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  if (loading && !counts) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!counts) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
        Failed to load dashboard stats.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card
          icon={CalendarDays}
          number={counts.totalEvents}
          label="Total Events"
          trendText={counts.upcomingEvents > 0 ? `${counts.upcomingEvents} upcoming` : "No upcoming events"}
          viewAllTo="/admin/dashboard/events"
        />
        <Card
          icon={Clock}
          number={counts.upcomingEvents}
          label="Upcoming Events"
          trendText={
            counts.totalEvents > 0
              ? `${counts.upcomingEvents} of ${counts.totalEvents} events`
              : "—"
          }
          viewAllTo="/admin/dashboard/events"
        />
        <Card
          icon={ClipboardList}
          number={counts.pendingRegistrations}
          label="Pending Registrations"
          trendText="Awaiting admin approval"
          viewAllTo="/admin/dashboard/registrations"
        />
        <Card
          icon={User}
          number={counts.totalAthletes}
          label="Total Athletes"
          trendText="Players in the system"
          viewAllTo="/admin/dashboard/players"
        />
        <Card
          icon={Megaphone}
          number={counts.totalCoaches}
          label="Total Coaches"
          trendText="Coaches in the system"
          viewAllTo="/admin/dashboard/coaches"
        />
        <Card
          icon={Trophy}
          number={counts.totalRankings}
          label="Total Rankings"
          trendText="Ranked entries available"
          viewAllTo="/admin/dashboard/rankings"
        />
        <Card
          icon={Star}
          number={counts.totalLegends ?? 0}
          label="Legends"
          trendText="Hall of Fame entries"
          viewAllTo="/admin/dashboard/legends"
        />
      </div>
    </div>
  );
}

