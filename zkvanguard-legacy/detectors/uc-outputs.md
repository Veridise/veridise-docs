---
sidebar_position: 4
title: Underconstrained Outputs
description: Finds underconstrained output signals.
detectorTypes:
- constrain-only
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Underconstrained Output (UCO) detector identifies underconstrained output
vulnerabilities in ZK circuits where signals are not sufficiently constrained.
The UCO detector checks whether a component's output is constrained
by either an input signal or a constant value.
If neither condition holds, the output is underconstrained, creating a vulnerability
that may allow malicious actors to generate valid proofs for bogus statements.

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

In this example, `outp` is assigned to `inp & 1`, but its value is not explicitly tied
to `inp` in any constraint.
This is why the detector flags it as a UCO issue.
While the constraint `outp * (outp - 1) === 0` ensures that `outp` is boolean,
it can be satisfied by either `outp = 0` or `outp = 1` regardless of the actual value of `inp`.
This allows an attacker to forge arbitrary proofs of the form `{inp = <any value>, outp = <0 or 1>}`.

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

Line 3 of the above log tells us there is an underconstrained output signal in the `LowestBitIsOne` template (defined in `uc_outputs_bug.circom` starting on line 3).
Lines 9--10 of the log tell us that `outp` is the underconstrained output signal.

</details>

## Limitations

- This detector may produce false positives if an output is intended to be constant-constrained,
  but the constant is computed within the circuit (e.g., the output is a hash of a fixed value).
- This detector will miss cases where an output is constrained by *some* inputs,
  but should actually be constrained by multiple inputs.

## How to Assess Severity

Findings from the UCO detector are generally considered severe.
It is rare for output signals not to be derived from input signals or constants,
so underconstrained outputs usually indicate that key computations or constraints
have been accidentally omitted.
These findings are therefore highly likely to represent critical issues.

