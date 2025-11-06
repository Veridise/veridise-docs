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
* Produces detailed findings that can be triaged directly in the AuditHub
  interface.
* For projects or protocols that require custom analysis, the [custom
  detectors](./custom-detectors/index.md) feature provides the ability to catch
  protocol/library-specific vulnerabilities, including those involving integrations with
  ERC20 tokens, ERC4626 vaults, and Uniswap.
* Supports Solidity versions 0.8.4 and newer.
* Integrates with build systems such as Hardhat and Foundry.
* Collects useful information such as call graphs, currency value flow, and
  access controls and emits them in tabular and [visual](./visualizations.md)
  form.

## Note on Stability

The current documentation reflects a Vanguard version 1.0 that will be
included with the official release of AuditHub.
Compared to the previous 0.x versions of Vanguard, the 1.0 version is
significantly more stable (i.e., fewer crashes) and accurate, and it also
includes the custom detectors feature.
However, we are still working on moving some of the detectors to the 1.0
version.
These detectors are marked as with a "(Legacy)" in the documentation and can be
run by selecting "DeFi Vanguard (Legacy)" on AuditHub.
