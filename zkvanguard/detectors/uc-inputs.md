---
sidebar_position: 3
title: uc-inputs
---

# Under-Constrained Inputs (`uc-inputs`)

## Summary and Usage

The Unconstrained Output (UCI) detector finds unconstrained output vulnerabilities in ZK circuit code.
The UCI detector looks to see if an input into a component is constrained either by an input value or a constant value---if neither is true, then the output is not constrained and can result in a vulnerability, as a malicious actor may be able to create valid proofs for bogus statements when outputs are unconstrained.
The UCI detector can be invoked with the argument: `--detector uc-inputs`.

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

In this example, `outp` is assigned to and constrained by input `inp1`, but is not constrained by the input `a`, which is flagged as a UCI bug.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=uc-outputs uco_bug.circom
```

```txt title=Output
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

Add a paragraph at the end that states this category of bugs can be fixed by introducing a magic constraint and reference this link:
Also mention that some proof systems implicitly inject such constraints for input signals
https://geometry.xyz/notebook/groth16-malleability