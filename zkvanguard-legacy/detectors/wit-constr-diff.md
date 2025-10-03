---
sidebar_position: 8
title: Witness-Constraints Difference
description: Detects discrepancies between witness computation and constraint generation.
detectorTypes:
- compute-constrain
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Witness-Constraints Difference (WCD) detector warns the user about signals
where the assignment of a given signal in the witness (i.e., in dataflow operations) contain
a different set of signals and/or constant values than are contained in the set of
signals and/or constant values that constrain the given signal.
Such differences occur when witness computation and constraint generation for a given
signal are performed separately (i.e., with `<--` and `===` operations in Circom instead of
`<==` operations), and these differences can lead to underconstrained or improperly constrained signals.
Such discrepancies may allow malicious actors to construct bogus proofs and subvert the application's security checks.

### Usage

The WCD detector is invoked by selecting "Witness & constraints difference"
(`wit-constr-diff`) in the Detector selection during the tool configuration step.

## Example and Explanation

The `LessThanPower` circuit (from the [ed25519-circom][ed25519-link] repo) is designed to determine whether the input signal `in` is
less than or equal to $$2^{base}$$.
The circuit therefore sets `out = 1` if `in` $$\le 2^{base}$$ and `out = 0` otherwise.

```circom title="wit_constr_diff_bug.circom" showLineNumbers
pragma circom 2.0.0;

template LessThanPower(base) {
  signal input in;
  signal output out;

  out <-- 1 - ((in >> base) > 0);
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
These challenges demonstrate why the WCD detector can be a useful tool in flagging discrepancies
between separate constraints and assignments.


## Usage Example

Running the above example circuit in ZK Vanguard using the `wit-constr-diff` detector yields
the following output text log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
Running detector: wit-constr-diff
[Warning] Signal out in component LessThanPower @ wit_constr_diff_bug.circom:3 witness generation deviates from its associated constraints
Reported By: vanguard:wit-constr-diff
Location: LessThanPower
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
Signal out in component LessThanPower @ wit_constr_diff_bug.circom:3 witness generation deviates from its associated constraints
  * Signal found only in dataflow
    * Signal in
  * Constant found only in dataflow
    * Constant 2
// highlight-end
```

</details>

Line 3 of the above log tells us that the WCD detector has found a signal that has differing dataflow and constraint operations.
Lines 8--11 of the above log tell us that the output signal `out` appears in a dataflow operation with input signal `in` and the constant `base = 2`, but
that `out` is not constrained by either of these values.
This finding tells us we need to update the component to properly constrain output signal `out`.

## Limitations

The WCD detector only tracks what signals and constants a given signal is constrained by
for constraints that directly include the given signal. For example, if in the above example, if
`out` was constrained by intermediate signal `foo` and `foo` was constrained by `in`, the detector
would not show that `out` was constrained by `in`. This may lead to false positive alerts in some cases,
but in practice we find signals missing direct constraints to values used in their dataflow assignments
are often unconstrained even if they have a transitive constraint on the values, as the transitive constraints
are often not precise enough.

The WCD detector also only tracks the set of signals and constants in constraints and dataflow assignments, but
not the operations performed over those values (e.g., addition, multiplication). The detector
may therefore generate false negatives for assignments and constraints that contain the same values,
but perform different operations (e.g., `out <-- in + 7`, `out === in * 7` will not be flagged).

## Assesing Severity

The severity of a witness-constraint difference depends heavily on whether
or not the involved signals have been properly constrained according to the design
of the circuit.
Assuming that the finding is not a false positive, then the consequences
can be severe, as the verifier may accept a proof with signal assignments outside of what is
intended, allowing malicious users to prove invalid statements.

[ed25519-link]: https://github.com/Electron-Labs/ed25519-circom/blob/c9435c021384a74009c0b2ec2a5e863b2190e63b/circuits/lt.circom#L5-L11