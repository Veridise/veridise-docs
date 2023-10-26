---
sidebar_position: 6
title: Unused Subcomponents
description: Finds unused subcomponents in subcomponent arrays.
---

# Unused Subcomponents (`unused-subcmps`)

## Summary and Usage

The Unused Subcomponent (USC) detector detects if any elements in an array of subcomponents are declared, but never assigned any input or output signals by the containing component.
This may indicate some computation or safety checks are being erroneously omitted, which a malicious actor may be able to exploit.

### SaaS Usage

The USC detector is invoked by selecting "Unused subcomponents" (`unused-subcmps`) in the Detector selection during the tool configuration step.

<!-- ### Command-line Usage

The USC detector is invoked with the argument: `--detector unused-subcmps`. -->

## Example and Explanation

<details open>
<summary>Circom Example</summary>

```circom title="unused_subcmp_bug.circom"
pragma circom 2.0.0;

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

In this example, the developer intended for the `MultiDiff` component to return a difference between all elements of `inp_large` and `inp_small` without underflow, with `inp_small[0..N]` being smaller than `inp_large[0..N]`.
The developer means to use an array of `LessThan` subcomponent to test if `inp_small[i]` is less than `inp_large[i]` for all i in range `0..N`, but never actually initializes the subcomponent `lt[0]` and never checks the condition for `i = 0`.
A value assignment of `inp_small[0] = 100`, `inp_large[0] = 1`, `outp[0] = 21888242871839275222246405745257275088548364400416034343698204186575808495518` will therefore satisfy the circuit’s constraints, yet provides an output value outside the range that the developer intended (as if `inp_small[0] < inp_large[0]`, the developer can expect `outp[0] < inp_small[0]` and `outp[0] < inp_large[0]`).

<!-- <details>
<summary>ZK Vanguard Command-line Example</summary>

```shell title=Command
vanguard_driver --detector uc-subcmp-outputs uc_subcmp_output_bug.circom
```

</details> -->

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with unused-subcmps detector----
Running detector: unused-subcmps
====================================================================
 Vanguard's unused subcomponent detector found the following issue:
====================================================================
[WARNING] In template MultiDiff in unused_subcmp_bug.circom:34, Vanguard found an unused subcomponent:
  * Subcomponent lt[0] (type: LessThan)
```

</details>

## Severity Considerations

The USC detector only emits a warning because many correct circuits may leave subcomponents unused for correct circuits. Consider the following example:

```circom title=sum.circom
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
    for (var i = 1; i < n; i++) {
        // adds[0] is dead
        adds[i] = Add();
        adds[i].a <== last;
        adds[i].b <== inp[i];
        last = adds[i].o;
    }

    outp <== last;
}

component main = Sum(3);
```

Even though `adds[0]` is unused, the sum is still computed correctly (as for `n` numbers, only `n-1` additions must be performed).
The USC detector will still output a warning for this case, however, which can be viewed as a false positive:

```txt title="ZK Vanguard Output for sum.circom"
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with unused-subcmps detector----
Running detector: unused-subcmps
====================================================================
 Vanguard's unused subcomponent detector found the following issue:
====================================================================
[WARNING] In template Sum in sum.circom:9, Vanguard found an unused subcomponent:
  * Subcomponent adds[0] (type: Add)
```