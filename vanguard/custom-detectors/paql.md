---
title: Program Analysis Query Language (PAQL)
sidebar_position: 2
---

Search patterns are written in a language named _Program Analysis Query
Language_, or _PAQL_ for short.
PAQL is similar in style to SQL and CodeQL, but Veridise engineers have designed
it to be specialized for solving static analysis problems in DeFi and ZK
applications.
This page will provide examples of PAQL queries and a tutorial on how to write
your own.

Throughout this page and other parts of the documentation, we will use the terms
(PAQL) _query_ and search pattern interchangeably.

## Examples

The examples below will briefly demonstrate different aspects of PAQL using
simple and moderately complex queries in the Solidity dialect.

#### Identify unsafe ERC20 transfers and approves

The following query identifies all calls made directly to ERC20 `transfer`,
`transferFrom`, and `approve` functions.
Specifically, it reports the contract affected, the name of the function that is
called, and the location of the call.
Such calls often neglect to check the success status returned by those
functions, hence why it is useful to report all three pieces of information.

```paql
FIND ExternalCall call IN Contract c WHERE
  /* selectors correspond to:
   *   transfer(address,uint256)
   *   transferFrom(address,address,uint256)
   *   approve(address,uint256)
   */
  regexMatch(call.selector, "0x(a9059cbb|23b872dd|095ea7b3)")
AS
  contract = c,
  target = call.name,
  call,
```

Note that this is a simplified version of a query available in the custom
detectors Standard Library on AuditHub.

#### Detect simple reentrancy vulnerabilities

We define a _simple reentrancy vulnerability_ as a location where a storage
write can occur after an external call in the same contract, such that the
target contract of the call could invoke the same function (where the external
call was launched) before returning control flow back to the original call.
An example of this is the
[infamous DAO hack](https://blog.chain.link/reentrancy-attacks-and-the-dao-hack/).

The following query can be used to note pairs of external calls and writes that
may be vulnerable to simple reentrancy attacks:

```paql
FIND
  Function f IN Contract ct,
  ExternalCall call IN f,
  Expression e IN call.after,
  StorageWrite w IN e
WHERE
  call.isCall,  -- Only ordinary calls are indicative of reentrancy
  !call.isSend  -- Ignore native currency .send/.transfer
AS
  contract = ct,
  function = f,
  target = call.signature,
  call,
  writeLoc = e,
  variable = w.location,
```

The main feature used in this query is the `.after` property of `Expression`s in
the Solidity dialect, which allows iterating over all `Expression`s that may be
executed after the given one, including those in other functions as well.

#### List state-modifying functions that may not be restricted to the owner

In some cases, it is useful to check that a certain bad behavior does _not_
occur.
For instance, it may be intended for the state-modifying functions of a specific
contract to be restricted to the contract's `owner`; if anyone who has not been
checked to be the owner is able to change a storage variable, then this would be
an access control violation.
An example of such a contract is shown below:

```solidity
contract Example {
    address owner;
    uint256 x;
    constructor(address _owner) { owner = _owner; }

    // x is modified but there is no require(...) involving owner, so reported.
    function reported(uint256 _x) external { _setX(_x); }

    function _setX(uint256 value) internal { x = value; }

    function _checkOwner() { require(msg.sender == owner); }

    // x is modified but there is a require(...) involving owner, so not reported.
    function notReported(uint256 _x) external {
      _checkOwner(); _setX(_x);
    }
}
```

PAQL provides the ability to check that such restrictions are correctly enforced
using an `EXISTS` expression, as shown in the following query.

```paql
FIND
  Contract c,
  Function f IN c,
WHERE
  -- Only check the specific contract
  c.name == "MyContract",

  f.isExternallyCallable,
  (EXISTS StorageWrite w IN f.reachable),
  !EXISTS
    RequireLike r IN f.reachable,
    StorageRead owner IN r.backwardSlice
  WHERE { owner.location == "owner" },
```

The above query finds functions that (1) are externally callable; (2) modify at
least one storage location in its contract (including in _other_ functions that
are called from the function); and (3) may not end up executing at least one
"require-like" statement that checks some expression involving the `owner`
storage variable.
Vanguard considers a "require-like" statement to be any statement of the form
`require(condition)` or `if (!condition) revert()` or `if (!condition) throw
Error()`.

## Language Guide

In this section, we will explain how to write a PAQL search pattern using
several examples.

### `FIND` statements

A PAQL search pattern consists of a _find statement_ of the form:

```paql
FIND
  <variable declaration list>
WHERE
  <clauses>
```

In the find statement, you must declare a list of _variables_ describing what
objects should be searched for, as well as a list of _clauses_ that indicate the
conditions that those variables must satisfy.
For example, to list all externally callable functions named `mint` and the
contract of that function, you can write the query:

```paql
FIND
  Contract c,
  Function f IN c,
WHERE
  f.name == "mint",
  f.visibility == "external" || f.visibility == "public",
```

Each variable declaration is written in the form `<type> <name>` or
`<type> <name> IN <expr>`, where `<type>` is an object type
([see below subsection](#types)) and `<name>` is a variable name typically
written in `camelCase` form.
In the above example, the `Contract c` declaration indicates that the system
should search for a smart contract, and that a variable `c` will be set to the
value of each contract during the search.
The `Function f IN c` declaration similarly requests the system to search for
functions, but drawn from a specific set "related" to `c`.
The right-hand side of the `IN` is called the _source expression_ and limits the
search to the specified source.

The `WHERE <clauses>` section is used to filter the variables so that only the
ones that satisfy _all_ of the clauses are reported in the results.
Each clause consists of an _expression_ ([see below subsection](#expressions))
that may evaluate to a boolean value.
In the above example, the first clause checks that the name of the searched
function `f` is equal to `mint`, and the second clause checks that `f` has
either `public` or `external` visibility.
`f` must satisfy both clauses in order to be reported.

To conclude this example, suppose our project consists of the following
contracts and functions:

```
FooContract
  function mint(uint256 amount) external
  function mint(address who, uint256 amount) internal
  function approve(address who, uint256 amount) external

BarContract
  function mint(address who, uint256 amount) public
```

Executing our example query on the project will yield the following results:

```
2 Results

{
  c: FooContract,
  f: function mint(uint256 amount) external
},
{
  c: BarContract,
  f: function mint(address who, uint256 amount) public
}
```

### Notes on Syntax

The `WHERE <clauses>` part can be omitted if no conditions are needed.
For example, to simply list _all_ functions in _all_ contracts, the following
query can be used:

```paql
FIND Contract c, Function f IN c
```

Also, since it is common to have source expressions consisting only of
variables, such variable declarations can be written in a more concise _chained_
form:

```paql
FIND Function f IN Contract c
```

Various types of code comments are supported in a search pattern:

```paql
-- This is a single line comment.
/*
  This is a
  multiline comment
*/
```

### Expressions

Both source expressions and `WHERE` clauses use _expressions_, each of which
represents some sort of computation of a _value_.
For example, `func.name == "mint"` is an expression that, when executed,
computes whether the name of a function referred to by `func` is equal to the
string `"mint"`.

In PAQL, a _value_ is one of the following:
* A string value, such as `"mint"`
* A boolean value, either `true` or `false`
* An integer value, such as `1` or `15`
* An _object_, representing a program construct. In the above examples, the
  contracts and functions are objects.

Expressions consist of values and _operators_ which represent computations
involving one or more expressions.
A list of some basic expressions is shown below.

| Expression                       | Example                        | Description                        |
|----------------------------------|--------------------------------|------------------------------------|
| String, boolean, integer literal | `"hello"`, `true`, `15`        | A constant value                   |
| `e1 == e2`                       | `"hello" == "goodbye"`         | Check if `e1` is equal to `e2`     |
| `e1 != e2`                       | `"hello" != "goodbye"`         | Check if `e1` is not equal to `e2` |
| `e1 && e2`                       | `a == b && c == d`             | Logical conjunction (and)          |
| `e1 \|\| e2`                     | `a == b \|\| c == d`           | Logical disjunction (or)           |
| `!e`                             | `!(true && false)`             | Logical negation (not)             |
| `e.f`                            | `func.name`                    | Get object property                |
| `f(e1, ..., en)`                 | `regexMatch(func.name, "_.*")` | Invoke named operator              |

The list of named operators is:

* `regexMatch(value, regex)`: Given two strings `value` and `regex`, return a
  boolean value indicating whether the regex `regex` matches the string `value`.

:::warning

Integer and boolean literals are not supported by the syntax now, but they can
be returned by properties.
A future update will make them available in the syntax.

Currently, named operators can only be used directly under a `WHERE` clause.
A future update will make them available to be used anywhere in an expression.

:::

### `EXISTS` expressions

An `EXISTS <var declaration list> WHERE { <clauses> }` expression is similar
to a `FIND` statement, but evaluates to a boolean value indicating whether at
least one combination of the declared variables can be found.
This is particularly useful for checking when something is _not_ done.
For example, we could write a query that finds all of the contracts that do
_not_ define a `mint` method:

```paql
FIND Contract c WHERE
  !EXISTS Function f IN c WHERE { f.name == "mint" },
```

If no clauses are needed, then the `WHERE <clauses>` part can be
omitted; however, the `EXISTS` expression must then be wrapped in parentheses.
For example, to find all contracts that do not declare any storage variables:

```paql
FIND Contract c WHERE
  !(EXISTS StorageVar v IN c),
```

### `FIND` projection (`AS` section)

In some cases, it may be useful to exclude variables from the search results,
rename the resulting variables, or to include extra expressions in the results.
All of these may be achieved by adding an extra `AS <name> = <expr>, ...`
section to the `FIND` statement.
The `AS` section consists of a sequence of _alias declarations_ of the form
`<name> = <expr>` which explicitly sets the named expressions that are reported
by the search pattern.

In the running example, we can use an `AS` section to assign friendlier names to
the results:

```paql
FIND Function f IN Contract c WHERE
  f.name == "mint",
  f.visibility == "external" || f.visibility == "public",
AS
  contract = c,
  function = f,
```

This may be further shortened by making use of the `contract` property (see
below subsection) of `Function`, which would allow us to omit the declaration of
`c`:

```paql
FIND Function f WHERE
  f.name == "mint",
  f.visibility == "external" || f.visibility == "public",
AS
  contract = f.contract,
  function = f,
```

It is common to write alias declarations of the form `name = name`.
Thus, a syntax sugar is provided so that a variable name by itself in an `AS`
section is aliased to itself.
For example, suppose we declare `f` as `function` instead:

```paql
FIND Function function WHERE
  function.name == "mint",
  function.visibility == "external" || function.visibility == "public",
AS
  contract = f.contract
  function,  -- equivalent to function = function
```

### Types and Objects {#types}

PAQL is a _strongly-typed_ language in that every value and expression is typed,
with strict rules on what operations can be performed based on type.
In particular, PAQL supports two categories of types:
* _Primitive types_, comprised of strings, booleans, and integers.
* _Object types_, representing the types of objects.
  All declared variables must have object types as their types.
  Names of object types are typically written in `UpperCase`.

Each object has a type associated with it which defines the _properties_ that
may be accessed on the object.
For example, the `Function` object type defines a `name` property that has a
string type, which allows any function object named `f` to be used in the
expression `f.name` to get the name of the function.

Furthermore, every object type supports a set of _iterable types_ that can be
"requested" when an object is used as a source expression in a `FIND` statement
or `EXISTS` expression.
For example, `Contract` supports `Function` as one of its iterable types, so
that each function of a contract may be obtained by "iterating over" that
contract:

```paql
FIND
  Contract c,

  -- Contract object supports Function as an iterable type
  Function f IN c,

  -- f.reachable returns an object that supports Function as an iterable type
  Function g IN f.reachable,
  ...
```

There are also expressions that can be used with object types, mainly the
`<expr> IS <class>` operator that can be used to check whether a specific
expression `<expr>` can be converted to the given class `<class>`.
For example, the following query for Solidity finds all Solidity `Expression`s
that are external calls or internal calls:

```paql
FIND Expression e IN Contract c WHERE
  e IS InternalCall || e IS ExternalCall
```

To see more detailed information about object types and properties for the
specific dialect you are working with, see the related reference documentation:

* [Solidity dialect reference](./solidity-dialect.md)

