import { useCallback, useEffect, useState } from "react";

const URL = "http://swapi.dev/api/planets/";

const usePlanet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async (page) => {
    setLoading(true);

    try {
      const response = page ? await fetch(page) : await fetch(URL);

      if (!response.ok) {
        setError("Failed to fetch planets");
        setLoading(false);
        return;
      }

      const json = await response.json();

      setData(json);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const previous = () => {
    fetchData(data?.previous);
  };

  const next = () => {
    fetchData(data?.next);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    previous,
    next,
  };
};

export default usePlanet;
