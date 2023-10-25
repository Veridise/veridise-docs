---
sidebar_position: 4
---

## Unused Subcomponents (`unused-subcmps`)

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

