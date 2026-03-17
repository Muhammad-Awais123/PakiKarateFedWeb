// import React, { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import axiosInstance from "../utils/axiosConfig.js";

// function formatDate(d) {
//   try {
//     return new Date(d).toLocaleDateString();
//   } catch {
//     return "";
//   }
// }

// function statusBadge(status) {
//   const s = String(status || "").toLowerCase();
//   if (s === "ongoing") return "bg-amber-100 text-amber-800";
//   if (s === "completed") return "bg-zinc-200 text-zinc-800";
//   return "bg-emerald-100 text-emerald-800";
// }

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await axiosInstance.get("/events");
//         const list = Array.isArray(res?.data?.data) ? res.data.data : [];
//         setEvents(list);
//       } catch (e) {
//         setError(e?.response?.data?.message || e?.message || "Failed to load events.");
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const filtered = useMemo(() => {
//     if (filter === "all") return events;
//     return events.filter((ev) => String(ev?.status || "").toLowerCase() === filter);
//   }, [events, filter]);

//   return (
//     <section
//       id="events"
//       className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-black"
//     >
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-10">
//           <span className="inline-block px-4 py-2 bg-[#008000]/10 rounded-full text-[#008000] text-sm font-semibold mb-4">
//             TOURNAMENTS & CHAMPIONSHIPS
//           </span>
//           <h2 className="text-4xl font-bold text-gray-900 dark:text-zinc-50">
//             Upcoming & Ongoing Events
//           </h2>

//           <div className="flex justify-center gap-3 mt-6 flex-wrap">
//             {[
//               { key: "all", label: "All" },
//               { key: "upcoming", label: "Upcoming" },
//               { key: "ongoing", label: "Ongoing" },
//               { key: "completed", label: "Completed" },
//             ].map((s) => (
//               <button
//                 key={s.key}
//                 onClick={() => setFilter(s.key)}
//                 className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
//                   filter === s.key
//                     ? "bg-[#008000] text-white"
//                     : "bg-gray-100 text-gray-800 dark:bg-zinc-900 dark:text-zinc-100"
//                 }`}
//               >
//                 {s.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-10 text-gray-600 dark:text-zinc-300">
//             Loading events...
//           </div>
//         ) : error ? (
//           <div className="text-center py-10 text-red-600">{error}</div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-10 text-gray-600 dark:text-zinc-300">
//             No events available.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filtered.map((ev) => (
//               <div
//                 key={ev._id}
//                 className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800"
//               >
//                 <div className="h-48 bg-gray-100 dark:bg-zinc-900 overflow-hidden">
//                   <img
//                     src={ev.image || "/placeholder.jpg"}
//                     alt={ev.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = "/placeholder.jpg";
//                     }}
//                   />
//                 </div>

//                 <div className="p-5">
//                   <div className="flex items-center justify-between gap-3 mb-2">
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">
//                       {ev.name}
//                     </h3>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
//                         ev.status
//                       )}`}
//                     >
//                       {String(ev.status || "upcoming").toUpperCase()}
//                     </span>
//                   </div>

//                   <p className="text-sm text-gray-600 dark:text-zinc-300">
//                     {ev.location || ev?.categoryId?.name || "Pakistan Karate Federation"}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
//                     {formatDate(ev.startDate)} - {formatDate(ev.endDate)}
//                   </p>

//                   <div className="mt-4 flex gap-3">
//                     <Link
//                       to={`/events/${ev._id}`}
//                       className="flex-1 text-center bg-[#008000] text-white py-3 rounded-xl font-semibold"
//                     >
//                       Go To Event →
//                     </Link>
//                     <Link
//                       to={`/events/${ev._id}?register=1`}
//                       className="flex-1 text-center border border-[#008000] text-[#008000] py-3 rounded-xl font-semibold"
//                     >
//                       Register Now
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosConfig.js";

const DEFAULT_CONFIG_ENDPOINT = "/registration/config";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options
    .map((opt) => {
      if (opt == null) return null;
      if (typeof opt === "string" || typeof opt === "number") {
        return { value: String(opt), label: String(opt) };
      }
      const value = opt.value ?? opt.id ?? opt._id ?? opt.key;
      const label = opt.label ?? opt.name ?? opt.title ?? String(value ?? "");
      if (value == null) return null;
      return { value: String(value), label: String(label) };
    })
    .filter(Boolean);
}

function isTruthy(v) {
  return v === true || v === "true" || v === "on" || v === 1 || v === "1";
}

function buildInitialValuesFromSchema(schema) {
  const values = {};
  const sections = Array.isArray(schema?.sections) ? schema.sections : [];
  for (const section of sections) {
    const fields = Array.isArray(section?.fields) ? section.fields : [];
    for (const f of fields) {
      if (!f?.name) continue;
      const type = f.type || "text";
      if (type === "checkbox") values[f.name] = Boolean(f.defaultValue ?? false);
      else if (type === "checkboxGroup") values[f.name] = Array.isArray(f.defaultValue) ? f.defaultValue : [];
      else if (type === "file") values[f.name] = null;
      else values[f.name] = f.defaultValue ?? "";
    }
  }
  return values;
}

function validateAgainstSchema(schema, values) {
  const errors = {};
  const sections = Array.isArray(schema?.sections) ? schema.sections : [];
  for (const section of sections) {
    const fields = Array.isArray(section?.fields) ? section.fields : [];
    for (const f of fields) {
      if (!f?.name) continue;
      if (!f.required) continue;

      const v = values?.[f.name];
      const type = f.type || "text";

      const missing =
        v == null ||
        (typeof v === "string" && v.trim() === "") ||
        (Array.isArray(v) && v.length === 0) ||
        (type === "checkbox" && !isTruthy(v)) ||
        (type === "file" && !(v instanceof File));

      if (missing) errors[f.name] = f.requiredMessage || "This field is required.";
    }
  }
  return errors;
}

function FieldShell({ id, label, hint, required, error, children }) {
  return (
    <div className="space-y-1">
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-zinc-800 dark:text-zinc-100"
        >
          {label} {required ? <span className="text-red-600">*</span> : null}
        </label>
      ) : null}

      {children}

      {hint ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function TextInput({ id, value, onChange, type = "text", placeholder, autoComplete }) {
  return (
    <input
      id={id}
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={cx(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        "bg-white text-zinc-900 border-zinc-200 focus:border-[var(--color-primary)]",
        "dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
      )}
    />
  );
}

function TextArea({ id, value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cx(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        "bg-white text-zinc-900 border-zinc-200 focus:border-[var(--color-primary)]",
        "dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
      )}
    />
  );
}

function Select({ id, value, onChange, options, placeholder }) {
  return (
    <select
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={cx(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        "bg-white text-zinc-900 border-zinc-200 focus:border-[var(--color-primary)]",
        "dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
      )}
    >
      <option value="">{placeholder || "Select..."}</option>
      {normalizeOptions(options).map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {normalizeOptions(options).map((opt) => {
        const checked = String(value ?? "") === opt.value;
        return (
          <label
            key={opt.value}
            className={cx(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer select-none",
              checked
                ? "border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_12%,transparent)]"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="accent-[var(--color-primary)]"
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function Checkbox({ id, checked, onChange, label }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <input
        id={id}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-[var(--color-primary)]"
      />
      <span className="leading-5">{label}</span>
    </label>
  );
}

function CheckboxGroup({ name, value, onChange, options }) {
  const selected = Array.isArray(value) ? value.map(String) : [];
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {normalizeOptions(options).map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cx(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer select-none",
              checked
                ? "border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_12%,transparent)]"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
              "text-zinc-900 dark:text-zinc-100"
            )}
          >
            <input
              type="checkbox"
              name={name}
              checked={checked}
              onChange={(e) => {
                const next = e.target.checked
                  ? Array.from(new Set([...selected, opt.value]))
                  : selected.filter((v) => v !== opt.value);
                onChange(next);
              }}
              className="accent-[var(--color-primary)]"
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function FileInput({ id, accept, onChange }) {
  return (
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      className={cx(
        "block w-full text-sm",
        "file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-white file:font-semibold",
        "text-zinc-700 dark:text-zinc-200"
      )}
    />
  );
}

function formatEventLabel(ev) {
  const name = ev?.name || ev?.title || "Event";
  const start = ev?.startDate || ev?.date || ev?.eventDate;
  if (!start) return name;
  try {
    const d = new Date(start);
    return `${name} (${d.toLocaleDateString()})`;
  } catch {
    return name;
  }
}

/**
 * Event registration form driven entirely by backend schema/config.
 *
 * Backend suggestion:
 * - GET /api/registration/config -> { schema, options, eventCategoryFieldName?, eventFieldName?, eventDateFieldName? }
 * - schema.sections[].fields[] supports:
 *   { name, label, type, required, hint, placeholder, defaultValue, autoComplete, accept, options, optionsKey }
 */
export default function Event({
  configPath = DEFAULT_CONFIG_ENDPOINT,
  onSubmit,
  className,
}) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [schema, setSchema] = useState(null);
  const [optionsByKey, setOptionsByKey] = useState({});

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");

  const eventCategoryFieldName = schema?.meta?.eventCategoryFieldName || "eventCategory";
  const eventFieldName = schema?.meta?.eventFieldName || "eventId";
  const eventDateFieldName = schema?.meta?.eventDateFieldName || "eventDate";

  const allEvents = useMemo(() => {
    const key = schema?.meta?.eventsOptionsKey || "events";
    const opts = optionsByKey?.[key];
    if (!Array.isArray(opts)) return [];
    return opts;
  }, [optionsByKey, schema?.meta?.eventsOptionsKey]);

  const selectedEventCategory = values?.[eventCategoryFieldName] ?? "";
  const filteredEvents = useMemo(() => {
    if (!selectedEventCategory) return allEvents;
    return allEvents.filter((ev) => {
      const c = ev?.category ?? ev?.type ?? ev?.eventCategory;
      return String(c ?? "").toLowerCase() === String(selectedEventCategory).toLowerCase();
    });
  }, [allEvents, selectedEventCategory]);

  const setFieldValue = useCallback((name, next) => {
    setValues((v) => ({ ...v, [name]: next }));
    setErrors((e) => {
      if (!e?.[name]) return e;
      const { [name]: _removed, ...rest } = e;
      return rest;
    });
  }, []);

  // If category changes, clear event selection when it becomes invalid.
  useEffect(() => {
    const eventId = values?.[eventFieldName];
    if (!eventId) return;
    const stillValid = filteredEvents.some(
      (ev) => String(ev?._id ?? ev?.id ?? ev?.value ?? "") === String(eventId)
    );
    if (!stillValid) {
      setFieldValue(eventFieldName, "");
      if (eventDateFieldName in (values || {})) setFieldValue(eventDateFieldName, "");
    }
  }, [
    values,
    eventFieldName,
    eventDateFieldName,
    filteredEvents,
    setFieldValue,
  ]);

  // Optionally auto-fill event date from selected event.
  useEffect(() => {
    if (!schema?.meta?.autoFillEventDate) return;
    const eventId = values?.[eventFieldName];
    if (!eventId) return;
    if (!eventDateFieldName) return;
    if (values?.[eventDateFieldName]) return;

    const selected = filteredEvents.find(
      (ev) => String(ev?._id ?? ev?.id ?? ev?.value ?? "") === String(eventId)
    );
    const autoDate = selected?.startDate || selected?.date || selected?.eventDate;
    if (!autoDate) return;
    setFieldValue(eventDateFieldName, String(autoDate).slice(0, 10));
  }, [
    schema?.meta?.autoFillEventDate,
    values,
    eventFieldName,
    eventDateFieldName,
    filteredEvents,
    setFieldValue,
  ]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError("");

    (async () => {
      try {
        const res = await axiosInstance.get(configPath);
        const cfg = res?.data ?? {};

        const nextSchema = cfg.schema || cfg.formSchema || cfg;
        const nextOptions = cfg.options || cfg.optionSets || {};

        if (!nextSchema?.sections) {
          throw new Error("Invalid registration config: missing schema.sections");
        }

        if (!mounted) return;
        setSchema(nextSchema);
        setOptionsByKey(nextOptions);
        setValues((prev) => {
          const initial = buildInitialValuesFromSchema(nextSchema);
          return { ...initial, ...prev };
        });
      } catch (e) {
        if (!mounted) return;
        setLoadError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load registration configuration."
        );
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [configPath]);

  useEffect(() => {
    const photoField = findFirstFileFieldName(schema);
    const file = photoField ? values?.[photoField] : null;
    if (!(file instanceof File)) {
      setPhotoPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [schema, values]);

  function findFirstFileFieldName(s) {
    const sections = Array.isArray(s?.sections) ? s.sections : [];
    for (const section of sections) {
      const fields = Array.isArray(section?.fields) ? section.fields : [];
      for (const f of fields) {
        if ((f?.type || "text") === "file" && f?.name) return f.name;
      }
    }
    return "";
  }

  function resolveFieldOptions(field) {
    if (Array.isArray(field?.options)) return field.options;
    if (field?.optionsKey && optionsByKey?.[field.optionsKey]) return optionsByKey[field.optionsKey];
    if (field?.name === eventFieldName) {
      // If backend didn't wire event options via schema, still keep it dynamic from config optionSets.
      return filteredEvents.map((ev) => ({
        value: String(ev?._id ?? ev?.id ?? ev?.value ?? ""),
        label: formatEventLabel(ev),
      }));
    }
    return [];
  }

  function renderField(field) {
    const name = field.name;
    const id = `event-form-${name}`;
    const type = field.type || "text";

    const commonShellProps = {
      id,
      label: field.label,
      hint: field.hint,
      required: Boolean(field.required),
      error: errors?.[name],
    };

    const value = values?.[name];

    if (type === "textarea") {
      return (
        <FieldShell key={name} {...commonShellProps}>
          <TextArea
            id={id}
            value={value}
            onChange={(v) => setFieldValue(name, v)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
          />
        </FieldShell>
      );
    }

    if (type === "select") {
      const options = resolveFieldOptions(field);
      return (
        <FieldShell key={name} {...commonShellProps}>
          <Select
            id={id}
            value={value}
            onChange={(v) => setFieldValue(name, v)}
            options={options}
            placeholder={field.placeholder}
          />
        </FieldShell>
      );
    }

    if (type === "radio") {
      return (
        <FieldShell key={name} {...commonShellProps}>
          <RadioGroup
            name={name}
            value={value}
            onChange={(v) => setFieldValue(name, v)}
            options={resolveFieldOptions(field)}
          />
        </FieldShell>
      );
    }

    if (type === "checkbox") {
      return (
        <FieldShell key={name} {...commonShellProps}>
          <Checkbox
            id={id}
            checked={Boolean(value)}
            onChange={(v) => setFieldValue(name, v)}
            label={field.checkboxLabel || field.label || "Yes"}
          />
        </FieldShell>
      );
    }

    if (type === "checkboxGroup") {
      return (
        <FieldShell key={name} {...commonShellProps}>
          <CheckboxGroup
            name={name}
            value={value}
            onChange={(v) => setFieldValue(name, v)}
            options={resolveFieldOptions(field)}
          />
        </FieldShell>
      );
    }

    if (type === "file") {
      return (
        <FieldShell key={name} {...commonShellProps}>
          <FileInput
            id={id}
            accept={field.accept}
            onChange={(f) => setFieldValue(name, f)}
          />
        </FieldShell>
      );
    }

    const inputType = type === "date" || type === "email" || type === "tel" || type === "number" ? type : "text";
    return (
      <FieldShell key={name} {...commonShellProps}>
        <TextInput
          id={id}
          type={inputType}
          value={value}
          onChange={(v) => setFieldValue(name, v)}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
        />
      </FieldShell>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!schema) return;

    const nextErrors = validateAgainstSchema(schema, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const hasFile = Object.values(values).some((v) => v instanceof File);

      let payload;
      let payloadType;
      if (hasFile) {
        const fd = new FormData();
        for (const [k, v] of Object.entries(values)) {
          if (v == null) continue;
          if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
          else fd.append(k, v);
        }
        payload = fd;
        payloadType = "formData";
      } else {
        payload = { ...values };
        payloadType = "json";
      }

      if (typeof onSubmit === "function") {
        await onSubmit({ values, payload, payloadType, schema });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={cx("max-w-5xl mx-auto px-4 py-10", className)}>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-700 dark:text-zinc-200">
            Loading registration form...
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={cx("max-w-5xl mx-auto px-4 py-10", className)}>
        <div className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900/60 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-red-700 dark:text-red-400">
            Couldn’t load registration form
          </div>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
            {loadError}
          </p>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Expected endpoint: <span className="font-mono">GET /api{configPath}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("max-w-5xl mx-auto px-4 py-10", className)}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {schema?.title || "Event Registration"}
          </h2>
          {schema?.subtitle ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {schema.subtitle}
            </p>
          ) : null}
        </div>
        {photoPreviewUrl ? (
          <div className="hidden sm:block">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
              <img
                src={photoPreviewUrl}
                alt="Uploaded"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(schema?.sections || []).map((section) => (
          <section
            key={section.id || section.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {section.title}
              </h3>
              {section.description ? (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {section.description}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(section.fields || []).map((field) => {
                if (!field?.name) return null;
                const colSpan = field.colSpan === 2 ? "sm:col-span-2" : "";

                return (
                  <div key={field.name} className={colSpan}>
                    {renderField(field)}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {Object.keys(errors).length > 0 ? (
            <div className="text-sm text-red-600">
              Please fix the highlighted fields.
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              {schema?.footerNote || "Review your information before submitting."}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cx(
              "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition",
              "bg-[var(--color-primary)] hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {submitting ? "Submitting..." : schema?.submitLabel || "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}

