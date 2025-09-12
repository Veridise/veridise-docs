---
sidebar_position: 1
title: Compute-Constrain Difference
description: Detects discrepancies between witness computation and constraint generation.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Compute-Constrain Difference

## Summary and Usage

The Compute-Constrain Difference detector warns the user about signals
where the assignment of a given signal in the witness (i.e., in dataflow operations) contain
a different set of signals and/or constant values than are contained in the set of
signals and/or constant values that constrain the given signal.
Such differences occur when witness computation and constraint generation for a given
signal are performed separately (e.g., with `<--` and `===` operations in Circom instead of
`<==` operations, or with `NondetReg`s in Zirgen), and these differences can lead to underconstrained or improperly constrained signals.
Such discrepancies may allow malicious actors to construct bogus proofs and subvert the application's security checks.

### Usage

This detector is invoked by selecting "Compute-constrain difference"
(`llzk/compute-constrain-difference`) in the Detector selection during the tool configuration step.

## Example and Explanation

The `LessThanPower` circuit (from the [ed25519-circom][ed25519-link] repo) is designed to determine whether the input signal `in` is
less than or equal to $$2^{base}$$.
The circuit therefore sets `out = 1` if `in` $$\le 2^{base}$$ and `out = 0` otherwise.

<Tabs groupId="example">
<TabItem value="circom" label="Circom">

```circom title="compute_constrain_difference_bug.circom" showLineNumbers
pragma circom 2.0.0;

template LessThanPower(base) {
  signal input in;
  signal output out;

  out <-- 1 - ((in >> base) > 0);
  // highlight-next-line
  out * (out - 1) === 0;
}

component main = LessThanPower(2);
```

However, this code has a bug: `out` is only constrained to be binary (line 8) and is not
constrained by `in` or the `base` constant at all.
This allows a malicious actor to set `out` to be any value independent of `in` as
long as `out = 0` or `out = 1` (to satisfy the constraint on line 8).
For example, the signal assignment `in = 0, out = 0` would satisfy the constraints
in this circuit even though this assignment does not match the intended output
(i.e., if `in = 0`, `out` should be `1`).

This issue arises from the computation `out <-- 1 - ((in >> base) > 0)`, which is
a non-quadratic constraint and therefore cannot be directly used in a constraint
(e.g., with a `<==` constraint assignment).
This example demonstrates that special care must be taken when using non-quadratic assignments
to ensure that the signals involved are properly constrained.
These challenges demonstrate why the CCD detector can be a useful tool in flagging discrepancies
between separate constraints and assignments.

</TabItem>
<TabItem value="zirgen" label="Zirgen">

We've translated this example into Zirgen below.

```zirgen title="compute_constrain_difference_bug.zir" showLineNumbers
component Po2<n: Val>() {
  if (Isz(n)) {
    1
  } else {
    reduce for i : 0..n { 2 } init 1 with Mul;
  }
}

component LessThanPower<base: Val>(in: Reg) {
  po2 := Val(Po2<base>());
  public out := NondetReg(if (InRange(0, in, po2)) {
    1
  } else {
    0
  });
  // highlight-next-line
  out * (out - 1) = 0;
}
```

However, this code has a bug: `out` is only constrained to be binary (line 16) and is not
constrained by `in` or the `base` constant at all.
This allows a malicious actor to set `out` to be any value independent of `in` as
long as `out = 0` or `out = 1` (to satisfy the constraint on line 16).
For example, the signal assignment `in = 0, out = 0` would satisfy the constraints
in this circuit even though this assignment does not match the intended output
(i.e., if `in = 0`, `out` should be `1`).

This example demonstrates that special care must be taken when using `NondetReg`s
to ensure that the signals involved are properly constrained.
These challenges demonstrate why the CCD detector can be a useful tool in flagging discrepancies
between separate constraints and assignments.

</TabItem>
</Tabs>

## Usage Example

<Tabs groupId="example">
<TabItem value="circom" label="Circom">

:::info

Coming soon.

:::

</TabItem>
<TabItem value="zirgen" label="Zirgen">

:::info

Coming soon.

:::

</TabItem>
</Tabs>

## Limitations

The CCD detector only tracks what signals and constants a given signal is constrained by
for constraints that directly include the given signal. For example, if in the above example, if
`out` was constrained by intermediate signal `foo` and `foo` was constrained by `in`, the detector
would not show that `out` was constrained by `in`. This may lead to false positive alerts in some cases,
but in practice we find signals missing direct constraints to values used in their dataflow assignments
are often unconstrained even if they have a transitive constraint on the values, as the transitive constraints
are often not precise enough.

The CCD detector also only tracks the set of signals and constants in constraints and dataflow assignments, but
not the operations performed over those values (e.g., addition, multiplication). The detector
may therefore generate false negatives for assignments and constraints that contain the same values,
but perform different operations (e.g., `in + 7`, `in * 7` are treated as equivalent expressions).

## Assesing Severity

The severity of a compute-constrain difference depends heavily on whether
or not the involved signals have been properly constrained according to the design
of the circuit.
Assuming that the finding is not a false positive, then the consequences
can be severe, as the verifier may accept a proof with signal assignments outside of what is
intended, allowing malicious users to prove invalid statements.

[ed25519-link]: https://github.com/Electron-Labs/ed25519-circom/blob/c9435c021384a74009c0b2ec2a5e863b2190e63b/circuits/lt.circom#L5-L11