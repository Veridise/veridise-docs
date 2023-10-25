---
sidebar_position: 4
---

## Unconstrained Subcomponent Output (`uc-subcomp`)

### Summary and Usage
The Unconstrained Component Output detector examines subcomponents used by ZK circuit components to determine if any outputs are unused or used but not referenced in any of the containing component’s constraints.
A malicious actor could exploit these missing constraints to create valid proofs for unintended statements and incur serious consequences.
It is invoked using the argument: `--detector=uc-subcomp`.

### Example and Explanation

```circom title="uc_subcomp_bug.circom"
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

In this example, the developer intended for the `Diff` component to return a difference between `m` and `n` without underflow, with `n` being smaller than `m`.
The developer uses a subcomponent `LessThan` to test of `n` is less than `m`, but the output of the `LessThan` component `lt` is never given a constraint; it is just assigned to `x`.
So, the output could be 1 or 0, meaning that n may or may not be less than m.
A value assignment of `n = 100`, `m = 1`, `o = 21888242871839275222246405745257275088548364400416034343698204186575808495518` will therefore satisfy the circuit’s constraints, yet provides an output value outside the range that the developer intended (as if `n < m`, the developer can expect `o < n` and `o < m`).

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=uc-subcomp uc_subcomp_bug.circom
```

```txt title=Output
TODO after uc-subcomp refactor.
```

</details>
