---
sidebar_position: 6
title: zk-divide-by-zero
---

# Divide By Zero (`zk-divide-by-zero`)

## Summary and Usage

The Divide By Zero (DBZ) detector is used to identify potential divide-by-zero errors in ZK circuits.
Divide-by-zero errors can lead to significant security risks, as malicious actors may be able to create valid proofs for bogus statements.
The DBZ detector is invoked by providing Vanguard with the argument: `--detector=zk-divide-by-zero`.

## Explanation and Example

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