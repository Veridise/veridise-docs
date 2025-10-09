---
sidebar_position: 7
title: Unused Subcomponents
description: Finds unused subcomponents in subcomponent arrays.
detectorTypes:
- compute-constrain
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Unused Subcomponent (USC) detector identifies elements in an array of subcomponents that are declared
but never assigned input or output signals by the containing component.
Such omissions may indicate missing computations or safety checks that could be exploited by a malicious actor.

### Usage

The USC detector is invoked by selecting "Unused subcomponents"
(`unused-subcmps`) in the Detector selection during the tool configuration step.

## Example and Explanation

In the following example, similar the two examples in the [unconstrained subcomponent inputs](./uc-subcmp-inputs.md) and
[unconstrained subcomponent outputs](./uc-subcmp-outputs.md) detectors, the developer is
computing the positive difference between inputs. However, unlike the previous
two examples, the `MultiDiff` circuit computes the pairwise difference between
elements in the `inp_large` and `inp_small` array, with the differences being output
in the `outp` array. Since the circuit is designed to output a positive difference,
each pair of elements in the input is expected to satisfy:

$$
\forall_{i \in [0, n)}\, \text{inp\_large[i]} > \text{inp\_small[i]}
$$

<details open>
<summary>Circom Example</summary>

```circom title="unused_subcmps_bug.circom" showLineNumbers
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

template MultiDiff(N) {
  signal input inp_small[N];
  signal input inp_large[N];
  signal output outp[N];

  component lt[N];
  // Bug: `lt[0]` is never initialized since `i` starts at 1
  for (var i = 1; i < N; i++) {
    lt[i] = LessThan(252);
    lt[i].in[0] <== inp_small[i];
    lt[i].in[1] <== inp_large[i];
    lt[i].out === 1;
  }

  for (var i = 0; i < N; i++) {
    outp[i] <== inp_large[i] - inp_small[i];
  }
}

component main = MultiDiff(3);
```

</details>

A correct implementation should initialize all `lt` subcomponents from `i = 0`, but here `lt[0]` is never initialized and the condition for `i = 0` is never checked.
A value assignment of `inp_small[0] = 100`, `inp_large[0] = 1`, `outp[0] = 21888242871839275222246405745257275088548364400416034343698204186575808495518` will satisfy the circuit’s constraints, yet produces an output outside the intended range, as if `inp_small[0] < inp_large[0]`, the developer would expect `outp[0] < inp_small[0]` and `outp[0] < inp_large[0]`.

## Usage Example

Running the USC detector yields the following text output log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
----Running Vanguard with unused-subcmps detector----
Running detector: unused-subcmps
// highlight-next-line
[Warning] Unused subcomponent in component MultiDiff @ unused_subcmps_bug.circom:36
Reported By: vanguard:unused-subcmps
Location: MultiDiff @ unused_subcmps_bug.circom:36
Confidence: 1
More Info: placeholder
Details:
// highlight-start
In template MultiDiff @ unused_subcmps_bug.circom:36
  * Subcomponent lt[0] (type: LessThan @ unused_subcmps_bug.circom:21 )
// highlight-end
```

</details>

Line 3 of the above log tells us that there is an unused subcomponent
within the `MultiDiff` component (which is defined on line 36 of `unused_subcmps_bug.circom`).
Lines 9--10 of the log tell us that the unused subcomponent is the
first element of the `lt` array (`lt[0]`), which is an unused subcomponent of type `LessThan`.

## Limitations

The USC detector only emits a warning because many correct circuits may leave subcomponents unused for correct circuits.
Consider the following example circuit, which is designed to compute the sum of all `n` inputs:

```circom title="sum.circom" showLineNumbers
pragma circom 2.1.8;

template Add() {
  signal input a;
  signal input b;
  signal output o;

  o <== a + b;
}

template Sum(n) {
  signal input inp[n];
  signal output outp;

  component adds[n];
  var last = inp[0];
  // highlight-next-line
  for (var i = 1; i < n; i++) {
    // adds[0] will not be initialized in this loop
    adds[i] = Add();
    adds[i].a <== last;
    adds[i].b <== inp[i];
    last = adds[i].o;
  }

  outp <== last;
}

component main = Sum(3);
```

Even though `adds[0]` is unused, the sum is still computed correctly (for `n` numbers, only `n-1` additions must be performed).
The USC detector will still output a warning in this case, which is a false positive.

## How to Assess Severity

If unused subcomponents are unintentional, they indicate severe computational
or constraint-generation errors that could allow malicious actors to create valid proofs for unintended statements.
Manual analysis should confirm whether the subcomponent is correctly left unused.
