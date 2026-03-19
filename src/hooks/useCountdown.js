import { useEffect, useState } from "react";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function getTimeLeftParts(targetDate) {
  const target = new Date(targetDate).getTime();
  if (!Number.isFinite(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((diff % MINUTE_MS) / SECOND_MS);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeftParts(targetDate));

  useEffect(() => {
    setTimeLeft(getTimeLeftParts(targetDate));

    const intervalId = window.setInterval(() => {
      setTimeLeft(getTimeLeftParts(targetDate));
    }, SECOND_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetDate]);

  return timeLeft;
}
