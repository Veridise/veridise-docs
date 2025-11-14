---
sidebar_position: 2
title: Unchecked Return
description: Detects when the return value of a non-void call isn't used by the caller.
---

# Unchecked Return (`unchecked-return`)

## Summary and Usage

The Unchecked Return detector alerts the user when a function makes a call to a
function and doesn't check the return values of the call.
By "check the return
values", we refer to the result being used in a meaningful way, like by
influencing the control flow, being written to a storage or memory variable,
being passed as an argument to a call, etc.
In particular, this detector is useful for flagging calls that return values
that must be validated but are actually not in practice.

### Usage

The Unchecked Return detector is invoked by selecting "Unchecked Return"
in the Detector selection during the tool configuration step.

## Example and Explanation

The following contract contains a function with an Unchecked Return
vulnerability.

```solidity title="UncheckedReturnContract.sol" showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract UncheckedReturnContract {
    address dst;
    function vulnerable(uint256 amount) external {
        payable(dst).call{value: amount}("");

        // Assumes the transfer succeeded
    }
}
```

This function sends native currency using a low-level call. This call will return a
result indicating whether the call was successful. Since the function doesn't check
this success result, the function's assumption that the transfer has succeeeded isn't
guaranteed to be true, which could lead to vulnerabilities later in the function.

### Vanguard Output

When run on the above contract, the Unchecked Return detector will make
the following report:

```text showLineNumbers
[Medium] Function an unknown target has some unchecked return values.
Reported By: vanguard:hiyul/unchecked-return
Location: UncheckedReturnContract.vulnerable @ UncheckedReturnContract.sol:6:5
Confidence: 0.92
More Info: placeholder
Details:
Function an unknown target is called but one or more of its return values are never used.
  * The success status is never used in UncheckedReturnContract.vulnerable
    * ⚠️ @ UncheckedReturnContract.vulnerable @ UncheckedReturnContract.sol:7:9
  * Affected contracts: UncheckedReturnContract
```

First, the detector reports which function contains the vulnerability. It then indicates
the call target and the location of the call whose return value is unchecked.

## Limitations

* For external calls, since the return type of the call target isn't included in the ABI
  for that function, it can't be determined for certain whether the call target may have a
  return value. For calls to an interface function, Solc will insert ABI decode calls if
  that function has a return type which can help with determining if a call is to a void
  function, but these decode calls aren't inserted for low level calls. In an alert, the
  detector will indicate all call targets that match the selector of the call. This may
  generate false positives for calls that will be to a void function in production.

:::note

Here is an example of a finding with a call target that has multiple matching selectors:

<details>

<summary>Example Contract with External Calls</summary>

```solidity showLineNumbers
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IVoidCallTarget {
    function foo() external;
}

interface ICallTarget {
    function foo() external returns (uint256);
}

contract ExternalCallContract{
  function caller(address dst) public {
    ICallTarget(dst).foo();

  }
}
```

The Unchecked Return detector output for this contract will look like the following:

```text showLineNumbers
[Medium] Unchecked result of a call in ExternalCallContract.caller
Reported By: vanguard:unchecked-return
Location: ExternalCallContract.caller @ test/unchecked-return-tests/UncheckedReturn.sol:13:3-16:3
Confidence: 0.9
More Info: placeholder
Details:
Unchecked return value found in ExternalCallContract.caller
  * The return value of an external call to foo() is never used
    * ⚠️ @ ExternalCallContract.caller @ UncheckedReturn.sol:14:5
    * Possible callee(s) with non-void return type include: ICallTarget.foo
    * Note: the following function(s) have the same selector but returns void. If this call is to one of these function(s), then you can ignore this warning.
      * IVoidCallTarget.foo
  * Affected contracts:  ExternalCallContract 
```

This alert will include the fact that `IVoidCallTarget.foo` has the same selector as
`ICallTarget.foo`. As described in the alert, if an external call is known to be a void
target (e.g., `IVoidCallTarget.foo`), it is safe to mark alerts like these as false positives.

</details>
:::

## How to Assess Severity

The severity of a finding reported by the Unchecked Return detector depends on the meaning
of the result and what assumptions are made about the call in the caller function.
If the caller function can safely ignore the result of the call or can safely ignore whether the call
succeeds, then the finding may be considered benign. For example, the call result of
`EnumerableSet.add()` or `EnumerableSet.remove()` can generally be ignored.

Otherwise, the severity varies depending on the importance of the call result. For example, if the
call is used to transfer currency from a user and tokens are minted for the user later in the
function, it would be a critical vulnerability if the contract doesn't check that the funds from
the user are successfully transferred to the contract.
