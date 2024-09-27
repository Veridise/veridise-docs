---
title: Vanguard Overview
sidebar_position: 1
---

# Vanguard Overview

Vanguard is a static analysis tool for Solidity smart contracts.
It can detect common vulnerabilities and collect useful information for security
reviews.

You can get started with Vanguard by following [this guide](./getting-started.md).

## Features

* Detects common vulnerabilities such as [unchecked return
  values](./detectors/unchecked-return.md) and [reentrancy
  attacks](./detectors/reentrancy.md).
* Supports Solidity versions 0.8.4 through 0.8.24.
* Collects useful information such as call graphs, currency value flow, and
  access controls and emits them in tabular & [visual](./visualizations.md) form.
* Findings reported by Vanguard can be triaged directly in the AuditHub interface.

