import Details from '@theme/MDXComponents/Details';

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

Vanguard's Reentrancy detector makes a report like the following when testing `reentrancy.sol`:

```shell
./vanguard_driver.py --detector=reentrancy reentrancy.sol
```

```txt title="Full Report"
----Preprocessing sources----
Running pyul...
Completed pyul
Running Solidity summarizer...
Completed Solidity summarizer, summary at /tmp/nix-shell.yY7rfa/tmp6vdgq6rr/summary.json.
----Running Vanguard with reentrancy detector----
Completed Vanguard.
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

## Divide Before Multiply (`divide-before-multiply`)

### Summary and Usage

The Divide Before Multiply (DBM) detector identifies rounding errors that may be introduced by integer divisions that may occur before integer multiplications (as multiply-before-divide may have no remainder, whereas divide-before-multiply may) in blockchain applications.
Applications that contain divide-before-multiply computations are potentially vulnerable to rounding errors that could result in incorrect or erroneous transactions.


### Example and Explanation


## Unchecked Return (`unchecked-return`)

### Summary and Usage

The UncheckedReturn detector finds function return values that are never used in the source code of a blockchain application, as this could indicate that important information is being ignored and a potential vulnerability could arise.
The Unchecked Return detector is invoked using the argument: `--detector=unchecked-return`.

### Example and Explanation

## Flashloan (`flashloan`)

### Summary and Usage

The Flashloan detector detects if a blockchain application is vulnerable to a flashloan attack, which is when the purchase price of an asset can be manipulated for the purchaser’s gain.
This detector is invoked using the argument: `--detector=flashloan`.

### Example and Explanation

```solidity title="flashloan.sol"
contract PuppetPool is ReentrancyGuard {

    using Address for address payable;

    mapping(address => uint256) public deposits;
    address public immutable uniswapPair;
    IERC20 public immutable token;

    constructor (address tokenAddress, address uniswapPairAddress) {
        token = IERC20(tokenAddress);
        uniswapPair = uniswapPairAddress;
    }

    // Allows borrowing `borrowAmount` of tokens by first depositing two times their value in ETH
    function borrow(uint256 borrowAmount) public payable nonReentrant {
        uint256 depositRequired = calculateDepositRequired(borrowAmount);

        require(msg.value >= depositRequired, "Not depositing enough collateral");

        if (msg.value > depositRequired) {
            payable(msg.sender).sendValue(msg.value - depositRequired);
        }

        deposits[msg.sender] = deposits[msg.sender] + depositRequired;

        // Fails if the pool doesn't have enough tokens in liquidity
        bool res = token.transfer(msg.sender, borrowAmount);
        require(res, "Transfer failed");
    }

    function calculateDepositRequired(uint256 amount) public view returns (uint256) {
        return amount * _computeOraclePrice() * 2 / 10 ** 18;
    }

    function _computeOraclePrice() private view returns (uint256) {
        // calculates the price of the token in wei according to Uniswap pair
        return address(uniswapPair).balance * (10 ** 18) / token.balanceOf(uniswapPair);
    }
}
```

## Debug Summarizer (`debug-summary`)

### Summary and Usage

The Debug Summarizer is used to generate a report about the construction of a given blockchain code compilation. This summarizer gathers information about the code, such as available functions and variables, and reports on possible calls between the available functions. It is invoked using the argument: `--detector=debug-summary`.

### Example

```sh
./vanguard_driver.py --detector=debug-summary reentrancy.sol
```

<Details>
<summary mdxType="summary">Full Report</summary>

```txt
----VANGUARD REPORT----
Running detector: debug-summary
Writing SARIF report to /tmp/nix-shell.w5vTY6/tmp6my8w735/sarif.json
==

==

--------------------------------------------------------------------------------
  Total Contracts: 1
  Total Libraries: 0
  Total Interfaces: 0
  Total Functions: 4

  * Wallet
    application code: true
    functions:
    - Wallet.deposit
    - Wallet.withdraw
      * Internal call to possible targets Wallet.deposit, Wallet.withdraw, Wallet.clearBalance, Wallet.getBalance
      * Internal call to Wallet.clearBalance
    - Wallet.clearBalance
    - Wallet.getBalance
    variables:
    - balances
--------------------------------------------------------------------------------
Done!
```
</Details>
