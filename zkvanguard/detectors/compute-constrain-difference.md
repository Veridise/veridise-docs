---
sidebar_position: 1
title: Compute-Constrain Difference
description: Detects discrepancies between witness computation and constraint generation.
detectorTypes:
- compute-and-constrain
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Compute-Constrain Difference (CCD) detector flags signals
where the witness assignment (i.e., dataflow operations) uses
a different set of signals or constants than the set used
to constrain that signal.
These differences typically arise when witness computation and constraint generation
for a signal are performed separately (e.g., `<--` and `===` operations in Circom instead of
`<==`, or `NondetReg`s in Zirgen). This separation can lead to underconstrained or
improperly constrained signals.
These discrepancies may allow malicious actors to construct bogus proofs
and bypass application-level security checks.

### Usage

Select "Compute-Constrain Difference" in the "Required Detector Selection" section
of the ZK Vanguard Task Wizard.

:::info

This detector will report an error if run on an LLZK file where the witness generation
functions are empty, as this detector analyzes witness generation code in tandem
with the circuit's constraints.

:::

## Example and Explanation

The `LessThanPower` circuit (from the [ed25519-circom][ed25519-link] repo) is designed to determine whether the input signal `in` is
less than or equal to $$2^{base}$$.
The circuit therefore sets `out = 1` if `in` $$\le 2^{base}$$ and `out = 0` otherwise.

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
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
constrained by `in` or the `base` constant in any way.

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
*/}
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

For example, the assignment `in = 0, out = 0` satisfies the constraints,
even though the intended behavior is `out = 1` when `in = 0`.

This example demonstrates that special care must be taken when using `NondetReg`s
to ensure that the signals involved are properly constrained.
This illustrates why the CCD detector is useful: it flags discrepancies
between separate constraints and assignments that may otherwise go unnoticed.

</TabItem>
</Tabs>

## Usage Example

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

:::info

Coming soon.

:::

</TabItem>
*/}
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

## How to Assess Severity

The severity of a compute-constrain difference depends on whether the involved
signals are properly constrained according to the circuit's design.

If the finding is not a false positive (i.e., signals are underconstrained), the consequences can be severe:
the verifier may accept proofs with signal assignments outside the intended range,
allowing malicious users to prove invalid statements.

[ed25519-link]: https://github.com/Electron-Labs/ed25519-circom/blob/c9435c021384a74009c0b2ec2a5e863b2190e63b/circuits/lt.circom#L5-L11