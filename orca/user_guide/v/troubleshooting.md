# Troubleshooting

## [V] Statements Refer to Specific Moments in Time

While conventional LTL operates over program states, [V] operates over specific moments in the lifecycle of a smart contract, as described in the Execution Model section. As such, certain temporal expressions are useful in LTL but have trivial counterexamples in [V] since they require a violation of the execution model to hold. Such temporal expressions typically imply that time has either stopped or is not linear.

* Consider the temporal expression `[] action(target, ...)`. This statement has a trivial counterexample since it is impossible to stay in a state consistent with `action` and `target`. More specifically, consider `[] started(token.transfer)`. For this to hold, a `transfer` transaction must always be starting its execution on `token`. Note that this implies that time halts since the transaction never completes.

* Consider the temporal expression `action1(t1, ...) && action2(t2, ...)`. This statement also has a trivial counterexample since it is impossible to be in a state consistent with `action1` and `t1` at the same time as `action2` and `t2` unless `action1 = action2` and `t1 = t2`. If this were to occur, time could not be linear as it would have to be in two states at once. More specifically, consider `started(c.foo) && started(c.bar)`. For this to hold, two transactions must have been simultaneously started on contract `c`.

## Referencing Private Functions/Variables in a [V] Specification

[V] specifications are only able to reference public-facing functions and variables. As a result, if one writes a specification which references a private variable, OrCa will throw an error that the function is unrecognized.

## Specification and Invariant

Either `spec` or `inv` has to be provided within the [V] specification, not both. Otherwise, OrCa will complain that the [V] specification is malformed according to the [V] grammar.

#### `inv` vs `spec` Section

The `inv` section should only contain non-temporal properties, while the `spec` section should only contain temporal properties. For instance, the following represent examples of malformed `inv` and `spec` sections:

```solidity
inv: []!finished(target, constraint)
```

```solidity
spec: reverted(target, constraint)
```

## Reverted Invariants

As explained in [the invariant specification section](invariant_specifications.md), reverted invariants provide **sufficient** conditions for a reversion. Thus, a violation of a revert invariant is a case when the recert constraint holds but the function call does not revert. However, a function call where the constraint is falsified and the function call reverts is *not* considered a violation. To better understand this, consider the following solidity function that we can presume is part of the `Foo` contract.

```solidity
function bar(int x, int y) public {
  require(x > 0);
  require(y > 0);
  emit Event(x,y);
}
```

Suppose we have the following revert invariant:

```
vars: Foo f
inv: reverted(f.bar(x,y), x == 10)
```

This specification is *not* violated by the call `f.bar(-5,10)` even though the call to `f.bar` still reverts and the constraint is not satisfied. Similarly, `f.bar(5,10)` does not violated the specification, even though the call to `f.bar` reverts and the constraint is not satisfied. 

A good way to understand the semantics of the `revert` invariant is to understand its semantics as a temporal specification:

* `reverted(target, con)` becomes `[]!finished(target, old(con))`

## Variable Shadowing

In temporal specifications, variables used as function arguments to the target function *should not* be specification variables declared in the `vars` section. In this case, the variables will simply be shadowed for the scope of the function. To guarantee equality between a function argument and a specification variable, an explicit equality must be expressed. Consider the following example:

```
vars: Foo f, address addr
spec: []!(finished(f.baz(addr)) && X<>finished(f.baz(addr))
```

The user might intend that this specification states that it is never the case that `f.baz` is called twice successfully with the same address argument. However, this is not the semantics of the above due to the shadowing. Instead, the variable `addr` is shadowed in each `finished` statement. To express what the user wanted, we would need to add explicit equalities wiht new argument names as follows:

```
vars: Foo f, address addr
spec: []!(finished(f.baz(a), a = addr) && X<>finished(f.baz(a), a = addr)
```


