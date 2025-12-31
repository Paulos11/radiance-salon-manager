import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook for data fetching
function useFetch(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(url);

        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url, ...dependencies]);

  const refetch = async () => {
    if (url) {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(url);

        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return { data, loading, error, refetch };
}

export default useFetch;
