---
title: ZK Vanguard (Legacy) Overview
sidebar_position: 1
---

# ZK Vanguard (Legacy) Overview

:::caution

This documentation is for the legacy version of ZK Vanguard, which will be
deprecated in the near future. For information on the current version of ZK Vanguard,
please refer to [these ZK Vanguard documents](/zkvanguard/).

:::

## What is ZK Vanguard (Legacy)?

ZK Vanguard (Legacy) is a static analysis tool used to discover common vulnerabilities in zero-knowledge (ZK) circuits.
This legacy version only supports detecting bugs in ZK circuits written in [circom](https://docs.circom.io/).

## General Usage Instructions

### AuditHub Usage

If you're not familiar with AuditHub, first read the [AuditHub guide](/saas/).

To use ZK Vanguard (legacy) on AuditHub, upload a project source archive that contains Ccrcom circuit code.
AuditHub will automatically detect that the project contains ZK circuits and present Veridise's
ZK tools for selection on the tool selection screen.
To use ZK Vanguard, select it from the tool selection screen.

![image](./screenshots/zkvanguard-tool-selection.png)
