---
sidebar_position: 2
title: Simple Reentrancy (Legacy)
description: Detects potential reentrancy attacks affecting one contract.
draft: true
---

# Simple Reentrancy (`reentrancy`)

:::info

This detector is only available when selecting "DeFi Vanguard (Legacy)" in AuditHub.

Consider using the new [Cross-Contract Reentrancy](./cross-contract-reentrancy.md)
detector instead, which catches a broader set of reentrancy vulnerabilities.

:::

## Summary and Usage

The Simple Reentrancy detector examines a smart contract for simple reentrancy
vulnerabilities affecting just that contract.
Specifically, it looks for cases in which an external call to some other smart
contract may allow an attacker to reenter a function and access the contract
while it is in an inconsistent state.
Consequences of a reentrancy attack may include loss of funds, bypassing crucial
safety checks, etc.

### Usage

The Simple Reentrancy detector is invoked by selecting "Reentrancy" in the
Detector selection during the tool configuration step.

## Example and Explanation

The following contract shows a simple native currency wallet that is vulnerable
to a reentrancy attack that allows attackers to steal funds from the wallet.
Users can call `deposit()` to transfer native currency to the wallet, and they
can call `withdraw()` to retrieve their balance.

```solidity title=reentrancy.sol showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);
        sendEther(msg.sender, bal);
        balances[msg.sender] = 0;
    }

    function sendEther(address who, uint256 amount) internal {
        (bool sent, ) = who.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
```

The vulnerable function here is `withdraw()`.
If the `msg.sender` is a smart contract, control flow will be transferred back
to `msg.sender` when the low level `.call` is made.
Since `balances[msg.sender]` is not zeroed out until after the call, then if the
`msg.sender` is able to call back into `withdraw()`, then they will be able to
withdraw twice their balance (or higher multiples of their balance, if the
attacker is willing to spend more gas to fuel repeated reentrant calls).

:::note

The following "attacker contract" is a concrete example of how such an attack
might work.

<details>

<summary>Example attacker contract</summary>

```solidity showLineNumbers
contract Attacker {
    bool isAttacking = false;

    // (1) Attacker calls this to initiate the attack.
    // highlight-next-line
    function attack(address wallet) external {
      isAttacking = true;
      Wallet(wallet).withdraw();
    }

    receive() external payable {
        // The wallet's withdraw() low-level call will call back here.
        // highlight-next-line
        if (isAttacking) {
            isAttacking = false;
            // (2) The attacker tries to withdraw again.
            // Since the balance hasn't been reset to 0,
            // the wallet will send the balance over again
            // and transfer control flow back to receive().
            // highlight-next-line
            Wallet(msg.sender).withdraw();
        } else {
            // (3) This is reachable once the attack is successful.
        }
    }
}
```

</details>

:::


### Vanguard Output

When run on the above wallet contract, the Simple Reentrancy detector will make
the following report:

```text showLineNumbers
[Critical] Potential reentrancy attack affecting Wallet @ Wallet.sol:4:1-22:1 launched from Wallet.sendEther
Reported By: vanguard:reentrancy
Location: Wallet @ Wallet.sol:4:1-22:1
Confidence: 0.8
More Info: placeholder
Details:
Potential reentrancy attack affecting Wallet @ Wallet.sol:4:1-22:1 launched from Wallet.sendEther
  * External calls that may allow an attacker to reenter Wallet.sendEther @ Wallet.sol:18:5-21:5
    * unresolved low-level call in Wallet.sendEther @ Wallet.sol:19:25
  * A reentry into Wallet.sendEther may cause race conditions that involve the following storage variable modifications
    * ⚠️ balances in Wallet.withdraw @ Wallet.sol:15:9
  * External functions in Wallet @ Wallet.sol:4:1-22:1 which may reach Wallet.sendEther
    * Wallet.withdraw
```

First, the detector reports what contract is affected by the attack and the
function containing one or more potential _reentry points_ of the attack (where
an attacker may be able to reenter from).
In the above example, the `Wallet` contract is affected, and the reentrancy
attack may be initiated in `Wallet.sendEther`.

Next, the detector indicates the exact statements that may make up the reentry
point(s).
The example flags the low-level call as a reentry point.

Third, the detector lists the storage variables that may be modified after
control flow is returned to the contract following a call to one of the reentry
points.
It may be possible for the reentry point to transfer control flow to an attacker
contract, in which case the state variables accessed afterwards may be in an
indeterminate state after the reentry point.
The detector will report state variables that are accessed even in other
functions that call the function with the reentry points.

Lastly, the detector reports all external functions that may reach the function
that contains the reentry points.
This is useful for identifying which external functions may be vulnerable to the
attack.

## Limitations

* The Simple Reentrancy detector is designed to only detect cases where the
  reentry point and the relevant storage variables are in the same smart
  contract, and that the attack is specifically a reentrancy attack and not a
  more general race condition.
  It will _not_ detect attacks where a reentry point is in one contract but the
  relevant storage variable is in another contract.
* Support for "read-only" reentrancies is currently limited.
  The detector does not flag `view` functions as reentry points.
* This detector is focused on reentrancy attacks.
  It cannot detect attacks where an attacker calls a function with a "reentry
  point", but the attacker calls a _different_ function to modify a state
  variable that is modified in both functions.
* Only storage modifications that occur after at least one reentry point will be
  flagged.
  Storage modifications that occur before all reentry points will not be flagged.

## Assessing Severity

The severity of a finding reported by the Simple Reentrancy detector depends on
two aspects:

1. **The conditions under which a reentry point can be exploited.**
   The detector conservatively assumes that every external call may allow an
   attacker to reenter.
   However, several factors may restrict reentry, such as the presence of
   reentry guards, checks on storage variables/mappings, and assumptions on what
   contracts will be called.
   If a reentry point cannot actually be used to reenter, further state
   modifications may not actually be vulnerable.

2. **The impact of storage variable modification on reentry with respect to the
   affected functions.**
   In some cases, storage variables will not be in an inconsistent state even if
   a reentry occurs.
   For example, consider the following function:
   ```solidity
   function deposit(uint256 amount) {
       token.transferFrom(msg.sender, address(this), amount);  // reentry point
       totalSupply += amount;  // state modification
   }
   ```
   The Simple Reentrancy detector may flag the `transferFrom` call.
   Even _if_ the call reenters into `deposit`, this is a false positive (with
   respect to Simple Reentrancy) since `totalSupply` will be updated correctly.

   :::warning

   If the attacker calls _another_ function that reads or modifies
   `totalSupply`, then this would be a vulnerability; however, such general race
   condition vulnerabilities are out-of-scope of the Simple Reentrancy detector.

   :::

