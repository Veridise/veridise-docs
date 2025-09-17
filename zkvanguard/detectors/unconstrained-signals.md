---
sidebar_position: 5
title: Unconstrained Signals
description: Finds unconstrained signals.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Unconstrained Signals

## Summary and Usage

The Unconstrained Signals (UCS) detector finds unconstrained signals in ZK circuit code.
The UCS detector looks to see if a signal is used in any constraint---if not,
then a malicious actor may be able to create new valid proofs by taking an
existing proof and simply changing the value of the unconstrained signal.

### Usage

The UCS detector is invoked by selecting "Unconstrained signals"
(`llzk/unconstrained-signals`) in the Detector selection during the tool configuration step.

## Example and Explanation

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

The following example circuit is designed to compute a crytographic commitment
to performing a specific public operation.
This commitment is based on a public operation, represented by the public
input signal `operation` (in practice, this could be a hash of a smart contract
function and arguments) combined with a private input `private_key` only known
by the committer.
This commitment can be therefore used to prove the committer's specific intent to
perform the specified operation, as the commitment can be easily verified externally, but
can only be forged if the private key of the committer is compromised.


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
However, the `operation` is not used in the computation of the `commitment` hash; it
is not used in any constraints in the circuit at all.
Since the `operation` is not used in the computation of the commitment, the
commitment is only tied to the `private_key` of the committer.
A malicious actor could therefore theoretically take the existing proof, change
the public `commitment` input, and submit the existing proof with the new public
input and prove the commitment to an unintented operation.

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

While attackers may be able to exploit unconstrained input signals,
some proof systems introduce a "magic constraint"
to automatically constrain otherwise unconstrained inputs (see
[this discussion on Groth16 malleability][groth16-malleability] for a more in-depth discussion).
These magic constraints prevent attackers from manipulating public,
not-explicitly-constrained inputs to create new valid proofs.
So, the potential severity of an unconstrained input signal is
lower than other findings found by ZK Vanguard, as they may often
be false positives due to these magic constraints.


## Assessing Severity

The severity of the finding depends in part on the visibility of the unconstrained signal.

- Input signals may be left unconstrained intentionally in cases where (1) magic constraints are known to be
generated and (2) a specific constraint about a value is not required, but the value should be tied to
the proof (e.g., a proof must use a nonce that is checked for uniqueness in a smart contract).
However, it is still good to be aware of potential vulnerabilities that may
arise when building circuits for proof systems that may or may not introduce such constraints automatically
(which can be difficult to assertain). Furthermore, unconstrained inputs may be
indicating of other semantic bugs, such as forgetting to include an input as
part of a hash computation.
- Unconstrained outputs, as discussed in [the Underconstrained Output Detector](./underconstrained-outputs.md), are
often indicative of severe issues where key computations and constraints have been accidentally omitted.
These findings are therefore highly likely to be critical issues.
- Internal signals that are unconstrained may lead to nondeterministic proofs
(where multiple different proofs for the same set of inputs and outputs may be
generated), which may lead to severe protocol issues (e.g., double spending,
multiple nullifiers for the same commitment).

[groth16-malleability]: https://geometry.xyz/notebook/groth16-malleability
