---
sidebar_position: 7
title: Unused Subcomponents
description: Finds unused subcomponents in subcomponent arrays.
---

# Unused Subcomponents (`unused-subcmps`)

## Summary and Usage

The Unused Subcomponent (USC) detector detects if any elements in an array of
subcomponents are declared, but never assigned any input or output signals by the containing component.
This may indicate some computation or safety checks are being erroneously omitted, which a malicious actor may be able to exploit.

### Usage

The USC detector is invoked by selecting "Unused subcomponents"
(`unused-subcmps`) in the Detector selection during the tool configuration step.


## Example and Explanation

In the following example, the developer is
computing the positive difference between inputs. However, unlike the previous
two examples, the `MultiDiff` circuit is computing the pairwise difference between
elements in the `inp_large` and `inp_small` array, with the differences being output
in the `outp` array. Since the circuit is designed to output a positive difference,
each pair of elements in the input is constrained such that:

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
  // Bug: should be `var i = 0`!
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

To enforce this property, the developer means to use an array of `LessThan` subcomponent to test if `inp_small[i]` is less than `inp_large[i]` for all i in range $[0,n)$, but never initializes the subcomponent `lt[0]` and therefore never checks the condition for `i = 0`.
A value assignment of `inp_small[0] = 100`, `inp_large[0] = 1`, `outp[0] = 21888242871839275222246405745257275088548364400416034343698204186575808495518` will therefore satisfy the circuit’s constraints, yet provides an output value outside the range that the developer intended (as if `inp_small[0] < inp_large[0]`, the developer can expect `outp[0] < inp_small[0]` and `outp[0] < inp_large[0]`).

## Usage Example

:::info TODO

This section will be populated after ZK Vanguard lands in AuditHub.

:::

## Limitations

The

## Assessing Severity

Unused subcomponents, if unintentional, are indicative of severe computational errors or constraint
generation errors that may allow malicious actors to create valid proofs for bogus statements.
Manual analysis should be performed to determine if the subcomponent is correctly left unused.
