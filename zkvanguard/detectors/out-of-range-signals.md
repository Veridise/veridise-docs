---
sidebar_position: 2
title:  Out-Of-Range Signals
description: Finds signals that may be assigned a value outside of their desired range.
---

# Out-Of-Range Signals

## Summary and Usage

The Out-Of-Range Signals detector examines patterns of computation/constraint
generation to estimate what **should** be the ranges of IR values (e.g., if
a value is part of a byte decomposition, it should be within the range [0, 255]).
These "presumed" ranges are then compared against the ranges those values are actually
constrained to be within.
If the "presumed" range is narrower than the allowed range,
then it is possible for a value to become "out-of-range",
which may lead to bugs or vulnerabilities as the values are underconstrained.

### Usage

The OORS detector is invoked by selecting "Out-of-range signals"
(`llzk/out-of-range-signals`) in the Detector selection during the tool configuration step.

#### Configuration Options

:::info TODO

This section will be populated once per-detector configuration is enabled in AuditHub.

:::

## Example and Explanation

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

While `shortVal` is properly constrained to be a 16-bit value, and to be the composition
of `lowByte` and `highByte`, neither `lowByte` or `highByte` are constrained to only be bytes.
This means that multiple values of `lowByte` and `highByte` may compute the same output value.
For example, both `lowByte = 0, highByte = 1, shortVal = 256` and `lowByte = 256, highByte = 0, shortVal = 256`
satisfy the constraints with the same value for `shortVal`.

## Usage Example

:::info TODO

This section will be populated after ZK Vanguard lands in AuditHub.

:::

## Limitations

- This detector uses LLZK's intraprocedural range analysis to determine if a divisor
value may be 0. Any inaccuracies caused by this analysis (e.g., if a divisor is
constrained to be non-zero via a separate function call) may cause false
positives in this detector's findings.
- This detector looks for a specifc sset of patterns to infer likely intervals.
This detector will not find out-of-range errors for computation patterns that are
circuit or application specific.

## Assessing Severity

If deemed to be a true positive, a finding from the OORS detector is severe, as
it means that values in the circuit are underconstrained and may allow for multiple
value proofs for the same output values.
