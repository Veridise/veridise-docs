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
Informally, non-interference means that public data should not depend on secure information. Put more formally:

> For all public data $P$ (i.e., *low-security data*), and any pair of private (i.e., *secret*) pieces of data $S_1$ and $S_2$ (i.e., *high-security data*), circuit $C$ exhibits the non-interference property if $C(P, S_1) = O_1$, $C(P, S_2) = O_2$, $O_1 = O_2$.

Now of course, it is often impractical to have a system that provides no flow from high-security data to low-security data.
For example (from [Li et. al](https://www.cis.upenn.edu/~stevez/papers/LZ05a.pdf)):

> Take the example of a login process, the password is a secret and it has a higher security level than the user-level data. By comparing the user input with the password and sending the result back to the user, data flows from high to low, thus the noninterference property is violated.

Similar examples exist for crypto domains as well (e.g., wanting to verify a user is authorized without leaking their private keys).

So, we must often have some way to *downgrade* (or *declassify*) some information safely—in other words, we can transform secret data into public data via some non-reversible, non-revealing function.
A common example of such a function would be a cryptographic hash function, as knowledge of the image of the hash function should give no knowledge of the pre-image, and so the hash of a secret value can be make public without leaking information about the secret.

## Example and Explanation

The following example circuit is designed to compute a crytographic commitment
to performing a specific public operation.
This commitment is based on a public operation, represented by the public
input signal `operation` (in practice, this could be a hash of a smart contract
function and arguments) combined with a private input `private_key` only known
by the committer.
This commitment can be therefore used to prove of the committer's specific intent to
perform the specified operation, as the commitment can be easily verified externally, but
can only be forged if the private key of the committer is compromised.


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

## Usage Example

Running the PIL detector yields the following text output log:

<details open>
<summary>ZK Vanguard Output</summary>

```txt showLineNumbers
----Running Vanguard with private-input-leakage detector----
Running detector: private-input-leakage
// highlight-next-line
[Critical] Private input leakages in component OpCommitment @ private_input_leak_bug.circom:3
Reported By: vanguard:private-input-leakage
Location: OpCommitment @ private_input_leak_bug.circom:3
Confidence: 0.99
More Info: placeholder
Details:
// highlight-start
1 constraint leakage (critical severity), 1 dataflow leakage (high severity):
  * In template OpCommitment @ private_input_leak_bug.circom:3 Vanguard found that private signal private_key is leaked via constraints:
    * Leakages:
      * Signal commitment
      * Signal operation
  * In template OpCommitment @ private_input_leak_bug.circom:3 Vanguard found that private signal private_key is leaked via a dataflow operation:
    * Leakage:
      * Signal commitment
// highlight-end
```

</details>

Line 3 states that the PIL detector has found private input leakages in the
`OpCommitment` template defined on line 3 of the private_input_leak_bug.circom file.
Lines 9--16 then inform us that the `private_key` signal is leaked in two ways:

1. (Lines 10--13) Via the constraint to `commitment` and `operation` (which is generated by the `commitment <== operation + private_key` statement).
1. (Lines 14--16) Via dataflow assignment to output signal `commitment` (also generated by the `commitment <== operation + private_key` statement).


## Limitations

The PIL detector may generate false positives for computation that does properly
downgrade secrets (e.g., if a circuit contains a custom hashing implementation that
is properly non-invertable), as it cannot determine if a series of computations
properly downgrades a secret.
Note that the PIL detector has knowledge of the circomlib hashing implementations
and will not flag private inputs that are hashed via those templates as leakages, as
the circomlib implementations have been throughly analyzed.