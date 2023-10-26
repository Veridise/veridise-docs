---
sidebar_position: 2
title: Non-Deterministic Witness
description: Detects non-deterministic witness computations.
---

# Non-Deterministic Witness (`non-det-wit`)

## Summary and Usage

The Non-Deterministic Witness (NDW) detector warns the user about non-deterministic witness code (i.e., dataflow operations) in their ZK circuit, which occurs when dataflow is dependent on conditional branches or conditional assignments.
Conditional assignments are difficult to properly constrain and likely to lead to unconstrained values, which can lead to significant security risks as unconstrained values could allow for the construction of bogus proofs.

### SaaS Usage

The NDW detector is invoked by selecting "Nondeterministic dataflow" (`non-det-wit`) in the Detector selection during the tool configuration step.

<!-- ### Command-line Usage

The NDW detector is invoked with the argument: `--detector non-det-wit`. -->

## Example and Explanation

```circom title="nondet_example.circom" showLineNumbers
pragma circom 2.0.0;

template Invert() {
    signal input in;
    signal output out;

    out <-- in != 0 ? 1 / in : 0;

    in*out === 0;
}

component main = Invert();
```

In this example, `out` is conditionally assigned based on the value of `in`. The developer’s intent is for `out = 1/in` if `in` is not 0, and `out = 0` otherwise. However, this constraint is not specified, so if `in = 0`, any value of `out` could be provided without violating `in*out === 0`.
So, if `in = 0`, `out = 0` is expected by the developer, but the assignment of `in = 0, out = 99` would also satisfy the constraints.

## Usage Example

<!-- <details>
<summary>ZK Vanguard Command-line Example</summary>

```shell title=Command
vanguard_driver --detector non-det-wit nondet_example.circom
```

</details> -->

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with non-det-wit detector----
Running detector: non-det-wit
==========================================================================
 Vanguard's non-deterministic witness detector found the following issue:
==========================================================================
[CRITICAL] In template Invert in nondet_example.circom:3, Vanguard found a signal used inside a conditional:
  * Signal in in nondet_example.circom:7
```

</details>
