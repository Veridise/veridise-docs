---
sidebar_position: 5
title: uc-subcmp-outputs
description: Finds under-constrained subcomponent output signals.
---

# Under-Constrained Subcomponent Output (`uc-subcmp-outputs`)

## Summary and Usage

The Unconstrained Component Output (USCO) detector examines subcomponents used by ZK circuit components to determine if any outputs are unused or used but not referenced in any of the containing component’s constraints.
A malicious actor could exploit these missing constraints to create valid proofs for unintended statements and incur serious consequences.

### SaaS Usage

The NDW detector is invoked by selecting "Under-constrained subcomponent outputs" (`uc-subcmp-outputs`) in the Detector selection during the tool configuration step.

### Command-line Usage

The NDW detector is invoked with the argument: `--detector uc-subcmp-outputs`.

## Example and Explanation

<details open>
<summary>Circom Example</summary>

```circom title="uc_subcmp_output_bug.circom"
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

template Diff() {
    // n must be less than m
    signal input n;
    signal input m;
    signal output o;
    signal output x;

    component lt = LessThan(100);

    lt.in[0] <== n;
    lt.in[1] <== m;

    x <-- lt.out;
    o <== m - n;
}

component main = Diff();
```

</details>

In this example, the developer intended for the `Diff` component to return a difference between `m` and `n` without underflow, with `n` being smaller than `m`.
The developer uses a subcomponent `LessThan` to test if `n` is less than `m`, but the output of the `LessThan` component `lt` is never given a constraint; it is just assigned to `x`.
So, the output could be 1 or 0, meaning that n may or may not be less than m.
A value assignment of `n = 100`, `m = 1`, `o = 21888242871839275222246405745257275088548364400416034343698204186575808495518` will therefore satisfy the circuit’s constraints, yet provides an output value outside the range that the developer intended (as if `n < m`, the developer can expect `o < n` and `o < m`).

<details>
<summary>ZK Vanguard Command-line Example</summary>

```shell title=Command
vanguard_driver --detector uc-subcmp-outputs uc_subcmp_output_bug.circom
```

</details>

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with uc-subcmp-outputs detector----
Running detector: uc-subcmp-outputs
==========================================================================================
 Vanguard's unconstrained subcomponent output signals detector found the following issue:
==========================================================================================
[CRITICAL] In template Diff in uc_subcmp_output_bug.circom:34, Vanguard found a subcomponent output signal that is unconstrained:
  * Signal lt.out in uc_subcmp_output_bug.circom:46
```

</details>
