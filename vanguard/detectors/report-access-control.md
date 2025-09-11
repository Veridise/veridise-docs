---
sidebar_position: 3
title: Report Access Control (Legacy)
description: Lists inferred access controls in a contract.
---

# Report Access Control (`report-access-control`)

:::info

This detector is only available when selecting "DeFi Vanguard (Legacy)" in AuditHub.

:::

The Report Access Control detector reports, for each contract, a model of the
access controls of that contract as inferred by Vanguard.
Specifically, it will identify what functions may require privileged "roles"
(corresponding to storage variables) variables, how those roles may be assigned,
and what those roles are able to do (such as calling specific functions,
transferring currency, etc.).
Although this detector does not find any vulnerabilities by itself, it can be
used to understand the access controls of each contract.

### Usage

The Report Access Control detector is invoked by selecting "Report Access
Control" in the Detector selection during the tool configuration step.

## Example and Explanation

Consider the following Solidity code, which implements a wallet smart contract:

```solidity title=ManagedWallet.sol showLineNumbers
pragma solidity ^0.8.0;

contract ManagedWallet {
  address public owner;
  address public beneficiary;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  modifier onlyBeneficiary {
    require(msg.sender == beneficiary);
    _;
  }

  constructor(address _owner) {
    owner = _owner;
  }

  receive() external payable onlyOwner {
    // no-op -- just receive native currency
  }

  function setBeneficiary(address newBeneficiary) external onlyOwner {
    beneficiary = newBeneficiary;
  }

  function withdraw(uint256 amount) external onlyBeneficiary {
    payable(msg.sender).transfer(amount);
  }
}
```

The `ManagedWallet` contract provides special privileges to two accounts: the
`owner` and the `beneficiary`.
The `owner` is allowed to transfer native currency to the wallet and designate
an address as the `beneficiary`.
In turn, the `beneficiary` is allowed to transfer funds out of the wallet by
calling the `withdraw()` function.

### Vanguard Output

When the Report Access Control detector is run on the `ManagedWallet` contract
above, Vanguard will produce a report describing the access controls of the
contract.

```plain showLineNumbers
[Info] Access control summary for ManagedWallet @ ManagedWallet.sol:3:1-32:1
Reported By: vanguard:report-access-control
Location: ManagedWallet @ ManagedWallet.sol:3:1-32:1
Confidence: 0.5
More Info: placeholder
Details:
Access control summary for ManagedWallet @ ManagedWallet.sol:3:1-32:1 . Note that this is not exhaustive and must be inspected for completeness.
  * ManagedWallet has the following privileged roles
    * beneficiary
    * owner
  * The following functions will check or modify privileged roles
    * ManagedWallet.receive
      * May check caller is owner
    * ManagedWallet.setBeneficiary
      * May check caller is owner
      * May modify roles beneficiary
    * ManagedWallet.withdraw
      * May check caller is beneficiary
```

The report begins by listing the privileged roles that could be inferred.
Currently, this consists of the storage variables that the `msg.sender` of a
call may be validated against, such as `owner` and `beneficiary`.
Then the report lists each function that may check or modify the roles.
For example, the report indicates that `setBeneficiary()` requires that the
`msg.sender` is `owner` and that the function may modify `beneficiary`.

## Limitations

* Not all actual roles or access controls will be found by the detector.
  The output of the detector serves as a guideline and must be inspected for
  completeness.
* The detector infers the contract's roles by checking for code patterns such as
  `require(msg.sender == someStorageVariable)` and
  `if (msg.sender != someStorageVariable) revert();`.
  If there are patterns that do not match your application, please send a
  feature request to AuditHub support.
* Currently, the detector is based on syntax but not value flow; it currently
  does not recognize access control checks or storage modifications that involve
  a function parameter whose value may be `msg.sender`.
  This limitation will be removed when the detector is updated in the future.
* The detector will only report roles that are implemented using storage
  variables in the same contract.
  It does not report roles that may be implemented using calls to other
  contracts.

## Assessing Severity

In general, the Report Access Control detector is meant to produce informative
reports, not to search for vulnerabilities.
However, it may be useful to review when attempting to find security
vulnerabilities in a protocol.
For example, if no output is produced by this detector when running on a
contract that is meant to have access controls, then the contract should be
reviewed for missing access controls.
