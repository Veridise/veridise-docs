---
title: How To Use Custom Detectors Effectively
sidebar_position: 3
---

This page provides examples on how to accomplish common tasks using Vanguard
custom detectors and [PAQL][paql] queries.

While the mechanics of and interactions between various PAQL features will be
explained, the details such as the classes and properties will not.
Thus, we recommend that you consult the [Solidity dialect reference](./solidity-dialect.md)
as you go through each example.

## Code Intelligence {#code-intelligence}

PAQL queries can be used to provide specific, detailed information about the
behavior of a given codebase.
Typically, this involves constructing an _informational query_ through the
following process:

1. Formulating a "problem statement" or "prompt" that specifies what information
   we wish to know.
2. Identifying the various "actors" involved in the prompt.
3. Identifying the "assumptions" that these actors must satisfy.
4. Identifying the behavior that we are interested in.
5. Finally, translating the actors, assumptions, and behavior into a [PAQL
   query][paql].
   The actors become variables in a `FIND` clause, and behavior
   become `WHERE` clauses, and the assumptions become `IN` clauses or `WHERE`
   clauses.

The examples below demonstrate how this process can be used to construct PAQL
queries.

### Example: Listing functions that modify storage variables

When reviewing code that involves complicated functions, it is useful to know
what storage variables may be modified by those functions.
Specifically, a problem statement for this is:

> Which functions may contain writes to storage variables? List all such
> functions and storage writes.

* **Actors**: a function `f`, a storage write `w`
* **Assumptions**: `w` occurs in `f`.
* **Target behavior**: (none).

```paql
FIND
  -- actors
  Function f,
  StorageWrite w IN f,  -- assumption
```

For example, consider the following Solidity code:

```solidity
contract Example {
    uint256 a;
    uint256 b;
    mapping(address => uint256) m;
    function extFun() external {
        a = 10;
        b = 11;
        foo();
        bar(10);
    }

    function foo() internal {
        b += 5;
    }

    function bar(uint256 arg) public {
        m[msg.sender] = arg;
    }
}
```

The above query would return the following results:
1. The `extFun` and the write `a = 10`.
2. The `extFun` and the write `b = 11`.
3. The `foo` and the write `b = b + 5`
4. The `bar` and the write `m[msg.sender] = arg`

:::tip
A few other useful variations of this query:

* To only retrieve the writes to specific variables, add a `WHERE` clause that
  uses the `StorageWrite.location` property.
  For example, to obtain just the writes to the `m` mapping:

  ```paql
  FIND
    Function f,
    StorageWrite w IN f,
  WHERE
    w.location == "m[*]",
  ```

* To only retrieve the writes inside of a specific contract, add a `Contract`
  variable and change `f` to iterate over the contract.

  ```paql
  FIND
    Contract c,
    Function f IN c,
    StorageWrite w IN f,
  WHERE
    c.name == "Example",
  ```

* The `StorageWrite` class can iterate over other constructs like contracts,
  expressions, and statements.
  This allow us to drop the `Function f`, for example:

  ```paql
  FIND
    Contract c,
    StorageWrite w IN c,
  WHERE
    c.name == "Example",
  ```
:::

### Example: Listing external call side effects

In the previous example, the query retrieved pairs of functions and storage
writes that occured _directly_ in that function.
This meant that the query did not include `extFun` as writing to `m[msg.sender] =
arg`, even though `extFun` calls `g` which does perform that write.

When trying to understand the behavior of a contract, we usually are
more interested in _all_ side effects that occur when invoking _external
functions_.
For example:

> For every external function, which writes to storage variables could occur
> when that function is called? List all such functions and storage writes.

* **Actors**: a function `f`, a storage write `w`
* **Assumptions**: `f` is externally callable, `w` is _reachable_ from `f`.
* **Target behavior**: (none).

```paql
FIND
  Function f,
  StorageWrite w IN f.reachable,
WHERE
  f.isExternallyCallable,
```

This updated query has two changes.
First, the `f.isExternallyCallable` clause has been added to ensure that only
externally callable functions (i.e., of `external` or `public` visibility) are
searched.
Second, the storage writes will be retrieved from the `Function.reachable`
property of `f`, which cause internal calls to be "followed" when searching
through each function `f`.

When running the updated query on the Solidity code in the previous example, the
results are:

1. The `extFun` and the write `a = 10`.
2. The `extFun` and the write `b = 11`.
3. The `extFun` and the write `b = b + 5`.
4. The `extFun` and the write `m[msg.sender] = arg`
5. The `bar` and the write `m[msg.sender] = arg`

:::tip
To also retrieve the function that directly contains the write, the variable
declarations can instead be organized as
```
  Function f,
  Function g IN f.reachable,
  StorageWrite w IN g,
```
:::


## Checking For Errors

Custom detectors are particularly useful for searching for vulnerabilities in
code.
This is generally achieved by writing informational queries, which were
demonstrated in [previous section](#code-intelligence).

Queries that search for vulnerabilities are typically structured using one of
two patterns:

1. For all _actors_ satisfying _assumptions_, raise a warning when _negative
   (bad) behavior happens_.
2. For all _actors_ satisfying _assumptions_, raise a warning when _positive
   (good) behavior does not happen_.

The first pattern only requires writing an informational query expressing the
bad behavior to search for.

The second pattern is more complicated: it first requires writing an
informational query that finds "good" behavior to search for, and then the query
must be transformed into a version that searches for cases where the good
behavior is missing.

Examples of these patterns are described below.

### Example (positive): Using the `EXISTS` operator to check for missing access controls

Access controls on functions are typically implemented using require statements like
`require(msg.sender == owner)`.
For complicated functions that may make many nested internal calls, it could be
easy to forget to insert the appropriate access controls.

Queries can provide a very simple way to check that the access controls are
indeed present.
Consider the following problem statement as an example:

> Which `mint` external functions may execute require statements involving the
> `owner` storage variable? Provide a list of such functions and require
> statements.

* **Actors**:
  * a function `f`
  * a require statement `req`
  * a storage read `rd`
* **Assumptions**:
  * `f` is the `mint` function
  * `f` is externally callable
  * `req` is reachable from `f`
  * `req`'s condition is influenced by the value read in `rd`
* **Target behavior**: `rd` reads from the `owner` storage variable

```paql
FIND
  -- actors
  Function f,
  RequireLike req IN f.reachable,
  StorageRead rd IN r.backwardSlices,
WHERE
  -- assumptions
  f.isExternallyCallable,
  f.name == "mint",

  -- target behavior
  rd.location == "owner",
```

While this query reports the places where the access controls are _present_, we
are oftentimes more interested when they are _not_ present.

This can be achieved by "negating" the target behavior through a two-step
process.
First, we must translate the query into an `EXISTS` form over the variables
that match the access controls:

```paql
FIND
  -- actors
  Function f,
WHERE
  -- assumptions
  f.isExternallyCallable,
  f.name == "mint",

  -- target behavior
  EXISTS
    RequireLike req IN f.reachable,
    StorageRead rd IN r.backwardSlices
  WHERE {
    rd.location == "owner",
  }
```

Note that this version searches for functions where the require is _present_,
rather than searching for all occurrences.

Finally, we just need to insert a `!` operator in front of the `EXISTS`.

```paql
FIND
  -- actors
  Function f,
WHERE
  -- assumptions
  f.isExternallyCallable,
  f.name == "mint",

  -- target behavior
  !EXISTS
    RequireLike req IN f.reachable,
    StorageRead rd IN r.backwardSlices
  WHERE {
    rd.location == "owner",
  }
```

The final query is equivalent to the problem statement:

> Which `mint` functions will not execute a require statement involving the
> `owner`? Provide a list of such functions.

:::warning
The `RequireLike req` declaration also has to be moved into the `EXISTS`,
because the _presence_ of the require is part of the target behavior.
Otherwise, the query would flag all require statements in the `mint` function
that are not influenced by the `owner` storage variable.
For example, flagging `require(amount > 0)` would not make sense!
:::

### Example (negative): Using value flow to detect arbitrary transferFroms

In many cases involving function calls, we also care about what _values_ are
used as arguments to those calls.
For example, ERC20 `transferFrom`s whose `from` arguments are supplied by the
external function's caller may be vulnerable to arbitrary `transferFrom`
attacks, as attackers can exploit ERC20 approvals granted to the contract to
"steal" tokens.
The problem of finding such vulnerabilities can be stated as follows:

> Which external functions may invoke external calls to
> `transferFrom(address,address,uint256)` such that the `from` argument of the
> transfer may come from a parameter of the external function? Provide a list of
> such functions and call sites.

* **Actors**:
  * a function `f`
  * an external call `c`
  * a call argument `callArg`
* **Assumptions**:
  * `f` is externally callable
  * `c` is reachable from `f`
  * `c` will invoke the target `transferFrom(address,address,uint256)`
  * `callArg` is the first argument of `c`
* **Target behavior**: there is a function parameter `param` such that:
    * `param` belongs to `f`
    * the value of `callArg` depends on `param`

```paql
FIND
  -- actors
  Function f,
  ExternalCall c IN f.reachable,
  CallArgument callArg IN c,
WHERE
  -- assumptions
  f.isExternallyCallable,
  callArg.index == 0,
  c.signature == "transferFrom(address,uint256)",

  -- target behavior
  EXISTS
    Argument param IN callArg.backwardSlices,
  WHERE {
    param.function == f,
  },
```

The above query works by recursively searching the "dependencies"
(`callArg.backwardSlices`) of the first argument of the `transferFrom` call
(`callArg.index == 0`).
In particular, the values searched in the query are restricted only to function
parameters (`Argument arg`).
Lastly, the query restricts `arg.function == f` to ensure that the `from` indeed
comes from the external function, not just in the function containing the
external call.

:::tip
To also list the parameters are involved (rather than only checking that there is one),
combine the `EXISTS` into the overall `FIND`.
```paql
FIND
  ...,
  Argument param IN callArg.backwardSlices,
WHERE
  ...,
  param.function == f,
```
:::




[paql]: ./paql.md
