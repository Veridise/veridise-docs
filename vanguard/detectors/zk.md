import Details from '@theme/MDXComponents/Details';

# Detectors

## DeFi Domain Detectors

### Reentrancy (`reentrancy`)

#### Summary and Usage

The Reentrancy detector examines blockchain applications for reentrancy vulnerabilities, wherein a callback called by a function can be used to re-enter the function and bypass safety checks (e.g., withdraw more than the allowed balance because the balance is update only after the callback is complete).
The Flashloan detector is invoked using the argument: `--detector=flashloan`.

#### Example and Explanation

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

### Divide Before Multiply (`divide-before-multiply`)

#### Summary and Usage

The Divide Before Multiply (DBM) detector identifies rounding errors that may be introduced by integer divisions that may occur before integer multiplications (as multiply-before-divide may have no remainder, whereas divide-before-multiply may) in blockchain applications.
Applications that contain divide-before-multiply computations are potentially vulnerable to rounding errors that could result in incorrect or erroneous transactions.


#### Example and Explanation


### Unchecked Return (`unchecked-return`)

#### Summary and Usage

The UncheckedReturn detector finds function return values that are never used in the source code of a blockchain application, as this could indicate that important information is being ignored and a potential vulnerability could arise.
The Unchecked Return detector is invoked using the argument: `--detector=unchecked-return`.

#### Example and Explanation

### Flashloan (`flashloan`)

#### Summary and Usage

The Flashloan detector detects if a blockchain application is vulnerable to a flashloan attack, which is when the purchase price of an asset can be manipulated for the purchaser’s gain.
This detector is invoked using the argument: `--detector=flashloan`.

#### Example and Explanation

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

### Debug Summarizer (`debug-summary`)

#### Summary and Usage

The Debug Summarizer is used to generate a report about the construction of a given blockchain code compilation. This summarizer gathers information about the code, such as available functions and variables, and reports on possible calls between the available functions. It is invoked using the argument: `--detector=debug-summary`.

#### Example

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

## ZK Domain Detectors

### Dataflow Constraint Difference (`df-constr-diff`)

#### Summary and Usage
The Dataflow-Constraint Discrepancy (DCD) detector finds discrepancies between the dataflow graph and constraint graph of a ZK circuit.
Such discrepancies can result in significant security risks, as malicious actors may be able to create valid proofs for bogus statements due to the mismatch between the constraints and actual computation.
The DCD detector is invoked with the argument: `--detector=df-constr-diff`.

#### Example and Explanation

```circom title="constraint_diff.circom"
pragma circom 2.0.0;

template Increment() {
  signal input a;
  signal input b;
  signal output out;
  out <-- a + 1;
  out === b + 1;
}

component main = Increment();
```

In this example, out is assigned `a + 1`, but is constrained on `b + 1`.
his means that out is dataflow dependent on input `a` but constraint dependent on input `b`.
This discrepancy in dataflow and constraint dependencies means there is a mismatch in the overall dataflow and constraint graphs in the circuit, which likely deviates from the developer’s intentions.

When Vanguard is run on `constraint_diff.circom`, it generates a report like the following:

```shell
./vanguard_driver.py --detector=df-constr-diff constraint_diff.circom
```

```txt
----VANGUARD REPORT----
Running detector: df-constr-diff
========================
 1 DCD signal detected:
========================
A potential DCD in Increment is caused by:
--------------------------------------------------------------------------------
  * Signals: a and out
--------------------------------------------------------------------------------

 --- call.fr_add
 ---
 ---
 --- call.fr_add
 ---
call.fr_add --- call.fr_add
 ---
 ---
 ---
 ---
 ---
 ---
 ---
```

### Non-Deterministic Dataflow (`df-nondet`)

#### Summary and Usage

The Non-Deterministic Dataflow (NDD) detector warns the user about non-deterministic dataflow in their ZK circuit, which occurs when dataflow is dependent on conditional branches. Conditional assignments are difficult to properly constrain and likely to lead to unconstrained values, which can lead to significant security risks as unconstrained values could allow for the construction of bogus proofs.

The NDD detector is invoked with the argument: `--detector=df-nondet`.

#### Explanation and Example

```circom title="nondet.circom"
pragma circom 2.0.0;

template Invert() {
    signal input in;
    signal output out;

    out <-- in != 0 ? 1 / in : 0;

    in*out === 0;
}

component main = Invert();
```

In this example, `out` is conditionally assigned based on the value of `in`. The developer’s intent is for `out = 1/in` if `in` is not 0, and `out = 0` otherwise. However, this constraint is not specified, so if `in = 0`, any value of `out` could be provided without violating `in*out === 0`. So, if `in = 0`, `out = 0` is expected by the developer, but the assignment of `in = 0, out = 99` would also satisfy the constraints.

Vanguard produces the following report from nondet.circom:

```shell
./vanguard_driver.py --detector=df-nondet nondet.circom
```

```txt
----VANGUARD REPORT----
Running detector: df-nondet
========================
 1 NDD signal detected:
========================
A potential NDD in Invert is caused by:
--------------------------------------------------------------------------------
  * Signal: in
--------------------------------------------------------------------------------
```

### Unconstrained Outputs (`uc-outputs`)

#### Summary and Usage

#### Example and Explanation

```circom title="uco_bug.circom"
pragma circom 2.0.0;

template UCO_Bug() {
  signal input a;
  signal input b;
  signal output out1;
  signal output out2;

  out1 <== a + b;
  out2 <-- a;
  out2 * (out2 - 1) === 0;
}

component main = UCO_Bug();
```

### Unconstrained Subcomponent Output (`uc-subcomp`)

#### Summary and Usage

#### Example and Explanation

```circom title="uc_subcomp_bug.circom"
pragma circom 2.0.0;

template Diff() {
  // n must be less than m
  signal input n;
  signal input m;
  signal output o;

  component lt = LessThan(100);

  lt.in[0] <== n;
  lt.in[1] <== m;

  o <== m - n;
}

component main = Diff();
```

### Divide By Zero (`zk-divide-by-zero`)

#### Summary and Usage

The Divide By Zero (DBZ) detector is used to identify potential divide-by-zero errors in ZK circuits.
Divide-by-zero errors can lead to significant security risks, as malicious actors may be able to create valid proofs for bogus statements.

The DBZ detector is invoked by providing Vanguard with the argument: `--detector=zk-divide-by-zero`.

#### Explanation and Example

The DBZ detector detects patterns of the following form:

```circom title="divide.circom"
pragma circom 2.0.0;

template Divide() {
    signal input in1;
    signal input in2;
    signal output out;
    out <-- in1 / in2;
    out * in2 === in1;
}

component main = Divide();
```

In this example, the constraints of the circuit can be satisfied by the following assignment: `in1 = 0, in2 = 0, out = 5`. However, this clearly deviates from the developer’s intention, which was for `out` to be set to `in1 / in2`.

Running Vanguard on the above example gives the following report:
```sh
./vanguard_driver.py --detector=zk-divide-by-zero divide.circom
```

```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with zk-divide-by-zero detector----
Completed Vanguard.
----VANGUARD REPORT----
Running detector: zk-divide-by-zero
========================
 1 DBZ signal detected:
========================
A potential DBZ in Divide is caused by:
--------------------------------------------------------------------------------
  * Signal: in2
--------------------------------------------------------------------------------

Writing SARIF report to /tmp/nix-shell.w5vTY6/tmp7g9avizq/sarif.json
```


## LLVM Domain Detectors

These detectors are

### Statistics Generator (`statGen`)

#### Summary and Usage

The Statistics Generator creates a Vanguard report summarizing high-level statistics

#### Example

```sh
./vanguard_driver.py --detector=statGen divide.circom
```
```txt
----VANGUARD REPORT----
Running detector: statGen
Statistics:
# Functions: 37
# Basic Blocks: 67
# Instructions: 164
```

### Function Printer (`fnPrinter`)

#### Summary and Usage

The Function Printer is a debugging tool used to output the names of all functions present in the provided code. It is invoked using the argument: `--detector=fnPrinter`.

#### Example

```sh
./vanguard_driver.py --detector=fnPrinter divide.circom
```

<Details>
<summary mdxType="summary">Full Report</summary>
```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with fnPrinter detector----
Completed Vanguard.
----VANGUARD REPORT----
Running detector: fnPrinter
Found Function: fr_add
Found Function: fr_sub
Found Function: fr_mul
Found Function: fr_div
Found Function: fr_intdiv
Found Function: fr_mod
Found Function: fr_eq
Found Function: fr_neq
Found Function: fr_lt
Found Function: fr_gt
Found Function: fr_le
Found Function: fr_ge
Found Function: fr_neg
Found Function: fr_shl
Found Function: fr_shr
Found Function: fr_bit_and
Found Function: fr_bit_or
Found Function: fr_bit_xor
Found Function: fr_bit_flip
Found Function: fr_logic_and
Found Function: fr_logic_or
Found Function: fr_logic_not
Found Function: fr_cast_to_addr
Found Function: fr_copy_n
Found Function: fr_pow
Found Function: __constraint_values
Found Function: __constraint_value
Found Function: __abort
Found Function: __assert
Found Function: __array_load__0_to_1
Found Function: __array_store__0_to_1
Found Function: __array_load__2_to_3
Found Function: __array_store__2_to_3
Found Function: __array_load__1_to_2
Found Function: __array_store__1_to_2
Found Function: Divide_0_build
Found Function: Divide_0_run
Done!
```
</Details>

### IR Validator (`irValidator`)

#### Summary and Usage

The IR Validator is an internal debugging tool used to verify that the LLVM IR generated by Vanguard's compiler frontends is valid.
It is invoked using the argument: `--detector=irValidator`.

#### Example

```sh
./vanguard_driver.py --detector=fnPrinter divide.circom
```

```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with irValidator detector----
Completed Vanguard.
----VANGUARD REPORT----
Running detector: irValidator
IR validated successfully!
Writing SARIF report to /tmp/nix-shell.w5vTY6/tmp0nof78hd/sarif.json
```
