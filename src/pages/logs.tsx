import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import styles from '@/styles/LogsDashboard.module.scss';

interface LogData {
  queryType: string;
  description: string;
  executedAt: string;
  totalCount?: number;
  data?: any[];
  [key: string]: any;
}

export default function LogsDashboard() {
  const [logData, setLogData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string>('recent-errors');

  // Use localhost for browser requests (client-side) since browser can't resolve Docker hostnames
  const API_BASE = 'http://localhost:8080';

  // Available endpoints to test
  const endpoints = [
    { key: 'recent-errors', label: 'Recent Database Errors', url: '/api/logs/errors/recent' },
    { key: 'system-health', label: 'System Health Summary', url: '/api/logs/system/health' },
    { key: 'top-users', label: 'Top Active Users', url: '/api/logs/users/top-active' },
    { key: 'daily-summary', label: 'Daily Summary', url: '/api/logs/summary/daily' },
    { key: 'system-monitoring', label: 'System Monitoring Dashboard', url: '/api/logs/dashboard/system-monitoring' }
  ];

  const fetchLogData = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLogData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching log data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialEndpoint = endpoints.find(ep => ep.key === activeEndpoint);
    if (initialEndpoint) {
      fetchLogData(initialEndpoint.url);
    }
  }, []);

  const handleEndpointChange = (endpointKey: string) => {
    setActiveEndpoint(endpointKey);
    const endpoint = endpoints.find(ep => ep.key === endpointKey);
    if (endpoint) {
      fetchLogData(endpoint.url);
    }
  };

  const renderDataPreview = (data: any) => {
    if (!data) return null;
    
    return (
      <pre className={styles.dataPreview}>
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <AppLayout>
      <div className={styles.logsDashboard}>
        <div className={styles.header}>
          <h1>Log Message Dashboard</h1>
          <p>Real-time database log monitoring and analytics</p>
        </div>

        {/* Endpoint Selection */}
        <div className={styles.endpointSelector}>
          <h3>Select Log Data Source:</h3>
          <div className={styles.endpointButtons}>
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.key}
                className={`${styles.endpointButton} ${
                  activeEndpoint === endpoint.key ? styles.active : ''
                }`}
                onClick={() => handleEndpointChange(endpoint.key)}
                disabled={loading}
              >
                {endpoint.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Display */}
        <div className={styles.statusBar}>
          {loading && (
            <div className={styles.loading}>
              <span className={styles.spinner}></span>
              Loading log data...
            </div>
          )}
          
          {error && (
            <div className={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {logData && !loading && (
            <div className={styles.success}>
              <strong>✓ Connected:</strong> {logData.description} 
              <span className={styles.timestamp}>
                (Executed: {logData.executedAt})
              </span>
            </div>
          )}
        </div>

        {/* Data Display */}
        {logData && !loading && (
          <div className={styles.dataSection}>
            <div className={styles.dataHeader}>
              <h3>Response Data</h3>
              <div className={styles.dataStats}>
                <span className={styles.queryType}>Type: {logData.queryType}</span>
                {logData.totalCount && (
                  <span className={styles.totalCount}>Count: {logData.totalCount}</span>
                )}
              </div>
            </div>
            
            {/* Raw Data Preview */}
            <div className={styles.dataContent}>
              {renderDataPreview(logData)}
            </div>
          </div>
        )}

        {/* Connection Test Info */}
        <div className={styles.infoPanel}>
          <h4>🔗 API Connection Test</h4>
          <p>
            This dashboard is testing the connection to your LogMessageService backend.
            Current API endpoint: <code>{API_BASE}</code>
          </p>
          <p>
            Click different buttons above to test various log data endpoints and verify 
            the service integration is working correctly.
          </p>
        </div>
      </div>
    </AppLayout>
  );
} 