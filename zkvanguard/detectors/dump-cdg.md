---
sidebar_position: 1
title: dump-cdg
---

# Constraint-Dataflow Graph Generator (`dump-cdg`)

## Summary and Usage
The Constraint-Dataflow Graph Generator is not a bug detector, but rather an analysis pass that generates Constraint-Dataflow Graph

 finds discrepancies between the dataflow graph and constraint graph of a ZK circuit.
Such discrepancies can result in significant security risks, as malicious actors may be able to create valid proofs for bogus statements due to the mismatch between the constraints and actual computation.

### Usage Instructions

#### Command-line Usage
The CDG generator is invoked on the command-line with the argument `--detector dump-cdg -o <desired output directory>`.
The CDG generator will then create a file `<desired output directory>/artifacts/constraint-dataflow-graph.dot`, which contains the CDG
as a GraphViz file

#### SaaS Usage
When using the CDG generator on SaaS, add "Dump CDG" (`dump-cdg`).

## Example Usage

```circom title="cdg_example.circom"
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
<summary>ZK Vanguard Command-line and Output</summary>

```shell title=Command
vanguard_driver --detector dump-cdg constraint_diff.circom
```

```txt title=Output
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with dump-cdg detector----
Running detector: dump-cdg
==

==

```

</details>

<details>
<summary>ZK Vanguard SaaS Output</summary>

```shell title=Command
vanguard_driver --detector dump-cdg constraint_diff.circom
```

```txt title=Output
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with dump-cdg detector----
Running detector: dump-cdg
==

==

```

</details>