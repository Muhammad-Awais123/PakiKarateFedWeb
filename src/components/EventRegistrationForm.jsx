import React, { useState } from "react";
import axiosInstance from "../utils/axiosConfig.js";

export default function EventRegistrationForm({ eventId, onSuccess }) {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    club: "",
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!paymentScreenshot) {
      setError("Payment screenshot is required.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("eventId", eventId);
      fd.append("fullName", values.fullName);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("category", values.category);
      fd.append("club", values.club);
      fd.append("paymentScreenshot", paymentScreenshot);

      const res = await axiosInstance.post("/registrations", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(res?.data?.message || "Registration submitted.");
      setValues({ fullName: "", email: "", phone: "", category: "", club: "" });
      setPaymentScreenshot(null);
      if (typeof onSuccess === "function") onSuccess(res?.data);
    } catch (e2) {
      const msg = e2?.response?.data?.message || e2?.message || "Submission failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
      <div className="font-semibold text-gray-900 dark:text-zinc-50">
        Event Registration
      </div>
      <p className="mt-1 text-sm text-gray-600 dark:text-zinc-300">
        Fill in your details and upload payment screenshot.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Full Name
          </label>
          <input
            value={values.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Email
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Phone
          </label>
          <input
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Category
          </label>
          <input
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            placeholder="e.g. Kata / Kumite"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Club
          </label>
          <input
            value={values.club}
            onChange={(e) => setField("club", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Payment Screenshot
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPaymentScreenshot(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-gray-700 dark:text-zinc-200 file:mr-3 file:rounded-xl file:border-0 file:bg-[#008000] file:px-4 file:py-2 file:text-white file:font-semibold"
            required
          />
        </div>

        {error ? (
          <div className="sm:col-span-2 text-sm text-red-600">{error}</div>
        ) : null}
        {success ? (
          <div className="sm:col-span-2 text-sm text-emerald-700 dark:text-emerald-400">
            {success}
          </div>
        ) : null}

        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#008000] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

