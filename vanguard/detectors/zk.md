---
sidebar_position: 2
---

# ZK Domain Detectors

These detectors are used to find vulnerabilities in Zero-Knowledge (ZK) circuits, e.g. circuits written in Circom.

## Dataflow Constraint Difference (`df-constr-diff`)

### Summary and Usage
The Dataflow-Constraint Discrepancy (DCD) detector finds discrepancies between the dataflow graph and constraint graph of a ZK circuit.
Such discrepancies can result in significant security risks, as malicious actors may be able to create valid proofs for bogus statements due to the mismatch between the constraints and actual computation.
The DCD detector is invoked with the argument: `--detector=df-constr-diff`.

### Example and Explanation

```circom title="constraint_diff.circom"
pragma circom 2.0.0;

template Increment() {
  signal input a;
  signal input b;
  signal output out;
  out <-- a + 1;
  out === b + 1;
}

component main = Increment();
```

In this example, out is assigned `a + 1`, but is constrained on `b + 1`.
This means that out is dataflow dependent on input `a` but constraint dependent on input `b`.
This discrepancy in dataflow and constraint dependencies means there is a mismatch in the overall dataflow and constraint graphs in the circuit, which likely deviates from the developer’s intentions.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=df-constr-diff constraint_diff.circom
```

```txt title=Output
----VANGUARD REPORT----
Running detector: df-constr-diff
========================
 1 DCD signal detected:
========================
A potential DCD in Increment is caused by:
--------------------------------------------------------------------------------
  * Signals: a and out
--------------------------------------------------------------------------------

 --- call.fr_add
 ---
 ---
 --- call.fr_add
 ---
call.fr_add --- call.fr_add
 ---
 ---
 ---
 ---
 ---
 ---
 ---
```

</details>

## Non-Deterministic Dataflow (`df-nondet`)

### Summary and Usage

The Non-Deterministic Dataflow (NDD) detector warns the user about non-deterministic dataflow in their ZK circuit, which occurs when dataflow is dependent on conditional branches. Conditional assignments are difficult to properly constrain and likely to lead to unconstrained values, which can lead to significant security risks as unconstrained values could allow for the construction of bogus proofs.
The NDD detector is invoked with the argument: `--detector=df-nondet`.

### Explanation and Example

```circom title="nondet.circom"
pragma circom 2.0.0;

template Invert() {
    signal input in;
    signal output out;

    out <-- in != 0 ? 1 / in : 0;

    in*out === 0;
}

component main = Invert();
```

In this example, `out` is conditionally assigned based on the value of `in`. The developer’s intent is for `out = 1/in` if `in` is not 0, and `out = 0` otherwise. However, this constraint is not specified, so if `in = 0`, any value of `out` could be provided without violating `in*out === 0`. So, if `in = 0`, `out = 0` is expected by the developer, but the assignment of `in = 0, out = 99` would also satisfy the constraints.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=df-nondet nondet.circom
```

```txt title=Output
----VANGUARD REPORT----
Running detector: df-nondet
========================
 1 NDD signal detected:
========================
A potential NDD in Invert is caused by:
--------------------------------------------------------------------------------
  * Signal: in
--------------------------------------------------------------------------------
```

</details>

## Unconstrained Outputs (`uc-outputs`)

### Summary and Usage

The Unconstrained Output (UCO) detector finds unconstrained output vulnerabilities in ZK circuit code.
The UCO detector looks to see if a used output from a component is constrained either by an input value or a constant value---if neither is true, then the output is not constrained and can result in a vulnerability, as a malicious actor may be able to create valid proofs for bogus statements when outputs are unconstrained.
The UCO detector can be invoked with the argument: `--detector=uc-outputs`.

### Example and Explanation

```circom title="uco_bug.circom"
pragma circom 2.0.0;

template UCO_Bug() {
  signal input a;
  signal input b;
  signal output out1;
  signal output out2;

  out1 <== a + b;
  out2 <-- a;
  out2 * (out2 - 1) === 0;
}

component main = UCO_Bug();
```

In this example, `out2` is assigned to input `a`, but is not constrained by the input `a`, which is flagged as a UCO bug.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=uc-outputs uco_bug.circom
```

```txt title=Output
----VANGUARD REPORT----
Running detector: uc-outputs
=============================================
 1 Under-constrained output signal detected:
=============================================
A potential under-constrained output signal in UCO_Bug is caused by:
--------------------------------------------------------------------------------
  * Signals: out2
--------------------------------------------------------------------------------
```

</details>

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

## Divide By Zero (`zk-divide-by-zero`)

### Summary and Usage

The Divide By Zero (DBZ) detector is used to identify potential divide-by-zero errors in ZK circuits.
Divide-by-zero errors can lead to significant security risks, as malicious actors may be able to create valid proofs for bogus statements.
The DBZ detector is invoked by providing Vanguard with the argument: `--detector=zk-divide-by-zero`.

### Explanation and Example

The DBZ detector detects patterns of the following form:

```circom title="divide.circom"
pragma circom 2.0.0;

template Divide() {
    signal input in1;
    signal input in2;
    signal output out;
    out <-- in1 / in2;
    out * in2 === in1;
}

component main = Divide();
```

In this example, the constraints of the circuit can be satisfied by the following assignment: `in1 = 0, in2 = 0, out = 5`. However, this clearly deviates from the developer’s intention, which was for `out` to be set to `in1 / in2`.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Command
vanguard_driver --detector=zk-divide-by-zero divide.circom
```

```txt title=Output
----VANGUARD REPORT----
Running detector: zk-divide-by-zero
========================
 1 DBZ signal detected:
========================
A potential DBZ in Divide is caused by:
--------------------------------------------------------------------------------
  * Signal: in2
--------------------------------------------------------------------------------
```

</details>