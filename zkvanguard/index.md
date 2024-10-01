---
title: ZK Vanguard Overview
sidebar_position: 1
---

# ZK Vanguard Overview

## What is ZK Vanguard?

ZK Vanguard is a static analysis tool used to discover common vulnerabilities in zero-knowledge (ZK) circuits.
ZK Vanguard currently supports detecting bugs in ZK circuits written in [circom](https://docs.circom.io/).

## General Usage Instructions

### AuditHub Usage

If you're not familiar with AuditHub, first read the [AuditHub guide](/saas/).

To use ZK Vanguard on AuditHub, upload a project source archive that contains Circom circuit code.
AuditHub will automatically detect that the project contains ZK circuits and present Veridise's
ZK tools for selection on the tool selection screen.
To use ZK Vanguard, select it from the tool selection screen.

![image](./screenshots/zkvanguard-tool-selection.png)
