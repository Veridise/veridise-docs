---
sidebar_position: 2
---

# Under-Constrained Inputs (`uc-inputs`)

## Summary and Usage

The Unconstrained Output (UCO) detector finds unconstrained output vulnerabilities in ZK circuit code.
The UCO detector looks to see if a used output from a component is constrained either by an input value or a constant value---if neither is true, then the output is not constrained and can result in a vulnerability, as a malicious actor may be able to create valid proofs for bogus statements when outputs are unconstrained.
The UCO detector can be invoked with the argument: `--detector uc-inputs`.

## Example and Explanation

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

In this example, `out2` is assigned to input `a`, but is not constrained by the input `a`, which is flagged as a UCO bug.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=uc-outputs uco_bug.circom
```

```txt title=Output
----VANGUARD REPORT----
Running detector: uc-outputs
=============================================
 1 Under-constrained output signal detected:
=============================================
A potential under-constrained output signal in UCO_Bug is caused by:
--------------------------------------------------------------------------------
  * Signals: out2
--------------------------------------------------------------------------------
```

</details>

## Severity and Solutions

Add a paragraph at the end that states this category of bugs can be fixed by introducing a magic constraint and reference this link:
Also mention that some proof systems implicitly inject such constraints for input signals
https://geometry.xyz/notebook/groth16-malleability