// src/hooks/crud/UseCrud.js
import { useState, useEffect } from "react";
import axios from "axios";

export function useFetch(initialConfig = null, dependencies = []) {
  // اگر کانفیگ اولیه داریم، یعنی باید از همون لحظه لودینگ شروع بشه
  const [loading, setLoading] = useState(!!initialConfig); 
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = async (config) => {
    setLoading(true); // همیشه قبل از درخواست، لودینگ رو ترو کن
    setError(null);
    try {
      const res = await axios(config);
      setData(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "خطایی رخ داد";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false); // وقتی تموم شد، لودینگ رو فالس کن
    }
  };

  useEffect(() => {
    if (initialConfig) {
      request(initialConfig);
    }
  }, dependencies);

  return { request, loading, error, data, setData };
}
