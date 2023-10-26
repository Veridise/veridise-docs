---
sidebar_position: 3
title: uc-inputs
description: Finds under-constrained input signals.
---

# Unconstrained Inputs (`uc-inputs`)

## Summary and Usage

The Unconstrained Input (UCI) detector finds under-constrained input vulnerabilities in ZK circuit code.
The UCI detector looks to see if an input into a component is used in any constraint---if not, then a malicious actor may be able to create new valid proofs by taking an existing proof and simply changing a public input that is unconstrained.

### SaaS Usage

The UCI detector is invoked by selecting "Under-constrained inputs" (`uc-inputs`) in the Detector selection during the tool configuration step.

### Command-line Usage

The UCI detector is invoked with the argument: `--detector uc-inputs`.

## Example and Explanation

```circom title="uci_example.circom" showLineNumbers
pragma circom 2.0.0;

template UCI_Bug() {
  signal input inp1;
  signal input inp2;
  signal output outp;

  outp <== inp1;
}

component main = UCI_Bug();
```

In this example, `outp` is assigned to and constrained by input `inp1`.
However, no constraints are placed on `inp2`, which is flagged as a UCI bug.

<details>
<summary>ZK Vanguard Command-line Example</summary>

```shell title=Command
vanguard_driver --detector uc-inputs uci_example.circom
```

</details>

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with uc-inputs detector----
Running detector: uc-inputs
===========================================================================
 Vanguard's unconstrained input signal detector found the following issue:
===========================================================================
[MEDIUM] In template UCI_Bug in uci_example.circom:3, Vanguard found an input signal that is unconstrained:
  * Signal inp2
```

</details>

## Severity and Solutions

While attackers may be able to exploit under-constrained inputs, some proof systems introduce a "magic constraint"
to automatically constrain otherwise unconstrained inputs (see [this discussion on Groth16 malleability](https://geometry.xyz/notebook/groth16-malleability) for a more in-depth discussion).
These magic constraints prevent attackers from manipulating public, not-explicitly-constrained inputs to create new valid proofs.
So, the potential severity of an unconstrained input bug is lower than other bugs found by ZK Vanguard, but it is still good to be aware
of potential vulnerabilities that may arise when building circuits for proof systems that may or may not introduce such constraints automatically
(which can be difficult to assertain).