---
sidebar_position: 2
title: Flashloan
description: Detects potential vulnerabilities that can be exploited through the use of a flash loan.
---

# Flashloan (`flashloan`)

## Summary and Usage

The Flashloan detector analyzes a smart contract for situations where a token
balance is used to determine the amount of funds transferred by a token transfer,
or to determine if a transfer will occur.

Flash loans allow a user to take a loan without any collateral if they return the money
plus a fee before the end of the transaction. For example, well known protocols such as
[AAVE](https://docs.aave.com/developers/guides/flash-loans) offer flash loans.
This can allow users to temporarily inflate their token balance. Since user token balances
can be manipulated through the use of a flash loan, this can lead to vulnerabilities if
contracts don't take measures to protect against such attacks.

### Usage

The Flashloan detector is invoked by selecting "Flashloan" in the Detector
selection during the tool configuration step.

## Example and Explanation

The following ERC20 contract contains a function that will pay out rewards based on a
user's balance.

```solidity title=flashloan.sol showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Flashloan is ERC20 {
    function payRewards() public {
        token.transfer(msg.sender, balanceOf(msg.sender / 10));
    }
}
```

The `payRewards()` function can be exploited through the use of a flash loan. Since it
just checks the current balance, a user can use a flash loan to inflate their balance
before requesting rewards, which will allow them to claim more rewards than should be allowed.

### Vanguard Output

When run on the above contract, the Flashloan detector will make
the following alert:

```text showLineNumbers
[High] Flashloan vulnerability
Reported By: vanguard:flashloan
Location: Flashloan.payRewards @ Flashloan.sol:7:35
Confidence: 0.65
More Info: placeholder
Details:
The result of a call to balanceOf(address) at Flashloan.payRewards @ Flashloan.sol:7:35 may cause a flashloan vulnerability in the following location(s)
  * ⚠️ The amount of currency transferred by transfer(address,uint256) at Flashloan.payRewards @ Flashloan.sol:7:9
```

The detector reports that the call to `balanceOf(address)`, which returns
the token balance of a user, is involved in the computation of the amount of funds transferred.
It also includes the location of the calls to `balanceOf(address)` and `transfer(address,uint256)`.

## Vulnerability Patterns

* The Flashloan detector will look for internal or external calls to `balanceOf(address)`
  and for user balances that are tracked by a contract variable (these will be referred
  to as "tainted contract variables" in an alert).

* The Flashloan detector will then generate a finding when the amount field of an internal
  or external call to `transfer()` or `transferFrom()`, or the condition of a `require()`
  statement guarding such a transfer is influenced by a balance check.

## Limitations

* This detector only supports the balance checks and transfers described above. Flash loans
  involving native currencies, ERC721 tokens, or votes are not supported.

## Assessing Severity

The severity of a finding reported by the Flashloan detector depends on how the token
balance is used. If the balance is just used to withdraw funds (and is decremented with
the withdrawal), the function is likely not vulnerable to a flash loan attack. If the
balance is used to determine rewards or transfers money to the user in some way other
than a simple withdrawal, the vulnerability could be very severe. To precisely assess
the vulnerability, consider how a user with unlimited funds could affect the protocol.

This detector can also report false positives in contracts that take measures to mitigate
against flash loan attacks. For example, if a delay is enforced before allowing users to
withdraw, an alert may still be generated even though this contract will not be vulnerable
to a flash loan attack.
