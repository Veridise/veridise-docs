import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'SaaS',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Veridise Security-as-a-Service (SaaS) is the platform that allows organizations to self-audit their smart contracts by providing instant access to Veridise security analysis tools.
        User provide the source code of their application, and invoke the Veridise security analysis tools that audit the application and report back the discovered vulnerabilities.
        For a quick start guide, see <a href="docs/intro">here</a>, while detailed documentation can be found <a href="/saas">here</a>
      </>
    ),
  },
  {
    title: 'OrCa',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        OrCa is the Veridise Oracle-guided Smart-Contract fuzzing tool, which discovers bugs in DeFi applications by generating and running thousands of (pseudo-)random inputs against the target application.
        You can find more information <a href="orca">here</a>.
      </>
    ),
  },
  {
    title: 'Vanguard',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Vanguard is the Veridise Smart-Contract static-analysis tool, which discovers bugs in DeFi applications and ZK-circuits by searching for well known security vulnerabilities and anti-patterns.
        You can find more information <a href="vanguard">here</a>.
      </>
    ),
  },
  {
    title: 'Picus',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Picus is a Veridise tool to prove that a ZK-circuit is not underconstrained, or find a counterexample if it is underconstrained.
        You can find more information <a href="picus">here</a>.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  // TODO: logos for projects
  // <Svg className={styles.featureSvg} role="img" />

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
