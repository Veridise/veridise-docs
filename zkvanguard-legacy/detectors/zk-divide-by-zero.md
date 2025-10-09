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

The Divide By Zero (DBZ) detector identifies potential divide-by-zero errors in ZK circuits.
Such errors can pose significant security risks, since malicious
actors may be able to generate valid proofs for bogus statements.

### Usage

The DBZ detector is invoked by selecting "Divide by zero (ZK)"
(`zk-divide-by-zero`) in the Detector selection during the tool configuration step.

## Example and Explanation

In the following example, the `Divide` circuit has been developed to compute the
`quotient` of `dividend` divided by `divisor`.

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

The intended behavior of this circuit is for `quotient` to be `dividend / divisor`.
This is done by first assigning `quotient <-- dividend / divisor`, then enforcing the constraint
`quotient * divisor === dividend`. Division cannot appear directly in constraints
because they are non-quadratic operations.

However, this constraint does not enforce that `divisor` must be non-zero for the division
to be valid. In other words, the developer did not intend for `divisor = 0` to be allowed.

As a result, the constraints can be satisfied by an assignment such as
`dividend = 0, divisor = 0, quotient = 5`, since `5 * 0 === 0`.
This clearly violates the developer's intent: `quotient` should represent `dividend / divisor`
and `divisor` should never be zero.

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

Line 3 of the log indicates that there is a division operation using a signal as a divisor in the `Divide` component.
Lines 9–-10 indicate that the signal is `divisor` and that the potential divide-by-zero occurs on line 7 in `divide_bug.circom`.

## Limitations

This detector does not evaluate the possible values of divisor expressions; it flags all division operations as potential divide-by-zero concerns. Consequently, divisor expressions explicitly constrained to be non-zero may generate false positives.

## How to Assess Severity

If analysis shows that the divisor of a division operation may be zero, the circuit
may contain a critical vulnerability, as unexpected signal values could be used
to generate a valid proof.
