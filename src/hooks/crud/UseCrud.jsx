// src/hooks/crud/UseCrud.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Clean & minimal custom hook for API requests
 */
export function useFetch(config = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!config);
  const [error, setError] = useState(null);

  // Manual request trigger
  const request = useCallback(async (customConfig) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios(customConfig || config);
      setData(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount if config provided
  useEffect(() => {
    let isMounted = true;

    if (config) {
      setLoading(true);
      axios(config)
        .then((res) => {
          if (isMounted) {
            setData(res.data);
            setError(null);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.response?.data?.message || err.message || "An error occurred");
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error, request };
}
