import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import styles from '@/styles/GitDashboard.module.scss';

interface GitBranchInfo {
  currentBranch: string;
  allBranches: string[];
  remoteUrl: string;
  latestCommit: {
    hash: string;
    message: string;
    author: string;
    date: string;
  };
  status: {
    hasUncommittedChanges: boolean;
    unstagedFiles: number;
    stagedFiles: number;
  };
}

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

interface GitData {
  queryType?: string;
  description?: string;
  executedAt?: string;
  success?: boolean;
  executionTime?: number;
  [key: string]: any;
}

export default function GitDashboard() {
  const [gitData, setGitData] = useState<GitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string>('branch-info');

  const API_BASE = 'http://localhost:8080';

  // Available Git endpoints
  const endpoints = [
    { key: 'branch-info', label: '🌿 Branch Info', url: '/api/git/branch-info', description: 'Current branch and status' },
    { key: 'dashboard', label: '📊 Git Dashboard', url: '/api/git/dashboard', description: 'Complete git overview' },
    { key: 'workflows', label: '⚡ GitHub Actions', url: '/api/git/workflows', description: 'List workflows' },
    { key: 'workflow-runs', label: '🏃 Recent Runs', url: '/api/git/workflow-runs', description: 'Recent workflow executions' },
    { key: 'repo-info', label: '📦 Repository Info', url: '/api/git/repo-info', description: 'GitHub repository details' },
    { key: 'multiple-repos', label: '🗂️ Multi-Repo Check', url: '/api/git/multiple-repos', description: 'Check multiple repositories' }
  ];

  const fetchGitData = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGitData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching git data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialEndpoint = endpoints.find(ep => ep.key === activeEndpoint);
    if (initialEndpoint) {
      fetchGitData(initialEndpoint.url);
    }
  }, []);

  const handleEndpointChange = (endpointKey: string) => {
    setActiveEndpoint(endpointKey);
    const endpoint = endpoints.find(ep => ep.key === endpointKey);
    if (endpoint) {
      fetchGitData(endpoint.url);
    }
  };

  const renderBranchInfo = (data: any) => {
    if (!data.currentBranch) return null;
    
    return (
      <div className={styles.branchSection}>
        <h3>🌿 Branch Information</h3>
        <div className={styles.branchGrid}>
          <div className={styles.branchCard}>
            <strong>Current Branch:</strong>
            <span className={styles.currentBranch}>{data.currentBranch}</span>
          </div>
          <div className={styles.branchCard}>
            <strong>Remote URL:</strong>
            <span className={styles.remoteUrl}>{data.remoteUrl}</span>
          </div>
          {data.latestCommit && (
            <div className={styles.commitCard}>
              <strong>Latest Commit:</strong>
              <div className={styles.commitDetails}>
                <div>📝 {data.latestCommit.message}</div>
                <div>👤 {data.latestCommit.author}</div>
                <div>🕒 {data.latestCommit.date}</div>
                <div>🔗 {data.latestCommit.hash?.substring(0, 8)}</div>
              </div>
            </div>
          )}
          {data.status && (
            <div className={styles.statusCard}>
              <strong>Status:</strong>
              <div className={styles.statusDetails}>
                <div className={data.status.hasUncommittedChanges ? styles.hasChanges : styles.clean}>
                  {data.status.hasUncommittedChanges ? '⚠️ Has changes' : '✅ Clean'}
                </div>
                <div>📂 Staged: {data.status.stagedFiles || 0}</div>
                <div>📄 Unstaged: {data.status.unstagedFiles || 0}</div>
              </div>
            </div>
          )}
        </div>
        {data.allBranches && data.allBranches.length > 0 && (
          <div className={styles.branchList}>
            <strong>All Branches ({data.allBranches.length}):</strong>
            <div className={styles.branches}>
              {data.allBranches.map((branch: string, index: number) => (
                <span 
                  key={index} 
                  className={`${styles.branchTag} ${branch === data.currentBranch ? styles.current : ''}`}
                >
                  {branch}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWorkflows = (data: any) => {
    if (!data.workflows || !Array.isArray(data.workflows)) return null;
    
    return (
      <div className={styles.workflowSection}>
        <h3>⚡ GitHub Actions Workflows</h3>
        <div className={styles.workflowGrid}>
          {data.workflows.map((workflow: any, index: number) => (
            <div key={index} className={styles.workflowCard}>
              <div className={styles.workflowHeader}>
                <strong>{workflow.name}</strong>
                <span className={`${styles.workflowState} ${styles[workflow.state?.toLowerCase()]}`}>
                  {workflow.state}
                </span>
              </div>
              <div className={styles.workflowDetails}>
                <div>🆔 ID: {workflow.id}</div>
                <div>📁 Path: {workflow.path}</div>
                {workflow.badge_url && (
                  <div>🏷️ <a href={workflow.badge_url} target="_blank" rel="noopener noreferrer">Badge</a></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkflowRuns = (data: any) => {
    if (!data.runs || !Array.isArray(data.runs)) return null;
    
    return (
      <div className={styles.runsSection}>
        <h3>🏃 Recent Workflow Runs</h3>
        <div className={styles.runsGrid}>
          {data.runs.map((run: WorkflowRun, index: number) => (
            <div key={index} className={styles.runCard}>
              <div className={styles.runHeader}>
                <strong>{run.name}</strong>
                <div className={styles.runStatus}>
                  <span className={`${styles.status} ${styles[run.status?.toLowerCase()]}`}>
                    {run.status}
                  </span>
                  {run.conclusion && (
                    <span className={`${styles.conclusion} ${styles[run.conclusion?.toLowerCase()]}`}>
                      {run.conclusion}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.runDetails}>
                <div>🕒 Started: {new Date(run.createdAt).toLocaleString()}</div>
                <div>🏁 Updated: {new Date(run.updatedAt).toLocaleString()}</div>
                {run.htmlUrl && (
                  <div>
                    <a href={run.htmlUrl} target="_blank" rel="noopener noreferrer" className={styles.runLink}>
                      🔗 View Run
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDataPreview = (data: any) => {
    if (!data) return null;
    
    // Special rendering for different data types
    if (data.currentBranch) return renderBranchInfo(data);
    if (data.workflows) return renderWorkflows(data);
    if (data.runs) return renderWorkflowRuns(data);
    
    // Default JSON preview
    return (
      <pre className={styles.dataPreview}>
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <AppLayout>
      <div className={styles.gitDashboard}>
        <div className={styles.header}>
          <h1>🚀 Git Service Dashboard</h1>
          <p>Repository management, branch tracking, and GitHub Actions monitoring</p>
        </div>

        {/* Endpoint Selection */}
        <div className={styles.endpointSelector}>
          <h3>Select Git Operation:</h3>
          <div className={styles.endpointGrid}>
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.key}
                className={`${styles.endpointButton} ${
                  activeEndpoint === endpoint.key ? styles.active : ''
                }`}
                onClick={() => handleEndpointChange(endpoint.key)}
                disabled={loading}
              >
                <div className={styles.endpointLabel}>{endpoint.label}</div>
                <div className={styles.endpointDescription}>{endpoint.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Status Display */}
        <div className={styles.statusBar}>
          {loading && (
            <div className={styles.loading}>
              <span className={styles.spinner}></span>
              Loading git data...
            </div>
          )}
          
          {error && (
            <div className={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {gitData && !loading && (
            <div className={styles.success}>
              <strong>✓ Success:</strong> {gitData.description || 'Git operation completed'} 
              {gitData.executedAt && (
                <span className={styles.timestamp}>
                  (Executed: {gitData.executedAt})
                </span>
              )}
              {gitData.executionTime && (
                <span className={styles.executionTime}>
                  ⚡ {gitData.executionTime}ms
                </span>
              )}
            </div>
          )}
        </div>

        {/* Data Display */}
        {gitData && !loading && (
          <div className={styles.dataSection}>
            {renderDataPreview(gitData)}
          </div>
        )}

        {/* Info Panel */}
        <div className={styles.infoPanel}>
          <h4>🔧 Git Service Features</h4>
          <div className={styles.featureList}>
            <div>🌿 Branch information and status tracking</div>
            <div>⚡ GitHub Actions workflow management</div>
            <div>🏃 Workflow execution monitoring</div>
            <div>📦 Repository metadata and details</div>
            <div>🗂️ Multi-repository support</div>
            <div>📊 Comprehensive git dashboard</div>
          </div>
          <p>
            Current API endpoint: <code>{API_BASE}</code>
          </p>
        </div>
      </div>
    </AppLayout>
  );
} 