---
sidebar_position: 1
---

# DeFi Domain Detectors

These detectors are used for debugging blockchain applications, e.g. projects written in Solidity.

## Reentrancy (`reentrancy`)

### Summary and Usage

The Reentrancy detector examines blockchain applications for reentrancy vulnerabilities, wherein a callback called by a function can be used to re-enter the function and bypass safety checks (e.g., withdraw more than the allowed balance because the balance is update only after the callback is complete).
The Flashloan detector is invoked using the argument: `--detector=flashloan`.

### Example and Explanation

```solidity title=reentrancy.sol
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

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        clearBalance();
    }

    function clearBalance() internal {
        balances[msg.sender] = 0;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
```

In the `Wallet` contract above, the contract is vulnerable to a reentrancy attack where the user calls withdraw.
In the call to `msg.sender.call(value: ball)("")`, the attacker can maliciously call withdraw again before clearBalance is called.
Thus, they can empty the wallet of all of its funds.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=reentrancy reentrancy.sol
```

```txt title=Output
----VANGUARD REPORT----
Running detector: reentrancy
========================
 1 Reentrancy detected:
========================
Potential Reentrancy Attack launched from Wallet.withdraw
--------------------------------------------------------------------------------
  * Reentrancy reachable from the following functions:
    - Wallet.withdraw

  * Reentrant calls in Wallet.withdraw:
    - unresolved low-level call

  * State modifications after reentrancy:
    - In Function: Wallet.clearBalance
      * Field: balances
      * Reachable via: Wallet.withdraw -> Wallet.clearBalance
--------------------------------------------------------------------------------
```
</details>

## Divide Before Multiply (`divide-before-multiply`)

### Summary and Usage

The Divide Before Multiply (DBM) detector identifies rounding errors that may be introduced by integer divisions that may occur before integer multiplications (as multiply-before-divide may have no remainder, whereas divide-before-multiply may) in blockchain applications.
Applications that contain divide-before-multiply computations are potentially vulnerable to rounding errors that could result in incorrect or erroneous transactions.
The DBM detector is invoked using the argument: `--detector=divide-before-multiply`.

### Example and Explanation

```solidity title=divide_before_multiply.sol
pragma solidity ^0.8.10;

contract DivideBeforeMultiplyVulnerable {
    function convert(uint x) public view returns (uint) {
        return (x / 5) * 1000;
    }
}
```

In the `convert` function above, values of `x` between 1 and 4 will result in a return value of `0` since the division occurs first. However, if the multiplication came first (`x * 1000 / 5`, or `x * 200`), values of `x` between 1 and 4 will result in values between 200 and 800.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=divide-before-multiply divide_before_multiply.sol
```

```txt title=Output
----VANGUARD REPORT----
Running detector: divide-before-multiply
==============================================
 1 Divide Before Multiply vulnerability found
==============================================
Divide Before Multiply vulnerability found in DivideBeforeMultiplyVulnerable.convert:
--------------------------------------------------------------------------------
  * DivideBeforeMultiplyVulnerable.convert contains a multiplication operation that uses the result of division
--------------------------------------------------------------------------------
```
</details>

## Unchecked Return (`unchecked-return`)

### Summary and Usage

The UncheckedReturn detector finds function return values that are never used in the source code of a blockchain application, as this could indicate that important information is being ignored and a potential vulnerability could arise.
The Unchecked Return detector is invoked using the argument: `--detector=unchecked-return`.

### Example and Explanation

```solidity unchecked.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract UncheckedReturnContract {

    event Success(string);

    function unchecked_send(address payable dst) public payable {
        dst.send(msg.value);
        emit Success("Sent the money to dst");
    }

    function checked_send(address payable dst) public payable returns (uint) {
        if (dst.send(msg.value)) {
            emit Success("Sent the money to dst");
        }
        revert("Could not send the money!");
    }
}
```

The `unchecked_send` function is designed to reroute the `msg.value` from the sender to the `dst` address.
However, if the `send` function fails, the money will not be sent to `dst` and instead be added to the contract's own balance.
The `checked_send` function demonstrates the correct behavior, where the return value of `send` should be checked and the transaction reverted if it fails.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=unchecked-return unchecked.sol
```

```txt title=Output
----VANGUARD REPORT----
Running detector: unchecked-return
========================================
 1 Unchecked Return vulnerability found
========================================
Unchecked return value found in UncheckedReturnContract.unchecked_send:
--------------------------------------------------------------------------------
  * The return value of a call to an unspecified location is never used
--------------------------------------------------------------------------------
```

</details>

## Flashloan (`flashloan`)

### Summary and Usage

The Flashloan detector detects if a blockchain application is vulnerable to a flashloan attack, which is when the purchase price of an asset can be manipulated for the purchaser’s gain.
This detector is invoked using the argument: `--detector=flashloan`.

### Example and Explanation

```solidity title="flashloan.sol"
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TaintedFlashloan {
    IERC20 token;
    uint256 taintedVariable;

    function taintVariable() public {
        taintedVariable = 1 + token.balanceOf(msg.sender);
    }

    function getTaintedVariable() public view returns (uint256) {
        return taintedVariable;
    }

    function getAmount() public view returns (uint256) {
        return getTaintedVariable();
    }

    function sendMoney() public {
        token.transfer(msg.sender, getAmount());
    }

}
```

In this example, the transfer amount in `sendMoney()` is computed based on the balance the sender has of `token` (in `taintVariable()`).
The sender could manipulate this amount by calling `taintVariable()` after acquiring a flashloan of `token`, allowing the sender to later drain the contract of all its funds via `sendMoney()`.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
npm install @openzeppelin/contracts
vanguard_driver --detector=flashloan flashloan.sol -I node_modules/
```

```txt title=Output
----VANGUARD REPORT----
Running detector: flashloan
=================================
 1 Flashloan vulnerability found
=================================
Flashloan vulnerability found in TaintedFlashloan.sendMoney
--------------------------------------------------------------------------------
  * The result of a call to tainted contract variable taintedVariable influences the amount of currency transferred in IERC20.transfer

  * Tainted Value Trace:
    - TaintedFlashloan.sendMoney -> TaintedFlashloan.getAmount -> TaintedFlashloan.getTaintedVariable

  * Taint Source Description:
    - taintedVariable was tainted by the result of a call to IERC20.balanceOf in TaintedFlashloan.taintVariable
--------------------------------------------------------------------------------
```

</details>

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
