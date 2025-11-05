import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "AuditHub",
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Veridise <a href="saas">AuditHub</a> is an online platform that allows
        organizations to self-audit their own code by providing instant access
        to Veridise code review and security analysis tools. Users provide the
        source code of their application, and they invoke the Veridise security
        analysis tools that audit the application and report back the discovered
        vulnerabilities.
      </>
    ),
  },
  {
    title: "OrCa",
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        <a href="orca">OrCa</a> is a smart contract fuzzing tool developed by
        Veridise. Given a description of the intended behaviors of the
        contract(s), OrCa can automatically discover bugs by generating and
        running thousands of (pseudo-)random inputs against the target
        application.
      </>
    ),
  },
  {
    title: "Vanguard",
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Vanguard is a static analysis tool created by Veridise for discovering
        bugs in&nbsp;
        <a href="vanguard">DeFi applications</a> by searching for well known
        security vulnerabilities and anti-patterns.
      </>
    ),
  },
  {
    title: "ZK Vanguard",
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        <a href="zkvanguard">ZK Vanguard</a> is a static analysis tool created
        by Veridise for discovering bugs in ZK circuits written in a variety of
        ZK circuit DSLs, such as Zirgen and circom.
      </>
    ),
  },
  {
    title: "Picus",
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        <a href="picus-v2">Picus</a> is the state-of-the-art determinism verifier
        for ZK circuits which can both verify that a circuit is deterministic or prove it is underconstrained.
      </>
    ),
  },
  {
    title: "Picus (Circom)",
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        <a href="picus">Picus (Circom)</a> is a legacy Veridise tool to prove that a Circom circuit
        is deterministic, or find a counterexample if it is
        underconstrained.
      </>
    ),
  },
  
];

function Feature({ Svg, title, description }) {
  // TODO: logos for projects
  // <Svg className={styles.featureSvg} role="img" />

  return (
    <div className={clsx("col col--4")}>
      <div className="text--center"></div>
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
