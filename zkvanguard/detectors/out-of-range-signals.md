---
sidebar_position: 2
title:  Out-Of-Range Signals
description: Finds signals that may be assigned a value outside of their desired range.
detectorTypes:
- compute-constrain
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Out-Of-Range Signals

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Out-Of-Range Signals (OORS) detector analyzes patterns of computation and constraint
generation to estimate the expected ranges of intermediate values (e.g., if a value
is part of a byte decomposition, it should lie within [0, 255]).
These expected ranges are then compared against the actual ranges enforced by constraints.
If the expected range is narrower than the enforced range,
values may fall "out of range," leaving them underconstrained and potentially
introducing bugs or vulnerabilities.

### Usage

:::info

Coming soon.

:::

#### Configuration Options

:::info

Coming soon.

:::

## Example and Explanation

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

The following example circom file contains the implementation of the `U16` component,
which is designed to compute a 16-bit value given two 8-bit inputs.

<details open>
<summary><b>out_of_range_bug.circom</b></summary>

```circom showLineNumbers
pragma circom 2.1.8;

template U16() {
  signal input highByte;
  signal input lowByte;
  signal output shortVal;

  // Assert that `shortVal` is 16-bit
  component lt = LessThan(252);
  lt.in[0] <== shortVal;
  lt.in[1] <== 65536;
  lt.out === 1;

  shortVal <== lowByte + (256 * highByte);
}

component main = U16();
```

</details>

While `shortVal` is properly constrained to be a 16-bit value and to equal
the composition of `lowByte` and `highByte`, neither `lowByte` nor `highByte`
is constrained to lie within the 8-bit range.
As a result, multiple assignments of `lowByte` and `highByte` can yield the same `shortVal`.
For example:
- `lowByte = 0, highByte = 1, shortVal = 256`
- `lowByte = 256, highByte = 0, shortVal = 256`
Both satisfy the constraints, even though only the first reflects the intended design.

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

- This detector uses LLZK’s intraprocedural range analysis to infer expected intervals.
  Any inaccuracies in this analysis (e.g., when constraints are applied indirectly in
  other parts of the circuit) may result in false positives.
- This detector only recognizes a specific set of patterns to infer likely intervals.
  It will not detect out-of-range errors for computation patterns that are highly
  circuit- or application-specific.

## How to Assess Severity

If confirmed as a true positive, a finding from the OORS detector indicates
a severe issue. Underconstrained values may allow multiple different proofs
to yield the same output, undermining the integrity of the circuit.
