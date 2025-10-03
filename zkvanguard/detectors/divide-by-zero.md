---
sidebar_position: 2
title: Divide By Zero
description: Finds potential divide-by-zero errors.
detectorTypes:
- compute-only
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Divide By Zero (DBZ) detector identifies potential divide-by-zero errors in ZK circuits.
Such errors can pose significant security risks, since malicious
actors may be able to generate valid proofs for bogus statements.

### Usage

:::info

Coming soon.

:::

## Example and Explanation

In the following example, the `Divide` circuit has been developed to compute the
`quotient` of `dividend` divided by `divisor`.

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
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

The intended behavior of this circuit is for `quotient` to be `dividend / divisor`.
This is done by first assigning `quotient <-- dividend / divisor`, then enforcing the constraint
`quotient * divisor === dividend`. Division cannot appear directly in constraints
because they are non-quadratic operations.

However, this constraint does not enforce that `divisor` must be non-zero for the division
to be valid. In other words, the developer did not intend for `divisor = 0` to be allowed.

As a result, the constraints can be satisfied by an assignment such as
`dividend = 0, divisor = 0, quotient = 5`, since `5 * 0 === 0`.
This clearly violates the developer’s intent: `quotient` should represent `dividend / divisor`
and `divisor` should never be zero.

</TabItem>
*/}
<TabItem value="zirgen" label="Zirgen">

:::info

Coming soon.

:::

</TabItem>
</Tabs>

## Usage Example

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

:::info

Coming soon.

:::

</TabItem>
*/}
<TabItem value="zirgen" label="Zirgen">

:::info

Coming soon.

:::

</TabItem>
</Tabs>

## Limitations

This detector relies on LLZK’s intraprocedural range analysis to determine
whether a divisor value may be zero. Inaccuracies in this analysis
(for example, if a divisor is constrained to be non-zero in a separate function call)
can lead to false positives.

## How to Assess Severity

If analysis shows that the divisor of a division operation may be zero, the circuit
may contain a critical vulnerability, as unexpected signal values could be used
to generate a valid proof.
