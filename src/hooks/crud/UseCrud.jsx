// src/hooks/crud/UseCrud.js
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

/**
 * Custom hook for handling API requests using Axios.
 * Supports auto-fetching on mount and manual request triggering.
 *
 * @param {object|null} initialConfig - Axios request config for immediate fetch.
 * @param {Array} dependencies - Dependency array to re-run the auto-fetch when values change.
 */
export function useFetch(initialConfig = null, dependencies = []) {
  const [loading, setLoading] = useState(Boolean(initialConfig));
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Store the active AbortController to cancel pending requests if needed.
  const abortControllerRef = useRef(null);

  /**
   * Performs an asynchronous HTTP request using Axios.
   */
  const request = useCallback(async (config) => {
    // Cancel any previous unfinished request before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the current request.
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        ...config,
        signal: controller.signal,
      });

      setData(response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      // Avoid updating state if the request was intentionally aborted.
      if (axios.isCancel(err)) {
        return {
          success: false,
          error: "Request aborted",
          isAborted: true,
        };
      }

      const message =
        err?.response?.data?.message || err?.message || "An error occurred";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      // Only set loading to false if this request is still the active one.
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Automatically triggers the request if initialConfig is provided.
   * Cleans up pending requests when the component unmounts.
   */
  useEffect(() => {
    if (initialConfig) {
      request(initialConfig);
    }

    // Cleanup function to cancel pending requests when unmounting or dependencies change.
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // Deep dependency watching is simplified by safely spreading the dependencies array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, ...dependencies]);

  return {
    request,
    loading,
    error,
    data,
    setData,
  };
}
