---
sidebar_position: 6
title: Unconstrained Subcomponent Output
description: Finds unconstrained subcomponent output signals.
---

# Unconstrained Subcomponent Output (`uc-subcmp-outputs`)

## Summary and Usage

The Unconstrained Subcomponent Output (USCO) detector examines subcomponents
used by ZK circuit components to determine if any of their outputs are unused or used
but not referenced in any of the containing component’s constraints.
A malicious actor could exploit these missing constraints to create valid
proofs for unintended statements and incur serious consequences.

### Usage

The USCO detector is invoked by selecting "Unconstrained subcomponent output"
(`uc-subcmp-outputs`) in the Detector selection during the tool configuration step.


## Example and Explanation

The following example circom file contains the implementation of the `Diff` component,
which is designed to compute a positive difference between two inputs, `m` and `n`.
As the goal is to compute a positive and non-zero difference, the circuit is designed
to constraint `m > n`. A very similar example is presented in the discussion of
the [unconstrained subcomponent inputs](./uc-subcmp-inputs.md) detector, but the
implementation of the `Diff` detector differs slightly.

<details open>
<summary><b>uc_subcmp_output_bug.circom</b></summary>

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
  signal output x;

  component lt = LessThan(100);

  lt.in[0] <== n;
  lt.in[1] <== m;

  x <-- lt.out; // Subcomponent output is not constrained.
  o <== m - n;
}

component main = Diff();
```

</details>


The developer uses a subcomponent `LessThan` to test if `n` is less than `m`,
but the output of the `LessThan` component `lt` (`lt.out`) is never given a constraint; it is just assigned to `x`.
So, the output could be 1 or 0, meaning that `n` may or may not be less than `m`.
A value assignment of `n = 100`, `m = 1`,
`o = 21888242871839275222246405745257275088548364400416034343698204186575808495518`
will therefore satisfy the circuit’s constraints, yet provides an output value
outside the range that the developer intended (as if `n < m`, the developer
can expect `o < n` and `o < m`).

## Usage Example

Running the UCSO detector yields the following text output log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Running Vanguard with uc-subcmp-outputs detector----
Running detector: uc-subcmp-outputs
// highlight-next-line
[Critical] Unconstrained subcomponent output signal in component Diff @ ./uc_subcmp_output_bug.circom:34
Reported By: vanguard:uc-subcmp-outputs
Location: Diff @ ./uc_subcmp_output_bug.circom:34
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
Unconstrained subcomponent output signal in component Diff @ ./uc_subcmp_output_bug.circom:34
  * Signal  lt.out
// highlight-end
```

</details>

Line 3 tells us that one of the subcomponent output signals within `Diff` (defined on line 36) is unconstrained.
Lines 9--10 tell us that the unconstrained subcomponent output signal is the `lt.out` signal.

## Limitations

- This detector may incur false positives for certain subcomponents that provide optional output
values. For example, the `Num2Bits` component can be used to check that its input is only `n` bits in
length without actually using the output signals.
- This detector may incur false negatives for checking the correctness of constraints;
the USCO detector can only determine if a subcomponent output is constrained at all, and not
if the constraint is semantically correct.

## Assessing Severity

Oftentimes, an unconstrained subcomponent output is indicative of a constraint being accidentally omitted,
which may lead to critical issues. Once an unconstraint subcomponent output is identified, the user should determine how the subcomponent output should be handled by the containing component; only if the usage of the output is optional can the finding be dismissed as benign.