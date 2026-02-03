---
sidebar_position: 2
title: Locked Funds
description: Detects when funds may be locked within a contract
---

# Locked Funds (`locked-funds`)

## Summary and Usage

The Locked Funds detector alerts the user when a function in a contract may transfer funds
to the contract while the contract has no way of transferring those funds out of the contract.
In such a situation, any funds transferred to the contract will be lost because they will be inaccessible.

### Usage

The Locked Funds detector is invoked by selecting "Locked Funds"
in the Detector selection during the tool configuration step.

## Example and Explanation

The following contract contains a function with a Locked Funds
vulnerability.

```solidity title=locked-funds.sol showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract VulnerableERC {
  IERC20 tokenA;
  function transfersIn(uint256 amt) public {
    tokenA.transferFrom(msg.sender, address(this), amt);
  }

  function transferInNative() public payable {}

  function transfersOutNative(uint256 amt) public {
    msg.sender.call{value: amt}("");
  }
}
```

This contract has a function called `transfersIn` that transfers ERC20 tokens to the 
contract (lines 6--8), but has no function that transfers ERC20 tokens out of the contract. 
Any funds transferred by calling `transfersIn` will be lost permanently.

### Vanguard Output

When run on the above contract, the Locked Funds detector will make
the following report:

```text showLineNumbers
[High] Funds may be locked in VulnerableERC
Reported By: vanguard:locked-funds
Location: VulnerableERC @ test/locked-funds/LockedFunds.sol:3:1-15:1
Confidence: 0.95
More Info: placeholder
Details:
  * ERC20 tokens may be locked in VulnerableERC
    * ERC20 tokens are transferred to VulnerableERC in the following locations:
      * Call to transferFrom(address,address,uint256) @ VulnerableERC.transfersIn @ test/locked-funds/LockedFunds.sol:7:5
    * VulnerableERC has no calls to transfer, transferFrom, or approve that can move ERC20 tokens out of VulnerableERC

```

First, the detector reports what type of currency may be locked in the contract. It then reports
which functions transfer this currency to the contract and the location of the relevant transfers.

## Limitations

* This detector currently only supports native currency and ERC20 tokens, but other tokens may 
  be added in the future.
* This detector only considers situations where funds may be locked due to a missing transfer call 
  out of the contract. For example, it doesn't consider situations where a certain configuration
  in a contract could cause all transfers out to revert.

## Assessing Severity

Alerts from this detector have very high confidence, so it is very likely that something is wrong with
the code if an alert is generated. The severity of such an alert depends on how likely it is for funds 
to be transferred to a contract. For instance, if a function is accidentally marked as payable, funds may
only get locked if users explicitly send funds to the contract. This would be lower severity than if the 
developers of the contract forgot to implement a withdraw function for a type of currency that is intended 
to be transferred to the contract. The latter situtation would be a critical vulnerability.
