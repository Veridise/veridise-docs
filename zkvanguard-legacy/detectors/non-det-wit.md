---
sidebar_position: 1
title: Non-Deterministic Witness
description: Detects non-deterministic witness computations.
detectorTypes:
- compute-only
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

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

The following circuit is designed to determine whether the input `in` is 0 or not:
- If `in = 0`, then `out = 1`.
- For any other value of `in` (`in != 0`), then `out = 0`.

```circom title="non_det_wit_bug.circom" showLineNumbers
pragma circom 2.0.0;

template IsZero() {
  signal input in;
  signal output out;

  signal inv;

  // highlight-next-line
  inv <-- in!=0 ? 1/in : 0; // conditional expression in inv assignment

  out <== -in*inv +1;
}

component main = IsZero();
```

To implement this functionality, the circuit first computes the inverse `inv`
of the input `in`, but uses a conditional assignment such that `inv` will be 0
if `in` is 0, with `inv = 1/in` otherwise (line 9).

With this conditional assignment, `-in*inv` should be:
- `-1 (mod p)` if `in` is non-zero
- `0` if `in = 0`
Thus, the computation `out <== -in*inv + 1` yields:
- `1` if `in = 0`
- `0` if `in` is non-zero

However, this code contains a bug: there is no constraint enforcing that `out` is boolean (0 or 1).
The boolean nature of `out` is assumed from `inv` being the inverse of `in`, which is **not**
enforced due to the conditional assignment.
A malicious actor could assign `inv` any value,
as long as `out <== -in*inv + 1` holds.
For example, `in = 1`, `inv = -1 (mod p)`, `out = 2` satisfies constraints but violates intended behavior.
This demonstrates that conditional assignments often require additional and nuanced constraints.
The NDW detector is valuable for flagging such conditional logic for review.

:::note

This example is adapted from the `IsZero` circuit provided by [circomlib][circomlib] (found in [comparators.circom][iszero-snippet]).
Unlike our above example, circomlib's version is properly constrained:

```circom title="IsZero circuit from circomlib. The constraint missing from our example above is highlighted." showLineNumbers
template IsZero() {
  signal input in;
  signal output out;


  signal inv;


  inv <-- in!=0 ? 1/in : 0;


  out <== -in*inv +1;
  // highlight-next-line
  in*out === 0;
}
```

The addition of the `in*out === 0` constraint on line 13 fixes the issue pointed out in
our example, as it forces one of `in` and `out` to be 0.
:::

## Usage Example

Running the above example circuit in ZK Vanguard using the `non-det-wit` detector yields
the following output text log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
----Running Vanguard with non-det-wit detector----
Running detector: non-det-wit
// highlight-next-line
[Critical] Found signal in component that are used in conditional expressions IsZero @ non_det_wit_bug.circom:3
Reported By: vanguard:non-det-wit
Location: IsZero @ non_det_wit_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
Found signal in component that are used in conditional expressions IsZero @ non_det_wit_bug.circom:3
  * Signal  in in expression IsZero @ non_det_wit_bug.circom:9
// highlight-end
```

</details>

Line 3 of the above log tells us that the NDW detector has found a signal that is used in a conditional expression.
Lines 9--10 of the above log tell us that the input signal `in` is being used in a conditional expression on
line 9 of `non_det_wit_bug.circom`, which is the assignment `inv <-- in!=0 ? 1/in : 0`.
This finding tells us we need to confirm that `inv` and `in` are sufficiently constrained
given the conditional assignment.

[circomlib]: https://github.com/iden3/circomlib
[iszero-snippet]: https://github.com/iden3/circomlib/blob/cff5ab6288b55ef23602221694a6a38a0239dcc0/circuits/comparators.circom#L24-L34

## Limitations

The NDW detector flags conditional expressions and the signals used in those conditional expressions,
but is unable to determine if the conditional expressions are properly constrained or not,
as this requires knowledge of what the design goal of the circuit is.
For example, the NDW detector would still report the same issue for circomlib's `IsZero` circuit, even
though it is properly constrained.

## How to Assess Severity

The severity of a non-deterministic witness computation depends on whether
the involved signals are properly constrained.
If a finding is not a false positive,
it may have severe consequences, allowing invalid proofs to be accepted.
