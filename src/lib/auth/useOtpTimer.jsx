import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@heroui/react";

export function useOtpTimer(initialTime = 120, onResend) {
  const [timer, setTimer] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop(); // خیلی مهم: قبلش قبلی رو ببند که دوتا نشه
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stop();
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stop]);

  
  useEffect(() => {
    setTimer(initialTime);
    setCanResend(false);
    start();

    return stop;
  }, [initialTime, start, stop]);

  const restartTimer = useCallback(async () => {
    if (!canResend) return;

    try {
      if (typeof onResend === "function") {
        await onResend();
      }

      toast.success("کد تأیید ارسال شد", {
        description: "اگر پیامک را دریافت نکردید، چند لحظه بعد دوباره تلاش کنید.",
      });

      setTimer(initialTime);
      setCanResend(false);
      start();
    } catch (err) {
      toast.error("ارسال کد تأیید ناموفق بود", {
        description: "لطفاً دوباره تلاش کنید. در صورت تداوم مشکل، اینترنت یا شماره را بررسی کنید.",
      });

      
       setCanResend(true);
    }
  }, [canResend, onResend, initialTime, start]);

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
