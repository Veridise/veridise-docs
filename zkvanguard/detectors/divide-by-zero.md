---
sidebar_position: 2
title: Divide By Zero
description: Finds potential divide-by-zero errors.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Divide By Zero

## Summary and Usage

The Divide By Zero (DBZ) detector is used to identify potential divide-by-zero errors in ZK circuits.
Divide-by-zero errors can lead to significant security risks, as malicious
actors may be able to create valid proofs for bogus statements.

### Usage

The DBZ detector is invoked by selecting "Divide by zero"
(`llzk/divide-by-zero`) in the Detector selection during the tool configuration step.

## Example and Explanation

In the following example, the `Divide` circuit has been developed to compute the
`quotient` of `dividend` divided by `divisor`.
In finite prime field arithmetic, as is performed in circom (i.e., all operations performed modulo the prime $p$),
division is implemented as multiplication by the inverse of the divisor,
Formally, this computation is:

$$
a / b \, \text{(mod p)} \equiv a * b^{-1} \, \text{(mod p), where } b * b^{-1} \, \text{(mod p)} = 1
$$


<Tabs groupId="example">
<TabItem value="circom" label="Circom">

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

The intended behavior of this circuit is for `quotient` to be set to `divident / divisor`.
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

</TabItem>
<TabItem value="zirgen" label="Zirgen">

:::info

Coming soon.

:::

</TabItem>
</Tabs>

## Usage Example

<Tabs groupId="example">
<TabItem value="circom" label="Circom">

:::info

Coming soon.

:::

</TabItem>
<TabItem value="zirgen" label="Zirgen">

:::info

Coming soon.

:::

</TabItem>
</Tabs>

## Limitations

This detector uses LLZK's intraprocedural range analysis to determine if a divisor
value may be 0. Any inaccuracies caused by this analysis (e.g., if a divisor is
constrained to be non-zero via a separate function call) may cause false
positives in this detector's findings.

## Assessing Severity

If it is determined that the divisor of a division operation may be zero, the circuit may contain
a critical vulnerability, as unexpected signal values may be used to generate a valid proof.