import React, { useState, useCallback, useEffect } from "react";

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (typeof window !== "undefined" && window.location?.origin?.includes("localhost")
    ? "http://localhost:5000"
    : "");

function photoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return API_ORIGIN ? `${API_ORIGIN}${photo}` : photo;
}

function roleForPerson(person, type) {
  if (person.title || person.role) return person.title || person.role;
  if (type === "player") {
    if (person.category === "Both") return "Kumite & Kata";
    return person.category || "Athlete";
  }
  if (type === "coach") return person.specialization || "Coach";
  if (type === "legend") return person.notableTitles || "PKF Legend";
  return "—";
}

export default function PersonCard({ person, type, variant = "default" }) {
  const [open, setOpen] = useState(false);
  const img = photoUrl(person.photo);
  const name = person.name || "—";
  const province = person.province || "—";
  const achievements = Array.isArray(person.achievements) ? person.achievements : [];
  const firstAchievement = achievements[0] || null;
  const role = roleForPerson(person, type);
  const social = person.socialLinks || {
    instagram: person.instagram,
    facebook: person.facebook,
  };

  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") setOpen(false);
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onKey]);

  const isLegend = variant === "legend" || type === "legend";
  const imgAspect = isLegend ? "aspect-[3/4] min-h-[320px]" : "aspect-[3/4] min-h-[260px]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative w-full text-left rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#008000] focus:ring-offset-2 ${
          isLegend ? "ring-1 ring-amber-200/60" : ""
        }`}
      >
        <div className={`relative w-full ${imgAspect} bg-gradient-to-b from-gray-100 to-gray-200`}>
          {img ? (
            <img
              src={img}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-semibold">
              PKF
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <span className="inline-block rounded-full bg-[#008000]/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide mb-1">
              {role}
            </span>
            <h3 className="text-lg font-bold leading-tight">{name}</h3>
            <p className="text-xs text-white/80 mt-0.5">{province}</p>
            {isLegend && achievements.length > 0 ? (
              <ul className="mt-2 space-y-1 text-[11px] text-amber-100/95">
                {achievements.slice(0, 3).map((a, i) => (
                  <li key={i} className="line-clamp-2 border-l-2 border-amber-400/60 pl-2">
                    {a}
                  </li>
                ))}
                {achievements.length > 3 ? (
                  <li className="text-amber-200/80 pl-2">+{achievements.length - 3} more</li>
                ) : null}
              </ul>
            ) : firstAchievement ? (
              <p className="text-xs text-white/90 mt-2 line-clamp-2">{firstAchievement}</p>
            ) : null}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#008000] shadow-lg">
              View Profile
            </span>
          </div>
        </div>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`person-modal-${person._id}`}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
            {img ? (
              <img
                src={img}
                alt=""
                loading="lazy"
                className="w-full h-48 object-cover object-top"
              />
            ) : (
              <div className="h-32 bg-gradient-to-r from-[#021f02] to-[#008000]" />
            )}
            <div className="p-6">
              <p className="text-xs font-semibold text-[#008000] uppercase tracking-wide">
                {role}
              </p>
              <h2
                id={`person-modal-${person._id}`}
                className="text-2xl font-bold text-gray-900 mt-1"
              >
                {name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {province}
                {` · ${person.nationality || "Pakistani"}`}
                {person.yearsActive ? ` · ${person.yearsActive}` : ""}
              </p>
              {type === "player" && person.weightClass ? (
                <p className="text-sm text-gray-600 mt-1">{person.weightClass}</p>
              ) : null}

              {person.bio ? (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Bio</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {person.bio}
                  </p>
                </div>
              ) : null}

              {achievements.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Achievements
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(social.instagram || social.facebook) ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {social.instagram ? (
                    <a
                      href={social.instagram.startsWith("http") ? social.instagram : `https://instagram.com/${social.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#008000] hover:underline"
                    >
                      Instagram
                    </a>
                  ) : null}
                  {social.facebook ? (
                    <a
                      href={social.facebook.startsWith("http") ? social.facebook : `https://facebook.com/${social.facebook}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#008000] hover:underline"
                    >
                      Facebook
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
