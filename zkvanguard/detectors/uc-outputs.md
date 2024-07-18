---
sidebar_position: 4
title: Under-Constrained Outputs
description: Finds under-constrained output signals.
---

# Under-Constrained Outputs (`uc-outputs`)

## Summary and Usage

The Under-Constrained Output (UCO) detector finds under-constrained output vulnerabilities in ZK circuit code.
The UCO detector looks to see if a used output from a component is constrained either by an input value or a single constant value; if neither is true, then the output is not constrained and can result in a vulnerability, as a malicious actor may be able to create valid proofs for bogus statements when outputs are under-constrained.

### Usage

The UCO detector is invoked by selecting "Underconstrained outputs"
(`uc-outputs`) in the Detector selection during the tool configuration step.

## Example and Explanation

```circom title="uc_outputs_bug.circom" showLineNumbers
pragma circom 2.0.0;

template LowestBitIsOne() {
  signal input inp;
  signal output outp;

  outp <-- inp & 1;
  outp * (outp - 1) === 0;
}

component main = LowestBitIsOne();
```

In this example, `outp` is assigned to `inp & 1`, but is not constrained by the input `inp`, which is flagged as a UCO bug.
The constraint `outp * (outp - 1) === 0` may be satisfied by the assignment `outp = 0` or `outp = 1` regardless of the value of `inp`, allowing the
attacker to forge arbtrary proofs of the form `{inp = <any value>, outp = <0 or 1>}`.

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Running Vanguard with uc-outputs detector----
Running detector: uc-outputs
[Critical] Underconstrained output signal in component LowestBitIsOne @ ../veridise-docs/example_circuits/uc_outputs_bug.circom:3
Reported By: vanguard:uc-outputs
Location: LowestBitIsOne @ ../veridise-docs/example_circuits/uc_outputs_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
In template LowestBitIsOne @ ../veridise-docs/example_circuits/uc_outputs_bug.circom:3
  * Signal outp
```

</details>
