---
sidebar_position: 2
title:  Out-Of-Range Signals
description: Finds signals that may be assigned a value outside of their desired range.
---

# Out-Of-Range Signals

## Summary and Usage

The Unconstrained Subcomponent Inputs (USCI) detector examines subcomponents used
by ZK circuit components to determine if any of their inputs are not
referenced in any of the containing component’s constraints.
A malicious actor could exploit these missing constraints to create valid
proofs for unintended statements and incur serious consequences.

The Out-Of-Range Signals detector examines patterns of computation/constraint
generation to estimate what **should** be the ranges of IR values.
These "presumed" ranges are then compared against the ranges determined by LLZK's interval analysis (which are the allowed
ranges of values based on constraints and assertions in the IR).
If the "presumed" range is
narrowed than the allowed range, then it is possible for a value to become "out-of-range", which
may lead to bugs or vulnerabilities.
These cases are what generate findings from this detector.

### Usage

The OORS detector is invoked by selecting "Out-of-range signals"
(`llxk/out-of-range-signals`) in the Detector selection during the tool configuration step.

#### Configuration Options

:::info TODO

This section will be populated once per-detector configuration is enabled in AuditHub.

:::

## Example and Explanation

The following example circom file contains the implementation of the `Diff` component,
which is designed to compute a positive difference between two inputs, `m` and `n`.
As the goal is to compute a positive and non-zero difference, the circuit is designed
to constraint `m > n`.
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
However, the first input of the `LessThan` component `lt` (`lt.in[0]`) is never given a constraint; it is just assigned to be `n`.
So, the input could be any value (i.e., not constrained to `n`), as long as it is less than `m`.

With this missing constraint, `n` is no longer constrained to be less than `m`.
A value assignment of `n = 100`, `m = 1`,
`o = 21888242871839275222246405745257275088548364400416034343698204186575808495518`
will therefore satisfy the circuit’s constraints, yet provides an output value
outside the range that the developer intended (as if `n < m`, the developer
can expect `o < n` and `o < m`).

## Usage Example

:::info TODO

This section will be populated after ZK Vanguard lands in AuditHub.

:::

## Limitations

- This detector uses LLZK's intraprocedural range analysis to determine if a divisor
value may be 0. Any inaccuracies caused by this analysis (e.g., if a divisor is
constrained to be non-zero via a separate function call) may cause false
positives in this detector's findings.

## Assessing Severity

Unconstrained internal signals, such as unconstrained subcomponent inputs, can lead to underconstrained output signals (see the [Underconstrained Outputs](./uc-outputs.md)), as they can be the missing constraint that decouples output and input signals in constraints.
These findings are therefore often quite severe.
