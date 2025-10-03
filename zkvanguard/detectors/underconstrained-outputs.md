---
sidebar_position: 6
title: Underconstrained Outputs
description: Finds underconstrained output signals.
detectorTypes:
- constrain-only
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Underconstrained Outputs

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Underconstrained Output (UCO) detector finds underconstrained output vulnerabilities in ZK circuits.
The UCO detector looks to see if a used output from a component is
constrained either by an input value or a single constant value;
if neither is true, then the output is not constrained and can result in a vulnerability,
as a malicious actor may be able to create valid proofs for bogus statements when outputs are underconstrained.

### Usage

The UCO detector is invoked by selecting "Underconstrained outputs"
(`llzk/underconstrained-outputs`) in the Detector selection during the tool configuration step.

## Example and Explanation

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

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

- This detector may incur false positives if the output signal is designed to be
constant constrained, but that constant is computed within the circuit (e.g.,
the output signal is a hash of a constant value).
- This detector will fail to detect issues where, e.g., an output signal is
constrained by _an_ input, but should be constrained by multiple inputs.

## Assessing Severity

It is generally rare for output signals to not be a function of input signals
or constants, so findings from this detector often indicate severe issues where
key computations and constraints have been accidentally omitted.
These findings are therefore highly likely to be critical issues.
