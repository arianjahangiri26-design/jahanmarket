import { useState, useEffect, useCallback } from "react";

export function useOtpTimer(initialTime = 120, onResend) {
  const [timer, setTimer] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const restartTimer = useCallback(async () => {
    if (!canResend) return;

    if (typeof onResend === "function") {
      await onResend();
    }

    setTimer(initialTime);
    setCanResend(false);
  }, [canResend, onResend, initialTime]);

  const formatTime = useCallback(() => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, [timer]);

  return {
    timer,
    canResend,
    restartTimer,
    formatTime,
  };
}
