---
sidebar_position: 2
title: Divide Before Multiply
description: Detects potential loss of precision caused by the order in which operations are applied.
---

# Divide Before Multiply (`divide-before-multiply`)

## Summary and Usage

The Divide Before Multiply detector analyzes a smart contract for situations
where the result of a division operation is passed to a multiplication operation.
This pattern can result in a loss of precision compared to applying the
multiplication operation before the division operation due to truncation that may
occur.

### Usage

The Divide Before Multiply detector is invoked by selecting "Divide Before Multiply"
in the Detector selection during the tool configuration step.

## Example and Explanation

The following ERC20 contract contains a helper function that contains a Divide Before Multiply
vulnerability.

```solidity title=divide-before-multiply.sol showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableERC20 {
  mapping (address => uint256) _balances;

  // Calculates interest to be paid to the user
  function calculateInterest() public returns (uint256){
    return _balances[msg.sender] / 100 * 2;
  }
  // Rest of token
}
```

When computing the interest for the user, the contract divides the user's balance by
100 before multiplying by 2. In doing so, token values will be rounded down to a
multiple of 100. For example, if a user's balance is 50, their interest will be 0.
However, if the multiplication operation happened first, their interest would be 1.

### Vanguard Output

When run on the above contract, the Divide Before Multiply detector will make
the following report:

```text showLineNumbers
[Low] Division before multiplication found in VulnerableERC20.calculateInterest
Reported By: vanguard:divide-before-multiply
Location: VulnerableERC20.calculateInterest @ test/divide-before-multiply-tests/DivideBeforeMultiply.sol:8:3-10:3
Confidence: 0.5
More Info: placeholder
Details:
Divide Before Multiply vulnerability found in VulnerableERC20.calculateInterest
  * The result of the division operation at VulnerableERC20.calculateInterest @ test/divide-before-multiply-tests/DivideBeforeMultiply.sol:9:12 is used as an operand to the follow
ing multiplication operands
    * ⚠️ @ VulnerableERC20.calculateInterest @ test/divide-before-multiply-tests/DivideBeforeMultiply.sol:9:12
```

First, the detector generates a finding for each function that contains a potential
vulnerability. It then indicates the location of the division operation along with a
list of the locations of multiplication operations that use the result of the division.

## Limitations

* The Divide Before Multiply detector detects if the result of any division influences the
  value of any operand of a multiplication operation. This can lead to false positives in
  math-heavy contracts.
  * For example, there may be a contract that calculates an interest rate based on a user's
    balance and then pays out the user by multiplying that rate by the balance. If the interest
    rate calculation is a separate function (to be used elsewhere), this detector will generate
    a false positive alert because the division operation in the interest rate calculation affects
    a multiplication in the payout function.

## Assessing Severity

The severity of a finding reported by the Divide Before Multiply detector depends on how
the result is used. If the loss of precision results in users paying fewer fees, it could
cause minor problems for a protocol. If the loss of precision results in incorrect
bookkeeping by a contract it could result in a more severe vulnerability like insolvency or
locked funds. In other situations, the result of a division operation may influence a
multiplication operand in an indirect way and there may be no issue at all with how it is used.
For example, when multiplying several fractions together, if all the multiplication operations
happen before the division, the result may overflow so there must be some division before
multiplication. In general, the bigger the dividend relative to the divisor, the less of an
impact this issue will have.
