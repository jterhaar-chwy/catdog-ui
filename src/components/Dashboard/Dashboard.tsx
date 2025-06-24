import React from 'react';
import styles from './Dashboard.module.scss';
import { KibSectionHeading } from '@chewy/kib-content-groups-react';
import { KibButtonNew } from '@chewy/kib-controls-react';

export const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      {/* F-Shape: Second horizontal scan area */}
      <div className={styles.heroSection}>
        <KibSectionHeading 
          heading="System Overview" 
          subheading="Monitor your databases and services in real-time"
          className={styles.heroHeading}
        >
          <div className={styles.heroActions}>
            <KibButtonNew size="large">
              Connect Database
            </KibButtonNew>
            <KibButtonNew variant="secondary" size="large">
              View All Reports
            </KibButtonNew>
          </div>
        </KibSectionHeading>
      </div>

      {/* Key Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricTitle}>Active Connections</h3>
            <div className={styles.metricStatus + ' ' + styles.statusPositive}>●</div>
          </div>
          <div className={styles.metricValue}>24</div>
          <div className={styles.metricChange}>+12% from yesterday</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricTitle}>Query Success Rate</h3>
            <div className={styles.metricStatus + ' ' + styles.statusPositive}>●</div>
          </div>
          <div className={styles.metricValue}>98.5%</div>
          <div className={styles.metricChange}>+2.1% from yesterday</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricTitle}>Response Time</h3>
            <div className={styles.metricStatus + ' ' + styles.statusWarning}>●</div>
          </div>
          <div className={styles.metricValue}>145ms</div>
          <div className={styles.metricChange}>+5ms from yesterday</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3 className={styles.metricTitle}>Error Rate</h3>
            <div className={styles.metricStatus + ' ' + styles.statusPositive}>●</div>
          </div>
          <div className={styles.metricValue}>0.02%</div>
          <div className={styles.metricChange}>-0.01% from yesterday</div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className={styles.dashboardGrid}>
        {/* Recent Queries */}
        <div className={styles.dashboardCard}>
          <KibSectionHeading heading="Recent Queries" className={styles.cardHeading}>
            <div className={styles.queryList}>
              <div className={styles.queryItem}>
                <div className={styles.queryInfo}>
                  <span className={styles.queryText}>SELECT * FROM users WHERE active = true</span>
                  <span className={styles.queryTime}>2 minutes ago</span>
                </div>
                <div className={styles.queryStatus + ' ' + styles.querySuccess}>✓</div>
              </div>
              <div className={styles.queryItem}>
                <div className={styles.queryInfo}>
                  <span className={styles.queryText}>UPDATE orders SET status = 'shipped'</span>
                  <span className={styles.queryTime}>5 minutes ago</span>
                </div>
                <div className={styles.queryStatus + ' ' + styles.querySuccess}>✓</div>
              </div>
              <div className={styles.queryItem}>
                <div className={styles.queryInfo}>
                  <span className={styles.queryText}>INSERT INTO logs (message, timestamp)</span>
                  <span className={styles.queryTime}>8 minutes ago</span>
                </div>
                <div className={styles.queryStatus + ' ' + styles.querySuccess}>✓</div>
              </div>
            </div>
          </KibSectionHeading>
        </div>

        {/* System Health */}
        <div className={styles.dashboardCard}>
          <KibSectionHeading heading="System Health" className={styles.cardHeading}>
            <div className={styles.healthGrid}>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>CPU Usage</div>
                <div className={styles.healthBar}>
                  <div className={styles.healthProgress} style={{width: '45%'}}></div>
                </div>
                <div className={styles.healthValue}>45%</div>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Memory</div>
                <div className={styles.healthBar}>
                  <div className={styles.healthProgress} style={{width: '72%'}}></div>
                </div>
                <div className={styles.healthValue}>72%</div>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Disk Space</div>
                <div className={styles.healthBar}>
                  <div className={styles.healthProgress} style={{width: '28%'}}></div>
                </div>
                <div className={styles.healthValue}>28%</div>
              </div>
            </div>
          </KibSectionHeading>
        </div>
      </div>
    </div>
  );
}; 