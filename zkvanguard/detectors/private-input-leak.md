---
sidebar_position: 2
title: Private Input Leakage
description: Detects leakages of private inputs via public signals.
---

# Private Input Leakage (`private-input-leakage`)

## Summary and Usage

The Private Input Leakage (PIL) detector warns the user about private input leakages in their ZK circuit,
which occurs when private input values are directly tied to public signals via constraints or dataflow operations.
When a private input leakage occurs, a malicious entity may be able to learn information about
the private inputs directly from the public circuit signals, defeating one of the primary purposes of ZK circuits, which is
to hide private inputs.

### Usage

The PIL detector is invoked by selecting "Private input leakage"
(`private-input-leakage`) in the Detector selection during the tool configuration step.

## Background

The property a ZK circuit is striving to achieve by not leaking private inputs is called *non-interference*.
Informally, non-interference means that public data should not depend on secure information. Put slightly more formally:

> For all public data _P_ (i.e., *low-security data*), and any pair of private (i.e., *secret*) pieces of data _S<sub>1</sub>_ and _S<sub>2</sub>_ (i.e., *high-security data*), circuit _C_ exhibits the non-interference property if _C(P, S<sub>1</sub>) = O<sub>1</sub>_, _C(P, S<sub>2</sub>) = O<sub>2</sub>_, _O<sub>1</sub> = O<sub>2</sub>_.

Now of course, it is often impractical to have a system that provides no flow from high-security data to low-security data.
For example (from [Li et. al](https://www.cis.upenn.edu/~stevez/papers/LZ05a.pdf)):

> Take the example of a login process, the password is a secret and it has a higher security level than the user-level data. By comparing the user input with the password and sending the result back to the user, data flows from high to low, thus the noninterference property is violated.

Similar examples exist for crypto domains as well (e.g., wanting to verify a user is authorized without leaking their private keys).

So, we must often have some way to *downgrade* (or *declassify*) some information safely—in other words, we can transform secret data into public data via some non-reversible, non-revealing function.
A common example of such a function would be a cryptographic hash function, as knowledge of the image of the hash function should give no knowledge of the pre-image, and so the hash of a secret value can be make public without leaking information about the secret.

## Example and Explanation

```circom title="private_input_leak_bug.circom" showLineNumbers
pragma circom 2.1.8;

template Leak() {
  signal input unclassified;
  signal input top_secret;
  signal output computation;

  computation <== unclassified + top_secret;
}

component main {public [unclassified]} = Leak();
```

A prover using this circuit generates a proof that contains two parts:
the proof itself and the public inputs and outputs of the proof.
The public data includes both input unclassified and output computation.
Given that the circuit itself it not a secret, the verifier of the proof could
easily reverse-engineer the value of input top_secret by computing `computation - unclassified`.
Therefore, even though the circuit is not vulnerable to forged proofs or computational errors,
the manner in which the output is computed effectively makes the private input `top_secret` publicly known;
in other words, the circuit has failed to properly *downgrade* the `top_secret` data.

## Usage Example

<details open>
<summary>ZK Vanguard Output</summary>

```txt
----Running Vanguard with private-input-leakage detector----
Running detector: private-input-leakage
[Critical] Private input leakages in component Leak @ ./private_input_leak_bug.circom:3
Reported By: vanguard:private-input-leakage
Location: Leak @ ./private_input_leak_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
1 constraint leakage (critical severity), 1 dataflow leakage (high severity):
  * In template Leak @ ./private_input_leak_bug.circom:3 Vanguard found that private signal top_secret is leaked via constraints:
    * Leakages:
      * Signal computation
      * Signal unclassified
  * In template Leak @ ./private_input_leak_bug.circom:3 Vanguard found that private signal top_secret is leaked via a dataflow operation:
    * Leakage:
      * Signal computation
```

</details>
