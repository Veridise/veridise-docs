---
sidebar_position: 3
title: Private Input Leakage
description: Detects leakages of private inputs via public signals.
detectorTypes:
- compute-constrain
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Private Input Leakage

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Private Input Leakage (PIL) detector warns the user about private input leakages in their ZK circuit,
which occurs when private input values are directly tied to public signals via constraints or witness generation.
When a private input leakage occurs, a malicious entity may be able to learn information about
the private inputs directly from the public circuit signals, defeating one of
the primary purposes of ZK circuits, which is to hide private inputs.

### Usage

The PIL detector is invoked by selecting "Private input leakage"
(`llzk/private-input-leakage`) in the Detector selection during the tool configuration step.

#### Configuration Options

:::info

Coming soon.

:::

## Background

The key security property a ZK circuit aims to enforce is *non-interference*: public outputs should not reveal information about private inputs.
In other words, an adversary should not be able to recover any bits of the secret data from the public outputs.

Of course, some information flow is unavoidable in practice.
For example, in a login process, comparing a user's input against a secret password and returning success or failure leaks one bit of information.
To manage such cases, systems often use *declassification*: carefully transforming secret data into public data through a non-reversible function, such as a cryptographic hash.
A hash value can be safely made public because it reveals nothing about its pre-image.

## Example and Explanation

The following example circuit is designed to compute a crytographic commitment
to performing a specific public operation.
This commitment is based on a public operation, represented by the public
input signal `operation` (in practice, this could be a hash of a smart contract
function and arguments) combined with a private input `private_key` only known
by the committer.
This commitment can be therefore used to prove the committer's specific intent to
perform the specified operation, as the commitment can be easily verified externally, but
can only be forged if the private key of the committer is compromised.

<Tabs groupId="example">
{/* Commented out until Circom frontend is available for V2.
<TabItem value="circom" label="Circom">

```circom title="private_input_leak_bug.circom" showLineNumbers
pragma circom 2.1.8;

template OpCommitment() {
  signal input operation;
  signal input private_key;
  signal output commitment;

  // highlight-next-line
  commitment <== operation + private_key;
}

component main {public [operation]} = OpCommitment();
```

The circuit computes a simple commitment that is merely the sum of `operation` and `private_key` (line 8).
This commitment computation does _not_ properly downgrade the
`private_key` of the committer: given that the circuit implementation itself it not a secret, any observer of the proof could
easily reverse-engineer the value of `private_key` by computing `commitment - private_key`,
as both of these values are public knowledge.
Therefore, even though the circuit is not vulnerable to forged proofs or computational errors,
the manner in which the output is computed effectively makes the private input `private_key` publicly known,
thus leaking private data.

</TabItem>
*/}
<TabItem value="zirgen" label="Zirgen">

```zirgen title="private_input_leak_bug.zir" showLineNumbers
component OpCommitment(operation: Reg, private_key: Reg) {
  // highlight-next-line
  public commitment := Reg(operation + private_key);
  commitment
}
```

The circuit computes a simple commitment that is merely the sum of `operation` and `private_key` (line 2).
This commitment computation does _not_ properly downgrade the
`private_key` of the committer: given that the circuit implementation itself it not a secret, any observer of the proof could
easily reverse-engineer the value of `private_key` by computing `commitment - private_key`,
as both of these values are public knowledge.
Therefore, even though the circuit is not vulnerable to forged proofs or computational errors,
the manner in which the output is computed effectively makes the private input `private_key` publicly known,
thus leaking private data.

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

- This detector may generate false positives for computation that does properly
downgrade secrets (e.g., if a circuit contains a custom hashing implementation that
is properly non-invertable), as it cannot determine if a series of computations
properly downgrades a secret.
- This detector also cannot quantify the amount of information leaked from a computation.
For example, the `IsZero` component in the above circuit will leak one bit of
information related to the private input (i.e., that the secret is nonzero).
The PIL detector will report that the private input is leaked without
indicating how much of it is, or whether the amount leaked has any security impact.

## Assessing Severity

Once a finding has been determined to not be a false positive, the severity of the finding is
determined by the amount of information leaked. If the entire secret input is leaked, then the finding
is critical, as it exposes private inputs in the clear. However, if minimal information about secret inputs
is leaked (e.g., that the input is not zero, as mentioned above), the finding may only merit a warning
or be considered benign. This determination is dependent on the type of the secret
involved and the type of information leaked from the secret.
