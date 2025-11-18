---
sidebar_position: 3
title: Private Input Leakage
description: Detects leakages of private inputs via public signals.
detectorTypes:
- compute-or-constrain
- main-entry
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {DisplayZKVanguardDetectorTypes} from '@site/src/components/vanguard/DetectorTypeUtils';

<DisplayZKVanguardDetectorTypes />

## Summary and Usage

The Private Input Leakage (PIL) detector flags cases where private inputs
are directly tied to public signals through constraints or witness generation.
When this occurs, an adversary may be able to infer secret values from
public outputs, undermining one of the core purposes of ZK circuits:
protecting the privacy of private inputs.

### Usage

Select "Private Input Leakage" in the "Required Detector Selection" section
of the ZK Vanguard Task Wizard.

:::info

This detector will report an error if run on an LLZK file where a "Main" entry
component is not defined, as this detector requires an entry component to define
the circuit's external interface (i.e., what inputs are public or private).

:::

#### Configuration Options

:::info

Coming soon.

:::

## Background

A key security property of ZK circuits is *non-interference*: public outputs
should not reveal information about private inputs. In other words, an adversary
should not be able to recover any portion of the secret data from public outputs.

Of course, some information flow is unavoidable in practice.
For example, in a login process, comparing a user’s input against a secret password
and returning only success or failure still leaks one bit of information.

To manage such cases, systems often use *declassification*: carefully transforming secret data into public data through a non-reversible function, such as a cryptographic hash.
A hash value can safely be made public, because it reveals nothing practical about its pre-image.

## Example and Explanation

The following example circuit is designed to compute a cryptographic commitment
to performing a specific public operation.
The commitment is derived from a public input signal `operation` (e.g., a hash
of a smart contract function and its arguments) combined with a private input
`private_key` known only to the committer.
This commitment can then be used to prove the committer’s intent to perform the specified
operation: it is easy to verify externally, but cannot be forged without knowledge of the committer's private key.

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
This computation does _not_ properly downgrade the `private_key`.
Since the circuit implementation is not secret,
any observer could recover the private key by computing `commitment - operation`,
as both `commitment` and `operation` are public.
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
This computation does _not_ properly downgrade the `private_key`.
Since the circuit implementation is not secret,
any observer could recover the private key by computing `commitment - operation`,
as both `commitment` and `operation` are public.
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

- This detector may generate false positives in cases where secrets are properly
downgraded (e.g., via a custom non-invertible hashing implementation), since it
cannot determine whether a sequence of operations is non-invertible.
- This detector also cannot quantify the amount of information leaked.
For example, an `IsZero` component leaks only one bit of information
(whether a secret is zero or not). The PIL detector will still report
this as a leak, without indicating how much information was exposed
or whether it has practical security impact.

## How to Assess Severity

Once a finding is confirmed as not a false positive (i.e., the leaks occur via invertible functions),
severity depends on how much private information is exposed and the nature of that information.
The follwing approach can help determine the severity:

1. **Quantify the leakage(s).**

   Determine how many bits of the secret can be inferred from each output.
   - If the full secret is revealed (e.g., direct assignment to a public value), all bits are leaked.
   - If only one bit is revealed (e.g., `IsZero`), the impact is smaller and may be benign.
   - For partial leaks, estimate entropy loss (e.g., reducing a secret from $[0, 2^{32})$ to $[0, 2^8)$ leaks 24 bits).

2. **Assess aggregate leakage.**

   Circuits may leak a secret across multiple outputs.
   Check if these leaks expose unique bits of the same secret,
   since combined they may reveal more than any single output.

3. **Classify severity.**

   - **Critical:** Full secret recoverable or leakage enables practical attacks.
   - **High:** Large portion of secret or highly sensitive bits exposed.
   - **Medium:** Partial leakage that meaningfully reduces uncertainty.
   - **Low/Informational:** Minimal leakage (e.g., a single bit) unlikely to be exploitable.

   Adjust severity based on the sensitivity of the input itself.
   For example, a full leak of a non-critical value may still warrant only Medium severity.

By following this process, users can move beyond a simple “leak/no-leak” distinction and make informed judgments about real-world risk.
