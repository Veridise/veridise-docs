---
sidebar_position: 7
title: Unused Fields
description: Finds unused fields within structures/circuit components.
detectorTypes:
- compute-constrain
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Unused Fields (USF) detector identifies declared fields of a circuit component
that are never assigned or constrained.
This may indicate that required computations or safety checks have been omitted,
potentially allowing malicious actors to exploit the circuit.

### Usage

:::info

Coming soon.

:::

## Example and Explanation

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

In the following example, the developer intends to compute the positive difference
between inputs. The `MultiDiff` circuit computes the pairwise difference between
elements in the `inp_large` and `inp_small` arrays, outputting the results
in the `outp` array. Since the circuit is intended to output only positive differences,
each pair of inputs should satisfy the constraint:

$$
\forall_{i \in [0, n)}\, \text{inp\_large[i]} > \text{inp\_small[i]}
$$

<details open>
<summary>Circom Example</summary>

```circom title="unused_fields_bug.circom" showLineNumbers
pragma circom 2.1.8;

// Inlined from circomlib/circuits/bitify.circom
template Num2Bits(n) {
  signal input in;
  signal output out[n];
  var lc1=0;

  var e2=1;
  for (var i = 0; i<n; i++) {
    out[i] <-- (in >> i) & 1;
    out[i] * (out[i] -1 ) === 0;
    lc1 += out[i] * e2;
    e2 = e2+e2;
  }

  lc1 === in;
}

// Inlined from circomlib/circuits/comparators.circom
template LessThan(n) {
  assert(n <= 252);
  signal input in[2];
  signal output out;

  component n2b = Num2Bits(n+1);

  n2b.in <== in[0]+ (1<<n) - in[1];
  for (var i = 0; i < n; i++) {
    n2b.out[i] * (n2b.out[i] - 1) === 0;
  }

  out <== 1-n2b.out[n];
}

template MultiDiff(N) {
  signal input inp_small[N];
  signal input inp_large[N];
  signal output outp[N];

  component lt[N];
  // Bug: should be `var i = 0`!
  for (var i = 1; i < N; i++) {
    lt[i] = LessThan(252);
    lt[i].in[0] <== inp_small[i];
    lt[i].in[1] <== inp_large[i];
    lt[i].out === 1;
  }

  for (var i = 0; i < N; i++) {
    outp[i] <== inp_large[i] - inp_small[i];
  }
}

component main = MultiDiff(3);
```

</details>

To enforce this property, the developer intended to use an array of `LessThan` subcomponents
to check that `inp_small[i] < inp_large[i]` for all `i` in the range $[0,n)$.
However, the subcomponent `lt[0]` is never initialized, so the condition for `i = 0` is never checked.
As a result, an assignment such as:
- `inp_small[0] = 100`
- `inp_large[0] = 1`
- `outp[0] = 21888242871839275222246405745257275088548364400416034343698204186575808495518`
would satisfy the circuit’s constraints but produce an invalid output.
This violates the intended invariant that if `inp_small[0] < inp_large[0]`,
then `outp[0] < inp_small[0]` and `outp[0] < inp_large[0]`.

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

## How to Assess Severity

Findings from the USF detector often indicate severe issues.

Unused fields, if unintentional, may reflect serious computational or constraint-generation
errors that could allow malicious actors to create valid proofs for bogus statements.
Unused fields may also lead to [unconstrained signals](./unconstrained-signals.md)
if the unused fields are translated into circuit signals.

Manual analysis is required to determine whether a field is intentionally unused.
If it is intentional, the field should be removed; otherwise, the underlying bug should be fixed.

