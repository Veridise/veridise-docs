---
sidebar_position: 2
title: Cross-Contract Reentrancy
description: Detects potential reentrancy attacks that could affect multiple contracts.
---

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

To illustrate a cross-contract reentrancy attack, consider the following
scenario, which is simplified from a hack of a real-world trading protocol.
There are two contracts, a `Market` and a `Vault`.
Users may trade an asset tokens previously deposited in the `Vault` for ETH by
invoking the `Market.trade()` function.
Separately, there is a `Vault.deposit()` function that allows users to deposit
asset tokens in exchange for shares of the `Vault`, where the exchange rate is
partly determined by both the `Vault`'s asset balance and the `totalAssets`
amount.

```solidity title="DocsExample.sol" showLineNumbers
pragma solidity ^0.8.4;

interface IERC20 {
    function transfer(address receiver, uint amount) external returns (bool);
    function transferFrom(address owner, address receiver, uint amount) external returns (bool);
    function balanceOf(address receiver) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function mint(address receiver, uint256 amount) external;
}

contract ERC20 is IERC20 {
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    function transfer(address receiver, uint amount) external returns (bool) {
        return transferFrom(msg.sender, receiver, amount);
    }
    function transferFrom(address owner, address receiver, uint amount) public returns (bool) {
        balanceOf[owner] = balanceOf[owner] - amount;
        balanceOf[receiver] = balanceOf[receiver] + amount;
        return true;
    }
    function mint(address receiver, uint256 amount) external {
        balanceOf[receiver] += amount;
        totalSupply += amount;
    }
}

interface IVault {
    function deposit(uint256 assetAmount) external returns (uint256);
    function updateAssets(uint256 amount) external;
}

contract Market {
    IERC20 asset;
    IVault vault;

    // Attacker calls this function ...
    function trade(uint amount) external {
        // ... some other accounting not shown ...

        // (1) Vault's asset balance decreased
        asset.transferFrom(address(vault), address(this), amount);

        // (2) reentrancy occurs here
        payable(msg.sender).call{value: amount}("");

        vault.updateAssets(amount);
    }
}

contract Vault is IVault {
    address market;
    uint256 totalDebt;
    uint256 totalCredit;
    IERC20 asset;
    IERC20 share;

    function _exchangeRate() internal returns (uint256) {
        uint256 totalAssets = asset.balanceOf(address(this)) + totalCredit - totalDebt;
        return totalAssets * 1e18 / share.totalSupply();
    }

    // (3) attacker calls this function after asset balance is decreased
    // but before totalCredit is increased
    function deposit(uint256 assetAmount) external returns (uint256) {
        // ... some other bookkeeping not shown ...
        uint shareAmount = assetAmount / _exchangeRate();
        asset.transferFrom(msg.sender, address(this), assetAmount);
        share.mint(msg.sender, shareAmount);
        return shareAmount;
    }

    function updateAssets(uint256 amount) external {
        require(msg.sender == market);
        totalCredit += amount;
    }
}
```

A "read-only" reentrancy vulnerability is present in the `Market.trade()`
method, allowing an attacker to temporarily manipulate the price of the trade to
their advantage.

Specifically, this attack occurs in three steps:
1. An attacker uses a smart contract to call `Market.trade()`, which will first
   transfer asset tokens from the `Vault` to the `Market`.
2. Native curency is sent to the attacker by the
   `payable(msg.sender).call{value: amount}("")` low-level call, transferring
   control flow to the attacker contract.
3. The attacker then calls `Vault.deposit()`.
   Note that this occurs after the `Vault`'s asset balance has decreased, but
   before the `vault.updateAssets(amount)` call in `Market.trade()` to increase
   `Vault.totalCredits`.
   As a result, the exchange rate calculation in `Vault.deposit()` will
   use the _decreased_ `Vault` asset balance and _unchanged_ `totalCredit` amount.
   This will cause the computed exchange rate to be _lower_ than is intended,
   allowing the attacker to get more shares than they should.

To complete the attack, the attacker can immediately sell the shares after the
transaction, at an exchange rate that is higher than what they obtained the
shares for.

### Vanguard Output

The Cross-Contract Reentrancy detector is able to identify the above
vulnerability, as shown by the following finding:

```plain
[Low] The contract Market may be vulnerable to reentrancy attacks
Reported By: vanguard:cross-contract-reentrancy
Location: Market @ DocsExample.sol:33:1
Confidence: 0.5
More Info: placeholder
Details:
The contract Market may be vulnerable to reentrancy attacks
  * ⚠️ The external call  Market.trade @ DocsExample.sol:45:9  can trigger a reentrancy attack
    * External functions that can reach this call
      * Market.trade
    * Variables  updated before the external call:
      * ERC20.balanceOf accessed from
        * ERC20.transferFrom @ DocsExample.sol:19:9
    * A reentrancy attack can call the following functions to modify contract state:
      * Market.trade
      * Vault.deposit
    * Variables that are updated after they are accesssed by a reentrant external call:
      * Vault.totalCredit accessed from
        * Vault.updateAssets @ DocsExample.sol:75:9
```

The report indicates the following key points about the attack:
* The external call that makes the reentrancy attack possible (the call in
  `Market.trade` in the example) is emphasized at the top.
* Each external function that could execute the call that triggers the attack
  (such as `Market.trade`) is reported.
* The report will indicate which variables are read or updated before the call,
  as well as variables that are read or updated after the call.
  These indicate the impact of an attack, if one is possible.
* In between the variables, a list of external functions that can be used to
  interfere with the listed variables by reading or modifying them will be
  reported.
  Here, `Vault.deposit` is reported because it will read the token balance and
  `Vault.totalCredit`.

## Limitations

* The detector cannot reason about the storage variables of `interface`
  contracts that have no implementations in the project.
  For example, if project being analyzed only has an `IERC20` interface, but no
  actual `ERC20` contract is compiled, then the detector will be unable to
  report any reentrancy vulnerabilities related to the `ERC20` contract's
  balance and total supply variables, even if such vulnerabilities may actually
  exist.
* When a call with an unknown target is encountered, such as a low-level call or
  a native currency `.send/.transfer`, the call is assumed to be able to reach
  any function of any concrete contract defined in the project.
* The detector currently does not reason about accesses of native currency
  balances, e.g. such as `address(this).balance`.
* During the analysis, each contract is assumed to only have one instance deployed.
  This is to improve the detector's running time and to avoid confusion in the report.

## How to Assess Severity

The severity of a finding reported by the Cross-Contract Reentrancy detector depends on
two aspects:

1. **The conditions under which a reentry point can be exploited.**
   The detector conservatively assumes that every external call may allow an
   attacker to reenter.
   However, several factors may restrict reentry, such as the presence of
   reentry guards, checks on storage variables/mappings, and assumptions on what
   contracts will be called.
   If a reentry point cannot actually be used to reenter, further storage
   accesses may not actually be vulnerable.

2. **The impact of storage variable access on reentry with respect to the
   affected functions and variables and their users.**
   In some cases, storage variables will not be in an inconsistent state even if
   a reentry occurs.
   For example, consider the following function:
   ```solidity
   function deposit(uint256 amount) {
       token.transferFrom(msg.sender, address(this), amount);  // reentry point
       totalSupply += amount;  // state modification
   }
   ```
   Assuming the token invokes a callback after the transfer is applied to the
   token state, the Cross-Contract Reentrancy detector may flag the
   `transferFrom` call.
   When we consider the contract with the function by itself, the reported
   finding is a false alarm, because the `totalSupply` will be updated
   atomically.
   However, the finding will be an actual vulnerability if _another_ contract
   depends on both the token balance and `totalSupply`, as we have seen with the
   running example used in the [Example and Explanation
   section](#example-and-explanation).

   :::info
   A call like the one above could be vulnerable to frontrunning attacks, but
   that is out of scope of the Cross-Contract Reentrancy detector.
   :::
