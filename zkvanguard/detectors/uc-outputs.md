---
sidebar_position: 4
title: Under-Constrained Outputs
description: Finds under-constrained output signals.
---

# Under-Constrained Outputs (`uc-outputs`)

## Summary and Usage

The Under-Constrained Output (UCO) detector finds under-constrained output vulnerabilities in ZK circuit code.
The UCO detector looks to see if a used output from a component is
constrained either by an input value or a single constant value;
if neither is true, then the output is not constrained and can result in a vulnerability,
as a malicious actor may be able to create valid proofs for bogus statements when outputs are under-constrained.

### Usage

The UCO detector is invoked by selecting "Underconstrained outputs"
(`uc-outputs`) in the Detector selection during the tool configuration step.

## Example and Explanation

The following toy example is designed to determine if the lowest bit of the
input signal `inp` is 1. If `(inp & 1) = 1`, then `outp` should be 1, and otherwise, `outp` should be 0.

```circom title="uc_outputs_bug.circom" showLineNumbers
pragma circom 2.1.8;

template LowestBitIsOne() {
  signal input inp;
  signal output outp;

  // highlight-start
  outp <-- inp & 1;
  outp * (outp - 1) === 0;
  // highlight-end
}

component main = LowestBitIsOne();
```

In this example, `outp` is assigned to `inp & 1`, but is not constrained by the input `inp`, which is flagged as a UCO bug.
While the `outp * (outp - 1) === 0` constraint does constrain the `outp` signal to a boolean value per the overall design
of the circuit, the constraint may be satisfied by the assignment `outp = 0` or `outp = 1` _regardless_ of the value of `inp`, allowing the
attacker to forge arbtrary proofs of the form `{inp = <any value>, outp = <0 or 1>}`.

## Usage Example

Running the UCO detector yields the following text output log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
----Running Vanguard with uc-outputs detector----
Running detector: uc-outputs
// highlight-next-line
[Critical] Underconstrained output signal in component LowestBitIsOne @ uc_outputs_bug.circom:3
Reported By: vanguard:uc-outputs
Location: LowestBitIsOne @ uc_outputs_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
In template LowestBitIsOne @ uc_outputs_bug.circom:3
  * Signal outp
// highlight-end
```

Line 3 tells us there is an under-constrained output signal in the `LowestBitIsOne` template (defined in uc_outputs_bug.circom starting on line 3).
Lines 9--10 tell us that `outp` is the under-constrained output signal.

</details>

## Limitations

This detector may incur false positives if the output signal is designed to be
constant constrained, but that constant is computed within the circuit (e.g.,
the output signal is a hash of a constant value).
This detector also will fail to detect issues where, e.g., an output signal is
constrained by _an_ input, but should be constrained by multiple inputs.