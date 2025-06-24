import React from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import { KibButtonNew } from '@chewy/kib-controls-react';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Left side - Logo/Brand */}
        <div className={styles.brand}>
          <h1 className={styles.appTitle}>Dashboard</h1>
          <span className={styles.subtitle}>Monitoring & Analytics</span>
        </div>

        {/* Center - Navigation (F-shaped: first horizontal scan) */}
        <nav className={styles.navigation}>
          <Link href="/">
            <KibButtonNew variant="ghost" size="small">
              Overview
            </KibButtonNew>
          </Link>
          <KibButtonNew variant="ghost" size="small">
            Database
          </KibButtonNew>
          <Link href="/logs">
            <KibButtonNew variant="ghost" size="small">
              Log Messages
            </KibButtonNew>
          </Link>
          <Link href="/git">
            <KibButtonNew variant="ghost" size="small">
              Git Service
            </KibButtonNew>
          </Link>
          <Link href="/testing">
            <KibButtonNew variant="ghost" size="small">
              Testing History
            </KibButtonNew>
          </Link>
          <KibButtonNew variant="ghost" size="small">
            Monitoring
          </KibButtonNew>
          <KibButtonNew variant="ghost" size="small">
            Reports
          </KibButtonNew>
        </nav>

        {/* Right side - User actions */}
        <div className={styles.actions}>
          <KibButtonNew variant="secondary" size="small">
            Settings
          </KibButtonNew>
          <div className={styles.userProfile}>
            <span className={styles.userName}>JT</span>
          </div>
        </div>
      </div>
    </header>
  );
}; 