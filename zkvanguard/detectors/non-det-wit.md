---
sidebar_position: 1
title: Non-Deterministic Witness
description: Detects non-deterministic witness computations.
---

# Non-Deterministic Witness (`non-det-wit`)

## Summary and Usage

The Non-Deterministic Witness (NDW) detector warns the user about
non-deterministic witness code (i.e., dataflow operations) in their ZK circuit,
which occurs when dataflow is dependent on conditional branches or conditional assignments.
Conditional assignments are difficult to properly constrain and likely to
lead to unconstrained values, which can lead to significant security risks as
unconstrained values could allow for the construction of bogus proofs.

### Usage

The NDW detector is invoked by selecting "Non-deterministic dataflow"
(`non-det-wit`) in the Detector selection during the tool configuration step.

## Example and Explanation

```circom title="non_det_wit_bug.circom" showLineNumbers
pragma circom 2.0.0;

template Invert() {
  signal input in;
  signal output out;

  out <-- in != 0 ? 1 / in : 0;

  in*out === 0;
}

component main = Invert();
```

In this example, `out` is conditionally assigned based on the value of `in`. The developer’s intent is for `out = 1/in` if `in` is not 0, and `out = 0` otherwise. However, this constraint is not specified, so if `in = 0`, any value of `out` could be provided without violating `in*out === 0`.
So, if `in = 0`, `out = 0` is expected by the developer, but the assignment of `in = 0, out = 99` would also satisfy the constraints.

## Usage Example

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Running Vanguard with non-det-wit detector----
Running detector: non-det-wit
[Critical] Found signal in component that are used in conditional expressions Invert @ ./non_det_wit_bug.circom:3
Reported By: vanguard:non-det-wit
Location: Invert @ ./non_det_wit_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
Found signal in component that are used in conditional expressions Invert @ ./non_det_wit_bug.circom:3
  * Signal  in in expression Invert @ ./non_det_wit_bug.circom:7
```

</details>
