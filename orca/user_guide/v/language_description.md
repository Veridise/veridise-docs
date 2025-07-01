---
title: "[V] Language Description"
sidebar_position: 3
---

[V] is a declarative language for writing correctness specifications. Any [V] specification contains several distinct sections -- some required, some optional, and some that are mutually exclusive. This document describes these sections, detailing their purpose and syntax.

## Overview of Sections

[V] specifications contain the following sections:

```solidity
vars: <declarations>
(fair: <statements>)?
((spec: <ltl_formula>) | (inv: <condition>))
```

The `vars` section is required, and is used to declare free variables in the specification. The `fair` section is optional and is used to direct the search space of transaction sequences. Exactly _one_ of the `spec` and `inv` section is required. The `spec` section is used to describe a property of the source code that should be checked. The `inv` section is used to describe invariants, a specific type of property.


## `vars` Section

```solidity
vars: <varType> <varName>, <varType> <varName>, ...
```

The `vars` section contains all variable declarations for the specification. Most often, this include contract variable declarations of the form `ContractName varName`, but can also include other variables used in the spec.

Any variable declared in the `vars` section is considered a free variable, meaning that the specification does not hold if _any_ assignment to the variable falsifies the spec.

Besides contract types, the following are accepted as variable types in the `vars` section:
* `address`
* `string`
* `bool`
* `uint8-uint256` and `int8-int256`. `uint` and `int` are equivalent to their 256-bit counterparts.
* `bytes`
* `bytes1-bytes32`
* Struct types `Contract.StructType`
* Enum types `Contract.EnumType`
* Array types `<type>[]`, `<type>[][]`, etc.
* Bounded array types `<type>[<uint>]`, `<type>[<uint>][<uint>]`, etc.
* Tuple types `(<type>, <type>)`, `(<type>,<type>,<type>)`, etc.


## `spec` Section

```solidity
spec: []!finished(<target>, <condition>) ...
```

The `spec` section contains an LTL formula over [V] statements that describes some property of the source code. This section provides a high-level overview of the syntax of the `spec` section. Other documents discuss [[V] Statements](v_statements.md) and [LTL formulae](temporal_specifications.md) in more detail.

### LTL Formulae

OrCa works by checking the validity of the LTL formula provided in the `spec` section. We say that the formula is valid when the formula is true for (1) any possible assignment of the free variables declared in the `vars` section and (2) any possible sequence of transactions issued over the contracts in scope. When OrCa finds a set of assignments for free variables and a transaction sequence that falsified the provided formula, OrCa reports this transaction sequence as a "counterexample" to the specification.

The LTL formulae permissible in the `spec` section is described by the following grammar:

```solidity
L :   S
    | (L)
    | <> L
    | X L
    | ! L
    | [] L
    | L U L
    | L R L
    | L ; L
    | L && L
    | L || L
    | L ==> L
```

`S` in the grammar represents a [V] statement. [V] statements make up the atoms of the LTL formula within a [V] spec. [V] statements are evaluated in the context of a single transaction, as described in the next subsection. The LTL formula `S` (composed of a single [V] statement) is true for an event sequence if `S` evaluates to true over the first transaction in the event sequence.

The boolean operators `||` ("or"), `&&` ("and"), and `!` ("not") have their usual meaning. For an in-depth explanation on the semantics of temporal operators `<>`, `X`, `[]`, `U`, `R`, and `;`, see [Temporal Specifications](temporal_specifications.md).


In general, LTL formula are evaluated over infinite sequeces of events. In the context of blockchain applications, each of these events has an associated blockchain state. There are two ways that OrCa interprets a finite sequence of transactions as an infinite sequence of events to evaluate an LTL formula over:
1. Each transaction is translated into two sequential events: one event where the transaction is started, and one where the transaction is completed (or reverted if the transaction errored). The associated blockchain state of the transaction started event is the state _before_ the transaction is issued, while the state for the completed/finished/reverted event is the state _after_ the transaction is issued.
2. The event sequence is extended infinitely with null-events $\epsilon$ such that any [V] statement `S` evaluates to false over any null-event $\epsilon$.

### [V] Statements

[V] statements make up the atoms of the LTL formula within a [V] spec. The following grammar describes the syntax of a [V] statement:

```solidity
S : F(T, E)

F :   started
    | reverted
    | executed
    | finished

T :   I.I(I, ...)
    | I.I
    | I.*
    | *
```

`F` represents the type of statement, `T` represents the target of the statement, and `E` represents the conditional expression. `I` represents any identifier. Conditional expressions must evaluate to a boolean value. [[V] statements](./v_statements.md) describes the expressions allowed for statement conditions in further detail.

A [V] statement `F(T, E)` is evaluated over a particular point in the event sequence. Specifically, `F(T, E)` holds for a particular event iff the following conditions hold:

<ol type="1">
  <li>The event type matches <code>F</code>.</li>
  <ol type="a">
    <li><code>started</code> matches any transaction start event</li>
    <li><code>finished</code> matches any transaction completion event where the transaction was successfully executed</li>
    <li><code>reverted</code> matches any transaction completion event where the transaction was unsuccessfully executed (i.e. reverted)</li>
    <li><code>executed</code> matches any transaction completion event</li>
  </ol>

  <li>The pertinent transaction matches <code>T</code></li>
  <ol type="a">
    <li><code>c.txn(...)</code> and <code>c.txn</code> match the transaction <code>txn</code> over the contract instance <code>c</code></li>
    <li><code>c.*</code> matches any transaction over the contract instance <code>c</code></li>
    <li><code>*</code> matches any transaction</li>
  </ol>
  <li>The condition <code>E</code> holds over the associated blockchain state.</li>
</ol>

## `inv` Section

```solidity
inv: <condition>
```

The `inv` section is shorthand for a set of commonly-expressed specifications. Specifically, the `inv` section allows users to express _invariants_ over the space of in-scope contracts. The invariant `expr` holds when `expr` is true after issuing any transaction.

There are two forms for the `inv` section:
1. `inv: expr`
2. `inv: expr over target`

The invariant `expr over target` holds iff `expr` holds after issuing any transaction that matches `target`. Note that the first form `inv: expr` is equivalent to `inv: expr over *`. For example, to express an invariant over one specific contract `Contract`, use the following [V] specification:
```solidity
vars: Contract c
inv: <cond> over c.*
```

The invariant section `inv: expr over target` is equivalent to the following `spec` section:
```solidity
spec: []!finished(target, !expr)
```

## `fair` Section

The `fair` section allows users to specify a temporal property that should be assumed by OrCa, similar to temporal properties defined in [V] spec section. This section _must_ appear before the `spec` section in the specification:

```solidity
fair: prop1
spec: prop2
```

For this example specification, OrCa will only report counterexamples that both (a) satisfy the fairness property `prop1` and (b) violate the correctness property `prop2`.[^1] See documentation on [fairness assumptions](fairness_assumptions.md) for more details on the `fair` section.

[^1]: Currently, OrCa only uses the fairness property as a precondition for reporting counterexamples. Future versions of OrCa may direct the search to test only sequences that satisfy the fairness property.
