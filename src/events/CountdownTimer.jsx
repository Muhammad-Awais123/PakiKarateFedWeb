import useCountdown from "../hooks/useCountdown";

function pad(value) {
  return String(value).padStart(2, "0");
}

function CountdownUnit({ value, suffix, size }) {
  const unitTextClass = size === "lg" ? "text-3xl sm:text-4xl" : "text-sm sm:text-base";
  const unitPaddingClass = size === "lg" ? "px-4 py-3 sm:px-5 sm:py-4" : "px-2.5 py-2";

  return (
    <div className="relative min-w-[62px] sm:min-w-[68px]">
      <div className={`rounded-xl border border-emerald-900/40 bg-zinc-900 ${unitPaddingClass}`}>
        <div
          key={`${suffix}-${value}`}
          className={`font-semibold text-white tabular-nums leading-none tracking-tight animate-[countdownFade_300ms_ease] ${unitTextClass}`}
        >
          {pad(value)}
          <span className="ml-0.5 text-emerald-400">{suffix}</span>
        </div>
      </div>
    </div>
  );
}

export default function CountdownTimer({
  targetDate,
  size = "sm",
  expiredLabel = "Event Started",
  className = "",
}) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (!targetDate) return null;
  if (isExpired) {
    return (
      <div
        className={`inline-flex items-center rounded-xl border border-emerald-900/40 bg-zinc-900 px-4 py-2 text-sm font-semibold text-emerald-300 ${className}`}
      >
        {expiredLabel}
      </div>
    );
  }

  const isUrgent = days < 1;
  const wrapperPaddingClass = size === "lg" ? "p-4 sm:p-5" : "p-2";

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-900/40 bg-zinc-950/95 ${wrapperPaddingClass} ${
        isUrgent ? "shadow-[0_0_24px_rgba(0,128,0,0.25)] animate-pulse" : ""
      } ${className}`}
      role="timer"
      aria-live="polite"
    >
      <CountdownUnit value={days} suffix="d" size={size} />
      <CountdownUnit value={hours} suffix="h" size={size} />
      <CountdownUnit value={minutes} suffix="m" size={size} />
      <CountdownUnit value={seconds} suffix="s" size={size} />
    </div>
  );
}
