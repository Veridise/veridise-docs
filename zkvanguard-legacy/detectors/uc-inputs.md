---
sidebar_position: 3
title: Unconstrained Inputs
description: Finds unconstrained input signals.
detectorTypes:
- constrain-only
---

import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Unconstrained Input (UCI) detector finds unconstrained input vulnerabilities in ZK circuits.
It checks whether an input to a component is used in any constraint. If not,
a malicious actor could potentially create new valid proofs by taking an
existing proof and changing a public input that is unconstrained.

### Usage

The UCI detector is invoked by selecting "Unconstrained inputs" (`uc-inputs`)
in the Detector selection during the tool configuration step.

## Example and Explanation

The following example circuit is designed to compute a cryptographic commitment
to performing a specific public operation.
This commitment is based on a public operation, represented by the public
input signal `operation` (in practice, this could be a hash of a smart contract
function and arguments) combined with a private input `private_key` only known
by the committer.
This commitment can therefore be used to prove the committer's specific intent
to perform the specified operation. The commitment can be easily verified externally, but
it can only be forged if the committer's private key is compromised.


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
However, the `operation` signal is not used in computing the `commitment` hash;
it is not part of any constraint in the circuit.
Thus, the commitment depends only on the committer's `private_key`.
A malicious actor could theoretically take an existing proof, change the public `operation` input,
and submit the proof with the new public input, potentially proving a commitment
to an unintended operation.

## Usage Example

Running the UCI detector yields the following text output log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
----Running Vanguard with uc-inputs detector----
Running detector: uc-inputs
// highlight-next-line
[Medium] Unconstrained input signal in component OpCommitment @ uc_inputs_bug.circom:5
Reported By: vanguard:uc-inputs
Location: OpCommitment @ uc_inputs_bug.circom:5
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
Unconstrained input signal in component OpCommitment @ uc_inputs_bug.circom:5
  * Signal  operation
// highlight-end
```

</details>

Line 3 of the log tells us that one of the input signals of `OpCommitment` (defined on line 5 of `uc_inputs_bug.circom`) is unconstrained.
Lines 9--10 of the log tell us that the unconstrained input signal is the `operation` signal.

## Limitations

While attackers may be able to exploit unconstrained input signals, some proof systems introduce a "magic constraint"
to automatically constrain otherwise unconstrained inputs (see [this discussion on Groth16 malleability](https://geometry.xyz/notebook/groth16-malleability) for a more in-depth discussion).
These magic constraints prevent attackers from manipulating public, not-explicitly-constrained inputs to create new valid proofs.
So, the potential severity of an unconstrained input signal is lower than other findings found by ZK Vanguard, as they may often
be false positives due to these magic constraints.

## How to Assess Severity

Input signals may be left unconstrained intentionally in cases where (1) magic constraints are known to be
generated and (2) a specific constraint about a value is not required, but the value should be tied to
the proof (e.g., a proof must use a nonce that is checked for uniqueness in a smart contract).

However, it is still important to be aware of potential vulnerabilities when
building circuits for proof systems that may or may not introduce such constraints automatically
(which can be difficult to ascertain). Furthermore, unconstrained inputs may indicate
other semantic bugs, such as forgetting to include an input as part of a hash computation.
