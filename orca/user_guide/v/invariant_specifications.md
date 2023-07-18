# Invariant Specifications

Invariant specifications enable a user to check properties that should always hold. Invariant specifications are declared in the invariant section of the [V] specification which is marked by the `inv` tag (short for "invariant"). The invariant section itself contains a single [V] statement, and thus the form of a [V] invariant section is as follows:

```solidity
inv: action(target, constraint)
```

**IMPORTANT**: Currently, only the `finished` and `reverted` actions are accepted as invariants.

## Finished Invariants

Finished invariants allow a user to specify properties that should always hold after a given function (or set of functions) complete successfully. 

For example, suppose we would like to say that it is always the case that a user's balance in a `Bank` contract should always increase if they deposit. This is expressed as an invariant as follows:

```solidity
vars: Bank b
inv: finished(b.deposit, b.balanceOf(sender) > old(b.balanceOf(sender)))
```

## Reverted Invariants

Reverted invariants allow a user to specify *suffficient* conditions for a transaction to revert. For example, we can specify that attempting to deposit 0 into a `Bank` contract should always revert as follows:

```solidity
vars: Bank b
inv: reverted(b.deposit(amt), amt = 0)
```

## Temporal Equivalents

Invariants are really just syntactic sugar for temporal properties. The formal definition of invariants as temporal properties are as follows:

* `finished(target, con)` becomes `[]!finished(target, !con)`;
* `finished(target, pre |=> post)` becomes `[]!finished(target, old(pre) && !post)`;
* `reverted(target, con)` becomes `[]!finished(target, old(con))`;
