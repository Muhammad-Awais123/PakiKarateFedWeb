import React, { useState } from "react";
import axiosInstance from "../utils/axiosConfig.js";

const WEIGHT_OPTIONS = [
  "-50kg",
  "-55kg",
  "-60kg",
  "-67kg",
  "-75kg",
  "-84kg",
  "+84kg",
  "Kata",
];

const BELT_OPTIONS = [
  "White",
  "Yellow",
  "Orange",
  "Green",
  "Blue",
  "Brown",
  "Black Belt 1st Dan",
  "Black Belt 2nd Dan",
  "Black Belt 3rd Dan+",
];

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit-Baltistan",
  "AJK",
  "Islamabad",
];

export default function EventRegistrationForm({ event, onSuccess }) {
  const eventId = event?._id;
  const paymentDetails = event?.paymentDetails || {};
  // Keep this in sync with backend `uploadPaymentScreenshot` limits (multer 8MB).
  const MAX_PAYMENT_SCREENSHOT_BYTES = 8 * 1024 * 1024; // 8MB

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    weightCategory: "",
    beltGrade: "",
    clubName: "",
    city: "",
    province: "",
    cnic: "",
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const validateAndSetScreenshot = (file) => {
    if (!file) {
      setPaymentScreenshot(null);
      return;
    }

    // Client-side guard so users get fast feedback before the upload starts.
    if (file.size > MAX_PAYMENT_SCREENSHOT_BYTES) {
      setPaymentScreenshot(null);
      setError("Payment screenshot must be 8MB or less.");
      return;
    }

    setError("");
    setPaymentScreenshot(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!paymentScreenshot) {
      setError("Payment screenshot is required.");
      return;
    }

    if (paymentScreenshot?.size > MAX_PAYMENT_SCREENSHOT_BYTES) {
      setError("Payment screenshot must be 8MB or less.");
      return;
    }

    if (!termsAccepted) {
      setError("You must confirm the information and payment.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("eventId", eventId);
      fd.append("firstName", values.firstName);
      fd.append("lastName", values.lastName);
      fd.append("dob", values.dob);
      fd.append("gender", values.gender);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("weightCategory", values.weightCategory);
      fd.append("beltGrade", values.beltGrade);
      fd.append("clubName", values.clubName);
      fd.append("city", values.city);
      fd.append("province", values.province);
      fd.append("cnic", values.cnic);
      fd.append("paymentScreenshot", paymentScreenshot);

      const res = await axiosInstance.post("/registrations", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(
        res?.data?.message ||
          "Registration submitted! You will be contacted after payment verification."
      );
      setValues({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        weightCategory: "",
        beltGrade: "",
        clubName: "",
        city: "",
        province: "",
        cnic: "",
      });
      setPaymentScreenshot(null);
      setTermsAccepted(false);
      if (typeof onSuccess === "function") onSuccess(res?.data);
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.message ||
        "Submission failed. Please try again.";
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

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            First Name *
          </label>
          <input
            value={values.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Last Name *
          </label>
          <input
            value={values.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Date of Birth *
          </label>
          <input
            type="date"
            value={values.dob}
            onChange={(e) => setField("dob", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Gender *
          </label>
          <select
            value={values.gender}
            onChange={(e) => setField("gender", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Email *
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
            Phone Number *
          </label>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Weight Category *
          </label>
          <select
            value={values.weightCategory}
            onChange={(e) => setField("weightCategory", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          >
            <option value="">Select Category</option>
            {WEIGHT_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Belt / Grade *
          </label>
          <select
            value={values.beltGrade}
            onChange={(e) => setField("beltGrade", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          >
            <option value="">Select Belt/Grade</option>
            {BELT_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Club / Academy Name *
          </label>
          <input
            value={values.clubName}
            onChange={(e) => setField("clubName", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            City *
          </label>
          <input
            value={values.city}
            onChange={(e) => setField("city", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Province *
          </label>
          <select
            value={values.province}
            onChange={(e) => setField("province", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
            required
          >
            <option value="">Select Province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            CNIC / B-Form Number
          </label>
          <input
            value={values.cnic}
            onChange={(e) => setField("cnic", e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
          />
        </div>

        <div className="sm:col-span-2 mt-2 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-4 text-sm text-gray-800 dark:text-zinc-100">
          <div className="font-semibold mb-1">Payment Details</div>
          <p>
            Bank: <span className="font-medium">{paymentDetails.bankName || "—"}</span>
          </p>
          <p>
            Account Title:{" "}
            <span className="font-medium">{paymentDetails.accountTitle || "—"}</span>
          </p>
          <p>
            Account Number:{" "}
            <span className="font-medium">{paymentDetails.accountNumber || "—"}</span>
          </p>
          <p>
            IBAN: <span className="font-medium break-all">{paymentDetails.iban || "—"}</span>
          </p>
          {event?.registrationFee ? (
            <p className="mt-2">
              Registration Fee:{" "}
              <span className="font-semibold">{event.registrationFee}</span>
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
            Payment Screenshot *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => validateAndSetScreenshot(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-gray-700 dark:text-zinc-200 file:mr-3 file:rounded-xl file:border-0 file:bg-[#008000] file:px-4 file:py-2 file:text-white file:font-semibold"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload a clear image of your payment receipt (max 8MB).
          </p>
        </div>

        <div className="sm:col-span-2 flex items-start gap-2 mt-2">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#008000] focus:ring-[#008000]"
          />
          <label
            htmlFor="terms"
            className="text-xs sm:text-sm text-gray-700 dark:text-zinc-200"
          >
            I confirm the above information is accurate and payment has been made.
          </label>
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
            {submitting ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}

