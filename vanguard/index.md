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

* Comes with a suite of built-in _detectors_ that can be used to automatically
  catch common vulnerabilities such as [unchecked return
  values](./detectors/unchecked-return.md) and
  [cross-contract reentrancy attacks](./detectors/cross-contract-reentrancy.md).
* Produces detailed findings that can be [triaged directly in the AuditHub
  interface](./triage/index.md).
* For projects or protocols that require custom analysis, the [custom
  detectors](./custom-detectors/index.md) feature provides the ability to catch
  protocol/library-specific vulnerabilities, including those involving integrations with
  ERC20 tokens, ERC4626 vaults, and Uniswap.
* Supports Solidity versions 0.8.4 and newer.
* Integrates with build systems such as Hardhat and Foundry.

<!--
TODO: support visualizations again
* Collects useful information such as call graphs, currency value flow, and
  access controls and emits them in tabular and [visual](./visualizations.md)
  form.
-->
