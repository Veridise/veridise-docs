---
sidebar_position: 1
---

# DeFi Domain Detectors

These detectors are used for debugging blockchain applications, e.g. projects written in Solidity.

## Debug Summarizer (`debug-summary`)

### Summary and Usage

The Debug Summarizer is used to generate a report about the construction of a given blockchain code compilation. This summarizer gathers information about the code, such as available functions and variables, and reports on possible calls between the available functions. It is invoked using the argument: `--detector=debug-summary`.

### Example

```sh
npm install @openzeppelin/contracts
vanguard_driver --detector=debug-summary flashloan.sol -I node_modules/
```

<details>
<summary>Full Report</summary>

```txt
----VANGUARD REPORT----
Running detector: debug-summary
Writing SARIF report to /tmp/nix-shell.w5vTY6/tmpeiwgzh58/sarif.json
==

==

--------------------------------------------------------------------------------
  Total Contracts: 1
  Total Libraries: 0
  Total Interfaces: 1
  Total Functions: 10

  * IERC20
    application code: false
    functions:
    - IERC20.totalSupply
    - IERC20.balanceOf
    - IERC20.transfer
    - IERC20.allowance
    - IERC20.approve
    - IERC20.transferFrom
    variables:
  * TaintedFlashloan
    application code: true
    functions:
    - TaintedFlashloan.taintVariable
      * External call to IERC20.balanceOf
    - TaintedFlashloan.getTaintedVariable
    - TaintedFlashloan.getAmount
      * Internal call to TaintedFlashloan.getTaintedVariable
    - TaintedFlashloan.sendMoney
      * Internal call to TaintedFlashloan.getAmount
      * External call to IERC20.transfer
    variables:
    - token
    - taintedVariable
--------------------------------------------------------------------------------
```

</details>
