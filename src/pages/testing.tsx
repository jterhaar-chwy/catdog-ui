import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import styles from '../styles/TestingDashboard.module.scss';

interface TestResult {
  fileName: string;
  fileDate: string;
  date: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  errors?: number;
  inconclusive?: number;
  successRate: number;
  executionTimeSeconds?: number;
}

interface TrendAnalysis {
  trend: string;
  averageSuccessRate: number;
  totalTests: number;
  totalPassed: number;
  daysWithData: number;
}

interface TestTrends {
  testType: string;
  totalFiles: number;
  dailyResults: TestResult[];
  trendAnalysis: TrendAnalysis;
}

interface TestingSummary {
  totalTestFiles: number;
  overallSuccessRate: number;
  overallTrend: string;
  healthStatus: string;
}

interface TestingData {
  lookbackDays: number;
  baseDirectory: string;
  pesterTrends?: TestTrends;
  tsqltTrends?: TestTrends;
  summary?: TestingSummary;
  pesterError?: string;
  tsqltError?: string;
  summaryError?: string;
  queryType: string;
  description: string;
  executedAt: string;
}

const TestingDashboard: React.FC = () => {
  const [data, setData] = useState<TestingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string>('trends');

  const endpoints = [
    { key: 'trends', label: '7 Days', url: '/api/testing/trends', description: 'Default 7-day testing trends' },
    { key: 'quick', label: '3 Days', url: '/api/testing/trends/quick', description: 'Quick 3-day overview' },
    { key: 'extended', label: '14 Days', url: '/api/testing/trends/extended', description: 'Extended 14-day analysis' },
    { key: 'monthly', label: '30 Days', url: '/api/testing/trends/monthly', description: 'Monthly trend analysis' },
    { key: 'health', label: 'Health Check', url: '/api/testing/health', description: 'Service health status' },
    { key: 'endpoints', label: 'API Docs', url: '/api/testing/endpoints', description: 'API documentation' }
  ];

  const fetchData = async (endpoint: { key: string; url: string; label: string }) => {
    setLoading(true);
    setError(null);
    setActiveEndpoint(endpoint.key);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${endpoint.url}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load default data on component mount
  useEffect(() => {
    fetchData(endpoints[0]); // Load 7-day trends by default
  }, []);

  const renderTrendBadge = (trend: string) => {
    const trendClass = {
      'IMPROVING': styles.trendImproving,
      'STABLE': styles.trendStable,
      'DECLINING': styles.trendDeclining,
      'NO_DATA': styles.trendNoData,
      'INSUFFICIENT_DATA': styles.trendInsufficient,
      'UNKNOWN': styles.trendUnknown
    }[trend] || styles.trendUnknown;

    return <span className={`${styles.trendBadge} ${trendClass}`}>{trend}</span>;
  };

  const renderHealthBadge = (health: string) => {
    const healthClass = {
      'EXCELLENT': styles.healthExcellent,
      'GOOD': styles.healthGood,
      'FAIR': styles.healthFair,
      'POOR': styles.healthPoor,
      'CRITICAL': styles.healthCritical
    }[health] || styles.healthUnknown;

    return <span className={`${styles.healthBadge} ${healthClass}`}>{health}</span>;
  };

  const renderTestResults = (results: TestResult[]) => {
    if (!results || results.length === 0) {
      return <div className={styles.noData}>No test results found</div>;
    }

    return (
      <div className={styles.testResults}>
        {results.map((result, index) => (
          <div key={index} className={styles.testResultCard}>
            <div className={styles.resultHeader}>
              <h4>{result.fileName}</h4>
              <span className={styles.resultDate}>{result.date}</span>
            </div>
            <div className={styles.resultStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total:</span>
                <span className={styles.statValue}>{result.total}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Passed:</span>
                <span className={`${styles.statValue} ${styles.passed}`}>{result.passed}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Failed:</span>
                <span className={`${styles.statValue} ${styles.failed}`}>{result.failed}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Skipped:</span>
                <span className={`${styles.statValue} ${styles.skipped}`}>{result.skipped}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Success Rate:</span>
                <span className={`${styles.statValue} ${styles.successRate}`}>
                  {result.successRate.toFixed(1)}%
                </span>
              </div>
              {result.executionTimeSeconds && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Duration:</span>
                  <span className={styles.statValue}>{result.executionTimeSeconds.toFixed(2)}s</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTrendAnalysis = (analysis: TrendAnalysis, testType: string) => {
    return (
      <div className={styles.trendAnalysis}>
        <h3>{testType} Analysis</h3>
        <div className={styles.analysisGrid}>
          <div className={styles.analysisItem}>
            <span className={styles.analysisLabel}>Trend:</span>
            {renderTrendBadge(analysis.trend)}
          </div>
          <div className={styles.analysisItem}>
            <span className={styles.analysisLabel}>Avg Success Rate:</span>
            <span className={styles.analysisValue}>{analysis.averageSuccessRate.toFixed(1)}%</span>
          </div>
          <div className={styles.analysisItem}>
            <span className={styles.analysisLabel}>Total Tests:</span>
            <span className={styles.analysisValue}>{analysis.totalTests}</span>
          </div>
          <div className={styles.analysisItem}>
            <span className={styles.analysisLabel}>Total Passed:</span>
            <span className={styles.analysisValue}>{analysis.totalPassed}</span>
          </div>
          <div className={styles.analysisItem}>
            <span className={styles.analysisLabel}>Days with Data:</span>
            <span className={styles.analysisValue}>{analysis.daysWithData}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className={styles.testingDashboard}>
        <div className={styles.header}>
          <h1>Testing History Dashboard</h1>
          <p>Automated testing trends and analysis for Pester and tSQLt tests</p>
        </div>

        <div className={styles.controls}>
          {endpoints.map((endpoint) => (
            <button
              key={endpoint.key}
              className={`${styles.endpointButton} ${
                activeEndpoint === endpoint.key ? styles.active : ''
              }`}
              onClick={() => fetchData(endpoint)}
              disabled={loading}
              title={endpoint.description}
            >
              {endpoint.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading testing data...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className={styles.content}>
            {/* Summary Section */}
            {data.summary && (
              <div className={styles.summarySection}>
                <h2>Testing Summary</h2>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <h3>Overall Health</h3>
                    {renderHealthBadge(data.summary.healthStatus)}
                    <p>{data.summary.overallSuccessRate.toFixed(1)}% Success Rate</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Test Files</h3>
                    <span className={styles.bigNumber}>{data.summary.totalTestFiles}</span>
                    <p>Files Analyzed</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Time Period</h3>
                    <span className={styles.bigNumber}>{data.lookbackDays}</span>
                    <p>Days Back</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pester Section */}
            {data.pesterTrends && (
              <div className={styles.testSection}>
                <h2>PowerShell Pester Tests</h2>
                {renderTrendAnalysis(data.pesterTrends.trendAnalysis, 'Pester')}
                {renderTestResults(data.pesterTrends.dailyResults)}
              </div>
            )}

            {/* tSQLt Section */}
            {data.tsqltTrends && (
              <div className={styles.testSection}>
                <h2>SQL Server tSQLt Tests</h2>
                {renderTrendAnalysis(data.tsqltTrends.trendAnalysis, 'tSQLt')}
                {renderTestResults(data.tsqltTrends.dailyResults)}
              </div>
            )}

            {/* Error Messages */}
            {(data.pesterError || data.tsqltError || data.summaryError) && (
              <div className={styles.errorSection}>
                <h3>Warnings</h3>
                {data.pesterError && <p className={styles.warning}>Pester: {data.pesterError}</p>}
                {data.tsqltError && <p className={styles.warning}>tSQLt: {data.tsqltError}</p>}
                {data.summaryError && <p className={styles.warning}>Summary: {data.summaryError}</p>}
              </div>
            )}

            {/* Raw Data Section (for non-trend endpoints) */}
            {(activeEndpoint === 'health' || activeEndpoint === 'endpoints') && (
              <div className={styles.rawDataSection}>
                <h3>Response Data</h3>
                <pre className={styles.jsonPreview}>
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}

            <div className={styles.metadata}>
              <p><strong>Base Directory:</strong> {data.baseDirectory}</p>
              <p><strong>Query Type:</strong> {data.queryType}</p>
              <p><strong>Executed At:</strong> {data.executedAt}</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TestingDashboard; 