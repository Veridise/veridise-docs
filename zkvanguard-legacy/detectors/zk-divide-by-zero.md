---
sidebar_position: 9
title: (ZK) Divide By Zero
description: Finds potential divide-by-zero errors.
detectorTypes:
- compute-only
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Divide By Zero (DBZ) detector is used to identify potential divide-by-zero errors in ZK circuits.
Divide-by-zero errors can lead to significant security risks, as malicious actors may be able to create valid proofs for bogus statements.

### Usage

The DBZ detector is invoked by selecting "Divide by zero (ZK)"
(`zk-divide-by-zero`) in the Detector selection during the tool configuration step.

## Example and Explanation

In the following example, the `Divide` circuit has been developed to compute the
`quotient` of `dividend` divided by `divisor`.
In finite prime field arithmetic, as is performed in circom (i.e., all operations performed modulo the prime $p$),
division is implemented as multiplication by the inverse of the divisor,
Formally, this computation is:

$$
a / b \, \text{(mod p)} \equiv a * b^{-1} \, \text{(mod p), where } b * b^{-1} \, \text{(mod p)} = 1
$$

```circom title="division_bug.circom"
pragma circom 2.1.8;

template Divide() {
  signal input dividend;
  signal input divisor;
  signal output quotient;
  quotient <-- dividend / divisor;
  quotient * divisor === dividend;
}

component main = Divide();
```

The intended behavior of this circuit is for `quotient` to be set to `dividend / divisor`.
This performed by first assigning `quotient <-- dividend / divisor`, then generating the constraint
of `quotient * divisor === dividend` (which is done because constraints cannot contain division operations,
as they result in non-quadratic constraints).
However, this constraint does not enforce the requirement that `divisor` cannot be
0 in order for `dividend / divisor` to be a valid operation; in other words, the developer
did not intend for 0 to be a valid assignment for `divisor`.
Therefore, the constraints of the circuit can be satisfied by the
following assignment: `dividend = 0, divisor = 0, quotient = 5`, as this satisfies the circuit's
constraint (`5 * 0 === 0`).
However, this clearly deviates from the developer’s intention,
which was for `quotient` to be set to `dividend / divisor` and for `divisor` to be non-zero.

## Usage Example

Running the DBZ detector yields the following text output log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
----Running Vanguard with zk-divide-by-zero detector----
Running detector: zk-divide-by-zero
// highlight-next-line
[Critical] Found signal in component that are used as divisors and could cause a division by zero Divide @ divide_bug.circom:3
Reported By: vanguard:zk-divide-by-zero
Location: Divide @ divide_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
Found signal in component that are used as divisors and could cause a division by zero Divide @ divide_bug.circom:3
  * Signal  divisor in expression Divide @ divide_bug.circom:7
// highlight-end
```

</details>

Line 3 of the above log tells us that there is a division operation that uses a signal as a
divisor in the `Divide` component (defined on line 3 in `divode_bug.circom`).
Lines 9--10 of the log then tell us that signal is `divisor` and that the possible divide-by-zero error
occurs on line 7 in `divide_bug.circom`.

## Limitations

This detector does not evaluate the possible values of expressions used in divisors, instead
flagging all division operations as possible divide-by-zero concerns. This means that
divisor expressions that are explicitly constrained to be non-zero will incur false
positives.

## Assessing Severity

If it is manually determined that the divisor of a division operation may be zero, the circuit may contain
a critical vulnerability, as unexpected signal values may be used to generate a valid proof.
