---
sidebar_position: 5
title: Unconstrained Subcomponent Inputs
description: Finds unconstrained subcomponent input signals.
detectorTypes:
- constrain-only
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Unconstrained Subcomponent Inputs (USCI) detector examines subcomponents used
by ZK circuit components to determine if any of their inputs are not
referenced in any of the containing component’s constraints.
Such missing constraints could be exploited by a malicious actor to create valid
proofs for unintended statements and incur serious consequences.

### Usage

The USCI detector is invoked by selecting "Unconstrained subcomponent input"
(`uc-subcmp-inputs`) in the Detector selection during the tool configuration step.

## Example and Explanation

The following Circom file contains the implementation of the `Diff` component,
which is designed to compute a positive difference between two inputs, `m` and `n`.
As the goal is to compute a positive and non-zero difference, the circuit is designed
to constrain `m > n`.
A very similar example is presented in the discussion of
the [unconstrained subcomponent outputs](./uc-subcmp-outputs.md) detector, but the
implementation of the `Diff` component differs slightly.

<details open>
<summary><b>uc_subcmp_input_bug.circom</b></summary>

```circom showLineNumbers
pragma circom 2.1.8;

// Inlined from circomlib/circuits/bitify.circom
template Num2Bits(n) {
  signal input in;
  signal output out[n];
  var lc1=0;

  var e2=1;
  for (var i = 0; i<n; i++) {
    out[i] <-- (in >> i) & 1;
    out[i] * (out[i] -1 ) === 0;
    lc1 += out[i] * e2;
    e2 = e2+e2;
  }

  lc1 === in;
}

// Inlined from circomlib/circuits/comparators.circom
template LessThan(n) {
  assert(n <= 252);
  signal input in[2];
  signal output out;

  component n2b = Num2Bits(n+1);

  n2b.in <== in[0]+ (1<<n) - in[1];
  for (var i = 0; i < n; i++) {
    n2b.out[i] * (n2b.out[i] - 1) === 0;
  }

  out <== 1-n2b.out[n];
}

template Diff() {
  // n must be less than m
  signal input n;
  signal input m;
  signal output o;

  component lt = LessThan(100);

  lt.in[0] <-- n; // Assigned but not constrained
  lt.in[1] <== m;

  lt.out === 1;
  o <== m - n;
}

component main = Diff();
```

</details>

To constrain `m` to be greater than `n`, the developer uses a subcomponent `LessThan` to test if `n` is less than `m`.
However, the first input of the `LessThan` component `lt` (`lt.in[0]`) is never constrained; it is just assigned the value of `n`.
So, the input could be any value (i.e., not constrained to `n`), as long as it is less than `m`.

A missing constraint on `lt.in[0]` means `n` is no longer properly constrained to be less than `m`.
A value assignment of `n = 100`, `m = 1`,
`o = 21888242871839275222246405745257275088548364400416034343698204186575808495518`
will satisfy the circuit’s constraints, yet produces an output outside the range the developer intended.
If `n < m`, the developer could expect `o < n` and `o < m`.

## Usage Example

<details open>
<summary>ZK Vanguard Output</summary>

Running the USCI detector yields the following text output log:

```txt showLineNumbers
----Running Vanguard with uc-subcmp-inputs detector----
Running detector: uc-subcmp-inputs
// highlight-next-line
[Critical] Unconstrained subcomponent input signal in component Diff @ uc_submp_input_bug.circom:36
Reported By: vanguard:uc-subcmp-inputs
Location: Diff @ uc_submp_input_bug.circom:36
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
Unconstrained subcomponent input signal in component Diff @ uc_submp_input_bug.circom:36
  * Signal  lt.in[0]
// highlight-end
```

</details>

Line 3 of the above log indicates that one of the subcomponent input signals
within `Diff` (defined on line 36 of `uc_submp_input_bug.circom`) is unconstrained.
Lines 9--10 indicate that the unconstrained subcomponent input signal is `lt.in[0]`.

## Limitations

This detector may incur false negatives if, for example, a subcomponent input
is constrained incorrectly (i.e., to the wrong value).

## How to Assess Severity

Unconstrained internal signals, such as unconstrained subcomponent inputs, can lead to underconstrained output signals (see [Underconstrained Outputs](./uc-outputs.md)), as they may be the missing constraint that decouples output and input signals.
These findings are therefore often severe.