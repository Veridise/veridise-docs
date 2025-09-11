---
sidebar_position: 2
title: Cross-Contract Reentrancy
description: Detects potential reentrancy attacks that could affect multiple contracts.
---

:::info

Documentation coming soon

:::

## Summary and Usage

The Cross-Contract Reentrancy detector examines a smart contract for reentrancy
vulnerabilities that may affect itself and other contracts that are used by the
contract.
Specifically, it looks for cases in which an external call may allow an attacker
to reenter a function and access the storage variables of a contract while it
the called contract is in an inconsistent state.
Consequences of a reentrancy attack may include protocol-breaking events such as
the loss of funds and the bypassing of crucial safety checks.

### Usage

The Cross-Contract Reentrancy detector is invoked by selecting "Cross-Contract
Reentrancy" in the Detector selection during the tool configuration step.

## Example and Explanation

TODO

### Vanguard Output

TODO

## Limitations

TODO

## Assessing Severity

TODO
