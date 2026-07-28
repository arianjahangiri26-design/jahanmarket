// src/hooks/crud/UseCrud.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFetch(initialConfig = null, dependencies = []) {
  const [loading, setLoading] = useState(Boolean(initialConfig));
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios(config);
      setData(response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "خطایی رخ داد";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ( initialConfig){
    request(initialConfig);


    };
  }, [request, ...dependencies]);

  return {
    request,
    loading,
    error,
    data,
    setData,
  };
}
