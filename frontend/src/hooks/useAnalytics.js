// frontend/src/hooks/useAnalytics.js

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

// This hook fetches all analytics data from the backend
// and provides loading/error states for the UI
export function useAnalytics() {

  const [summary,  setSummary]  = useState(null);
  const [daily,    setDaily]    = useState([]);
  const [weekly,   setWeekly]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // useCallback prevents this function from being
  // recreated on every render - important for useEffect dependency
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Run all 3 requests at the same time using Promise.all
      // Much faster than running them one after another
      const [summaryRes, dailyRes, weeklyRes] = await Promise.all([
        api.get('/data/summary'),
        api.get('/data/daily'),
        api.get('/data/weekly')
      ]);

      setSummary(summaryRes.data);
      setDaily(dailyRes.data);
      setWeekly(weeklyRes.data);

    } catch (err) {
      setError('Failed to load analytics data. Make sure you have some session data first.');
      console.error('Analytics fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when the hook first mounts
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Export data as a CSV file download
  const exportCSV = async () => {
    try {
      const response = await api.get('/data/export');
      const records  = response.data;

      if (!records.length) {
        alert('No data to export yet. Use the dashboard first!');
        return;
      }

      // Build CSV string manually
      // First row = column headers
      const headers = ['Timestamp', 'Voltage (V)', 'Current (A)',
                       'Temperature (°C)', 'SOC (%)', 'SOH (%)', 'Mode'];

      // Each subsequent row = one record
      const rows = records.map(r => [
        new Date(r.createdAt).toLocaleString(),
        r.voltage,
        r.current,
        r.temperature,
        r.soc,
        r.soh,
        r.mode
      ]);

      // Join headers and rows into one big CSV string
      const csv = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      // Create a downloadable file in the browser
      // Blob = Binary Large Object - a file-like object in memory
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);

      // Create a temporary invisible link and click it
      // This triggers the browser's file download dialog
      const link    = document.createElement('a');
      link.href     = url;
      link.download = `battery_data_${Date.now()}.csv`;
      link.click();

      // Clean up the temporary URL
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export error:', err.message);
      alert('Export failed. Please try again.');
    }
  };

  return { summary, daily, weekly, loading, error, exportCSV, refetch: fetchAll };
}