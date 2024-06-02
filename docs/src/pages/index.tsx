import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';


function MainHeader() {
  return (
    <header className={clsx('hero', styles.hero)}>
      <img src="/img/logo.png" alt="Logo" />
      <h1 className="hero-title">Welcome to LitLyx Docs</h1>
      <Link
        className="button button--secondary button--lg"
        to="/intro">
        Read Docs 🔥 |  3 min read ⏱️
      </Link>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title={`LitLyx`}
      description="LitLyx offers ultra-fast, real-time analytics and custom events with just one line of code. It seamlessly integrates with over 15 JavaScript/TypeScript frameworks. Designed for developers, it's also accessible to everyone from designers to investors, enhancing your projects with valuable insights.
      ">
      <MainHeader />
      <HomepageFeatures />
    </Layout>
  );
}
