---
title: ZK Vanguard Overview
sidebar_position: 1
---

# ZK Vanguard Overview

## What is ZK Vanguard?

ZK Vanguard is a static analysis tool used to discover common vulnerabilities in zero-knowledge (ZK) circuits.
ZK Vanguard current supports detecting bugs in zk circuits written in [circom](https://docs.circom.io/).

## General Usage Instructions

### SaaS Usage

If you're not familiar with Veridise's Security-as-a-Service (SaaS) platform, first read the [SaaS guide](/saas/).

To use ZK Vanguard on SaaS, when creating a new task on Veridise's SaaS platform, select "Ethereum" as the Platform and "Circom" as the Language:

![image](./screenshots/zkvanguard-lang-selection.png)

You'll then be able to select ZK Vanguard from among the available tools:

![image](./screenshots/zkvanguard-tool-selection.png)

### Command-line Usage

For detailed usage instructions of ZK Vanguard on the command line, please refer to the [README in the ZK Vanguard repo](https://github.com/Veridise/Vanguard#readme).