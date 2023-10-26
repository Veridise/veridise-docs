---
sidebar_position: 7
title: zk-divide-by-zero
description: Finds potential divide-by-zero errors.
---

# Divide By Zero (`zk-divide-by-zero`)

## Summary and Usage

The Divide By Zero (DBZ) detector is used to identify potential divide-by-zero errors in ZK circuits.
Divide-by-zero errors can lead to significant security risks, as malicious actors may be able to create valid proofs for bogus statements.

### SaaS Usage

The NDW detector is invoked by selecting "Divide by zero" (`zk-divide-by-zero`) in the Detector selection during the tool configuration step.

<!-- ### Command-line Usage

The DBZ detector is invoked with the argument: `--detector zk-divide-by-zero`. -->

## Explanation and Example

The DBZ detector detects patterns of the following form:

```circom title="division_bug.circom"
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

<!-- <details>
<summary>ZK Vanguard Command-line Example</summary>

```shell
vanguard_driver --detector zk-divide-by-zero divide.circom
```


</details> -->

<details open>
<summary>ZK Vanguard Output</summary>


```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with zk-divide-by-zero detector----
Running detector: zk-divide-by-zero
=================================================================
 Vanguard's division by zero detector found the following issue:
=================================================================
[CRITICAL] In template Divide in division_bug.circom:3, Vanguard found a signal that could potentially cause a division by zero:
  * Signal in2 in division_bug.circom:7
```

</details>