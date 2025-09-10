---
sidebar_position: 5
title: Signal-Dependent Control Flow
description: Detects control flow that is conditional on signal-derived values.
---

# Signal-Dependent Control Flow

## Summary and Usage

The Signal-Dependent Control Flow (SDCF) detector warns the user about
non-deterministic witness code (i.e., dataflow operations) in their ZK circuit,
which occurs when dataflow is dependent on conditional branches or conditional assignments.
Conditional assignments are difficult to properly constrain and likely to
lead to unconstrained values, which can lead to significant security risks as
unconstrained values could allow for the construction of bogus proofs.

### Usage

The SCDF detector is invoked by selecting "Signal-dependent control flow"
(`llzk/signal-dependent-control-flow`) in the Detector selection during the tool configuration step.

## Example and Explanation

The following circuit is designed to determine whether the input `in` is 0 or not.
If `in = 0`, then `out = 1`.
For any other value of `in` where `in != 0`, then `out = 0`.

```circom title="non_det_wit_bug.circom" showLineNumbers
pragma circom 2.0.0;

template IsZero() {
  signal input in;
  signal output out;

  signal inv;

  // highlight-next-line
  inv <-- in!=0 ? 1/in : 0; // conditional expression in inv assignment

  out <== -in*inv +1;
}

component main = IsZero();
```

To implement this functionality, the circuit first computes the inverse `inv`
of the input `in`, but uses a conditional assignment such that `inv` will be 0
if `in` is 0, with `inv = 1/in` otherwise (line 9).
With this conditional assignment, it follows thaat the value of `-in*inv` should be
-1 (mod p) if `in` is non-zero, and 0 otherwise.
Therefore, the computation and assignment of `out <== -in*inv + 1` should be
1 if `in` is 0, and 0 if `in` is non zero.

However, this code has a bug: there is no constraint that requires `out` to be a boolean
value (i.e., 0 or 1).
`out` being boolean a consequence of `inv` being the inverse of `in`, which
is _not_ a constraint in this circuit due to the use of the conditional assignment
used to create `inv`.
This allows a malicious actor to set `inv` to be any value independent of `in` as
long as the `out <== -in*inv +1` constraint is satisfied.
The witness assignment of `in = 1`, `inv = -1 (mod p)`, and `out = 2` would therefore
satisfy the circuit's constraints, but violates the intended output of the circuit,
which is that if `in = 1`, `out` should be `0`.

This example demonstrates that conditional assignments often require additional and
more nuanced constraints than normal unconditional assignments may require.
These challenges are why the NDW detector can be a useful tool in flagging conditional
logic for further scrutiny.

:::note

This example is adapted from the `IsZero` circuit provided by [circomlib][circomlib].
However, unlike our above example, the version in circomlib (found in [comparators.circom][iszero-snippet]) is properly constrained:

```circom title="IsZero circuit from circomlib. The constraint missing from our example above is highlighted." showLineNumbers
template IsZero() {
  signal input in;
  signal output out;


  signal inv;


  inv <-- in!=0 ? 1/in : 0;


  out <== -in*inv +1;
  // highlight-next-line
  in*out === 0;
}
```

The addition of the `in*out === 0` constraint on line 13 fixes the issue pointed out in
our example, as it forces one of `in` and `out` to be 0.
:::

## Usage Example

:::info TODO

This section will be populated after ZK Vanguard lands in AuditHub.

:::

## Limitations

The SDCF detector flags conditional expressions and the signals used in those conditional expressions,
but is unable to determine if the conditional expressions are properly constrained or not,
as this requires knowledge of what the design goal of the circuit is.
For example, the SCFG detector would still report the same issue for circomlib's `IsZero` circuit, even
though it is properly constrained.

## Assesing Severity

The severity of signal-dependent control flow depends heavily on whether
or not the involved signals have been properly constrained according to the design
of the circuit.
Assuming that the finding is not a false positive, then the consequences
can be severe, as the verifier may accept a proof with signal assignments outside of what is
intended, allowing malicious users to prove invalid statements.

[circomlib]: https://github.com/iden3/circomlib
[iszero-snippet]: https://github.com/iden3/circomlib/blob/cff5ab6288b55ef23602221694a6a38a0239dcc0/circuits/comparators.circom#L24-L34
