---
sidebar_position: 5
title: Unconstrained Signals
description: Finds unconstrained signals.
detectorTypes:
- constrain-only
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Unconstrained Signals (UCS) detector identifies signals in ZK circuits that are not used
in any constraint.
If a signal is unconstrained, a malicious actor may be able to
generate new valid proofs by reusing an existing proof and simply changing the value
of the unconstrained signal.

### Usage

Select "Unconstrained Signals" in the "Required Detector Selection" section
of the ZK Vanguard Task Wizard.

## Example and Explanation

<Tabs groupId="example">
<TabItem value="circom" label="Circom">

The following example circuit is designed to compute a cryptographic commitment
to performing a specific public operation.

The commitment should be derived from a public input signal `operation` (e.g., a hash
of a smart contract function and arguments) combined with a private input `private_key`
known only to the committer.
Such a commitment can then be used to prove the committer’s intent to perform the specified
operation: it is easily verifiable externally, but should only be forgeable if the committer's
private key is compromised.


```circom title="uc_inputs_bug.circom" showLineNumbers
pragma circom 2.1.8;

include "node_modules/circomlib/circuits/poseidon.circom";

template OpCommitment() {
  signal input operation;
  signal input private_key;
  signal output commitment;

  component hash = Poseidon(1);
  // highlight-start
  hash.inputs[0] <== private_key;
  commitment <== hash.out;
  // highlight-end
}

component main {public [operation]} = OpCommitment();
```

The circuit uses the [Poseidon hash function](https://www.poseidon-hash.info/) to compute the `commitment`.
However, in this implementation the `operation` signal is not used in the computation
of the `commitment` hash and is not referenced in any constraints at all.
As a result, the commitment depends only on the committer’s `private_key`.
A malicious actor could therefore reuse an existing proof, substitute a different
public `operation`, and present a valid proof for an unintended operation.

</TabItem>
</Tabs>

## Limitations

While attackers may be able to exploit unconstrained input signals,
some proof systems automatically introduce a "magic constraint" that
constrains otherwise unconstrained inputs (see [this discussion on Groth16 malleability][groth16-malleability]).
These implicit constraints prevent attackers from manipulating unconstrained
public inputs to forge new proofs.
As a result, unconstrained input findings may have lower severity than other ZK Vanguard findings,
and can sometimes be false positives due to these system-level constraints.

## How to Assess Severity

Findings from the UCS detector can range from benign to critical, depending on
which type of signal is unconstrained and how it affects the circuit.

- **Input signals** may sometimes be intentionally left unconstrained, for example
  when magic constraints are expected to be generated or when a value only needs to be
  tied to the proof (e.g., a nonce checked for uniqueness by a smart contract).
  However, developers should still be cautious: different proof systems may or may not
  add such constraints automatically, and unconstrained inputs may also indicate semantic bugs,
  such as forgetting to include a value in a hash computation.
- **Output signals** that are unconstrained (see [Underconstrained Outputs](./underconstrained-outputs.md))
  are usually severe, since they often mean key computations or constraints have been
  accidentally omitted. These findings are highly likely to be critical.
- **Internal signals** that are unconstrained may cause nondeterministic proofs,
  where multiple valid proofs can be generated for the same inputs and outputs.
  This can lead to severe protocol issues such as double spending or multiple nullifiers
  for the same commitment.

[groth16-malleability]: https://geometry.xyz/notebook/groth16-malleability
