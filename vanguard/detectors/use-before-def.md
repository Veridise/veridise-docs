---
sidebar_position: 2
title: Use Before Definition
description: Detects the usage of uninitialized variables
---

# Use Before Definition (`use-before-def`)

## Summary and Usage

The Use Before Definition detector alerts the user about uses of a variable before
that variable has been assigned a value.
This includes contract storage variables as well as stack variables.
Since Solidity will automatically zero-initialize variables that are not
explicitly assigned a value, these alerts may not necessarily correspond to a
vulnerability.
However, such patterns can easily lead to vulnerabilities if developers
incorrectly assume that the variable has been assigned a nonzero value.
Users should carefully consider these alerts to determine if each uninitialized
value is currently a vulnerability, or if it may become a vulnerability in the
future due to insufficient documentation of assumptions.

:::warning

The current version of Use Before Definition in DeFi Vanguard only supports
storage variables.
Support for stack and memory variables will come in a later update.

:::

### Usage

The Use Before Definition detector is invoked by selecting "Use Before Definition"
in the Detector selection during the tool configuration step.

## Example and Explanation

The following contract shows a simple protocol that will mint tokens for a fee.
This contract has a Use Before Definition vulnerability because the fee will remain
uninitialized if the contract is constructed with a `feeType` of 2. This will allow
users to mint tokens without paying any fee.

```solidity title=use_before_def_storage.sol showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
  uint256 fee;

  constructor(uint256 feeType) public {
    if (feeType == 0) {
        fee = 10;
    } else if (feeType == 1) {
        fee = 20;
    } else if (feeType > 2){
        fee = feeType;
    }
  }

  function mintToken() public payable {
    require(msg.value >= fee);

    // Send user a token
  }

}
```

### Vanguard Output

When run on the above contract, the Use Before Def detector will make
the following report:

```text showLineNumbers
[Medium] Storage variable fee used before definition
Reported By: vanguard:use-before-def
Location: Bank.mintToken @ Bank.sol:17:3-21:3
Confidence: 0.75
More Info: placeholder
Details:
Contract storage variable fee used before definition in the following location(s)
  * ⚠️ @ Bank.mintToken @ Bank.sol:18:5
  * Affected contracts:  Bank
```

For storage variable vulnerabilities the detector will record which storage variable
may be used before definition. It then records each location that that variable is
used where its value may be uninitialized. Finally the report includes a list of
contracts that are affected by this vulnerability. In this case, only the Bank
contract is affected, but if other contracts inherited the vulnerable function,
they may be affected as well.

:::note

Other types of alerts from this detector may look like the following:

<details>
<summary>Stack Variable Example</summary>

```solidity showLineNumbers
pragma solidity ^0.8.15;
contract Bank2 {

  function mintToken(uint256 numTokens) public payable {
    uint256 fee;
    if (numTokens == 0) {
        fee = 1;
    } else if (numTokens == 1) {
        fee = 2;
    } else if (numTokens > 2){
        fee = feeType;
    }

    require(msg.value >= fee);

    // Send user numTokens tokens
  }
}
```

This contract is analogous to the storage variable example although the
vulnerability is much more severe because any user can exploit it without needing
to rely on a mistake that occurs during contract deployment.

When run on the above contract, the Use Before Definition detector will make
the following report:

```text showLineNumbers
[Medium] Stack variable declared at Bank2.mintToken @ Bank2.sol:7:5 used before definition
Reported By: vanguard:use-before-def
Location: Bank2.mintToken @ Bank2.sol:7:5
Confidence: 0.75
More Info: placeholder
Details:
Stack variable declared at Bank2.mintToken @ UseBeforeDefERC.sol:7:5 used before definition in the following location(s)
  * ⚠️ @ Bank2.mintToken @ test/use-before-def-tests/UseBeforeDefERC.sol:16:5
  * Affected contracts:  Bank2 
```

This differs from the storage variable alert in that it includes the declaration location of the vulnerable variable.

</details>

<details>
<summary>Missing Return Example</summary>

```solidity showLineNumbers
pragma solidity ^0.8.15;

contract MissingReturn {
    function vulnerable(uint256 x) public returns (uint256) { 
      if (x == 0) {
        return 10;
      } else if (x > 1) {
        return 20;
      }
    }
}
```

The `vulnerable()` function above doesn't have a return statement for the case when
x is equal to 1. If 1 is passed to this function, the return value will be zero
initialized.

When run on the above contract, the Use Before Definition detector will make
the following report:

```text showLineNumbers
[Medium] Uninitialized value returned from MissingReturn.vulnerable
Reported By: vanguard:use-before-def
Location: MissingReturn.vulnerable @ UseBeforeDefMissingReturn.sol:6:5-12:5
Confidence: 0.75
More Info: placeholder
Details:
Uninitialized value returned from MissingReturn.vulnerable
  * Affected contracts: MissingReturn 
```

</details>

<details>
<summary>Initializer Example</summary>

```solidity showLineNumbers
pragma solidity ^0.8.15;

contract Bank3 {
  uint256 fee;

  function setFee(uint256 newFee) public onlyAdmin {
    fee = newFee;
  }

  function mintToken() public payable {
    require(msg.value >= fee);

    // Send user numTokens tokens
  }
}
```

This is analogous to the previous Bank examples. In this case the admin must call
`setFee()` in order to set the fee for minting new tokens. Since `setFee()` isn't
called in the constructor, users may be able to mint tokens for free until the
admin calls `setFee()`.

When run on the above contract, the Use Before Definition detector will make
the following report:

```text showLineNumbers
[Info] Storage variable fee used before definition
Reported By: vanguard:use-before-def
Location: Bank3.mintToken @ test/use-before-def-tests/UseBeforeDefERC.sol:11:3-15:3
Confidence: 0.75
More Info: placeholder
Details:
Contract storage variable fee not guaranteed to be initialized in
  * ⚠️ @ Bank3.mintToken @ Bank3.sol:12:5
  * Note: This variable is not initialized automatically, but may be initialized by calling one of the following functions:
    * Bank3.setFee
  * Affected contracts: Bank3 
```

Vanguard will generate an alert because the initializer function isn't called by
default, but will reduce the severity because the contract contains an initializer
function for the variable. For these alerts, the developers should ensure that the
necessary initializer functions are called before the contract is enabled for use.

</details>
:::

## Limitations

* This detector will not detect if individual fields of a struct are used before
  definition if the struct itself is initialized.
* This detector will not generate alerts for mappings or arrays.
* This detector will generate false positives when variables are left to be zero
  initialized intentionally.

## How to Assess Severity

The severity of a finding reported by the Use Before Definition detector depends on
two aspects:

1. **Whether it is safe for that variable to be zero initialized.**
    If the variable is, e.g.,  a counter or a user balance, it _should_ start at 0 and is safe
    to be zero initialized.
    If the variable corresponds to something like an address or a fee, it could
    be a very severe vulnerability depending on how the variable is used.

2. **Whether assumptions are properly documented.**
    A zero-initialized variable may be perfectly safe in the current implementation,
    but if it isn't obvious to future developers that the variable's value may be
    zero, severe vulnerabilities could arise in the future.
