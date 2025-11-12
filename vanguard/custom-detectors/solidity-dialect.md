---
title: Solidity Dialect
sidebar_position: 50
---

:::info

This documentation page is still a work-in-progress and may be subject to change.

:::


This page contains reference documentation for the Solidity dialect of PAQL,
describing every object type available, and the properties and iterators of each
object type.

## Contracts and Functions

### Contract

Represents a smart contract of any kind (contract, interface, or library).

#### Properties

* `name`: the name of the contract
* `filepath`: the virtual file path of the contract, as computed by the Solidity
  compiler.
* `kind`: one of `contract`, `interface`, or `library`
* `isContract`, `isInterface`, `isLibrary`: boolean values indicating whether
  the contract is of the specific kind, respectively.
* `superClasses`: an object that may be iterated over to obtain the superclasses
  (as `Contract` objects) of this contract.

#### Iterators

* `Function`: the functions that this contract has. Note that this includes
  inherited functions, as well as internal library functions that are included
  in the Contract's bytecode.
* Any `Statement` or `Expression`: all of the corresponding Statements or
  Expressions that occur in the functions of this contract.
* `StorageVar`: the storage variables that this contract has. Note that this
  includes inherited storage variables.

#### Examples

The following query finds all of the functions defined by interface contracts
that are in the `src` folder:

```paql
FIND
  Contract contract,
  Function function IN contract
WHERE
  contract.kind == "interface",
  regexMatch(contract.filepath, "src/.*"),
```

### Function

Represents a function.

#### Properties

* `name` (string): The name of the function, such as `transfer`.
* `signature` (string): The full name and type signature of the function used in
  the Solidity ABI, such as `transfer(address,uint256)`.
  This is an empty string for functions that are not externally callable.

  :::warning
  There is currently a bug where the signature is not the ABI one.
  This bug will be fixed in an upcoming update.
  :::

* `selector` (string): The selector of this function as a string without a `0x`
  prefix, such as `1234abcd`.
  Empty string if the function is not externally callable, or if it is a
  fallback, receive, or constructor function.
* `isExternallyCallable` (bool): a boolean value indicating whether this
  function may be invoked directly using an external call.
* `visibility` (string): the visibility of this function, such as `external`,
  `public`, `internal`, and `private`.
* `mutability` (string): the mutability of this function, such as `nonpayable`,
  `payable`, `view`, and `pure`.
* `contract` (`Contract`): the `Contract` that has this function.
  Note that this is not necessarily the same as the contract that defined this
  function; for example, if `A` inherits `f` from `B`, then the `Function` object
  for `A.f` will have `A` as its `contract` property, not `B`.
* `reachable`: an object that may be iterated to get objects that are
  "reachable" from this function.
  Supports iteration over `Function`s, expressions, and statements, to get all
  functions/expressions/statements (respectively) that are reachable from this
  `Function`.
  For example, if `f()` calls `g()` and `g()` calls `h()`, then when iterating
  `Function x IN f.reachable`, `x` will iterate over both `g` and `h`.

#### Iterators

* `Argument`: the parameters of this function. Currently, this object only
  supports the `forwardSlices/backwardSlices` properties that are similar to the
  ones defined on `Expression` and `Statement`.
* `StorageRead`: the storage reads that may occur specifically within this
  function (i.e., does not include those in nested internal calls).
* `StorageWrite`: the storage writes that may occur specifically within this
  function (i.e., does not include those in nested internal calls).
* Every `Expression` and `Statement`: all of the expressions/statements of the
  specified type that are directly in the function.
  Note that if you also want to get the expressions/statements in nested calls,
  you should iterate through the `.reachable` property instead.

#### Examples

Find all internal calls to `_updateInterest()` in functions named `deposit`:

```paql
FIND
  Function f,
  InternalCall c IN f
WHERE
  f.name == "deposit",
  c.callee.name == "_updateInterest",
```

Find all storage writes that may be performed as a result of calling an external
function (i.e., in the external function itself and any internal functions that
are reachable from that external function):

```paql
FIND
  Function extFun,
  StorageWrite w IN extFun.reachable,
WHERE
  extFun.isExternallyCallable
```

### StorageVar

Represents a storage variable.
This does not include immutable variables or constants.

#### Properties

* `name` (string): The name of this storage variable.
* `contract` (`Contract`): The `Contract` that this storage variable has been
  inherited into.
* `declaringContract` (`Contract`): The `Contract` that declared this storage
  variable.
* `getterSignature` (string): The signature of the getter function of this
  variable as a string, or empty string if this has no getter function.
* `slot` (integer): The (base) storage slot of this varible.
* `offset` (integer): The (base) offset of this variable.

## Expressions and Statements

The `Expression` and `Statement` classes describe a family of PAQL objects that
cover Solidity expressions and control structures, respectively.

### Common Properties

* `after`: an object that may be iterated to get all `Expression` or
  `Statement` that may be executed after this one.
* `before`: an object that may be iterated to get all `Expression` or
  `Statement` that may be executed before this one.
* `forwardSlices`: an object that may be iterated to get all `Expression` or
  `Statement` that are influenced by the results of this
  `Expression`/`Statement`.
* `backwardSlices`: an object that may be iterated to get all `Expression` or
  `Statement` that are influenced by the operands of this
  `Expression`/`Statement`.

### Common Iterators

* `StorageRead`, `StorageWrite`: the storage accesses that are performed by this
  `Expression`/`Statement`.

### Expression: ExternalCall

Represents an external call.

#### Properties

* `signature` (string): the signature of the function that is invoked by this
  call. Empty string if the function target cannot be determined.
* `name` (string): the name of the function that is invoked by this call. Empty
  string if the function target cannot be determined.
* `selector` (string): the selector of the call target. Empty string if not
  known, or if the target is a fallback or receive.
* `callees`: an object that may be iterated to get all of the external functions
  that may be targets of this call.
* `isLowLevelCall`: whether this is a low-level call, such as in the Solidity
  code `msg.sender.call("")`.
* `isSend`, (bool): whether this is a Solidity `.send/.transfer` of native
  currency.
* `kind` (string): indicates the type of EVM call opcode of this call, one of
  `call`, `staticcall`, or `delegatecall`.
* `isCall`, `isStaticcall`, `isDelegatecall` (bool): indicates whether the call
  is the corresponding kind

### Expression: InternalCall

Represents an internal call (within the same contract).

#### Properties

* `callee` (`Function`): the function that is called.


### Arithmetic Expressions

These expressions represent arithmetic operations, and they include:

* `DivideExpression`
* `MultiplyExpression`

### Generic Expressions

The following Solidity expressions are considered to be `Expression` objects,
but currently do not have any special object types:

* `+`, `-`, `%`, `**` operators (checked and unchecked)
* `<`, `>`, `==` operators
* assignment to storage variable
* use of a storage variable

### Statement: RequireLike

Represents a pattern of expressions/statements that are similar to a
`require(...)` statement.
This currently includes the following:
* `require(condition, "withOrWithoutMessage");` in Solidity
* `if (!condition) revert WithOrWithoutError();` in Solidity
* Any similar patterns to the above that are automatically inserted by the
  Solidity compiler, such as for checking success status of function calls on
  contracts

#### Properties

* `condition` (`Expression`): the boolean expression used as a condition to the
  require-like structure.

### Statement: Revert

Represents any statement that is similar to a revert, including the following:
* `revert("withOrWithoutmessage")` in Solidity
* `revert Error(...)` in Solidity
* Any `revert`s or panics automatically inserted by the Solidity compiler

### Generic Statements

The following Solidity statements are considered to be `Statement` objects,
but currently do not have any special object types:

* `return`
* some instances of `if (condition) { ... }`

## Storage Accesses

To allow reasoning about `storage` variable reads and writes, the Solidity
dialect provides two classes `StorageRead` and `StorageWrite`, which represent a
specific read from or write to (respectively) a specific storage variable.

### Common Properties

* `location`: a string representation of the storage variable location that was
  written, or empty string if unknown.
  For scalar variables, this is just the name of the variable. For aggregate
  data structures, such as `struct` or `mapping`s, this may also include fields
  or indexes.
* `variable`: the `StorageVar` that was read or written.

:::warning

The `.variable` property will currently cause Vanguard to crash for reads/writes
whose target locations are not known to Vanguard.

:::
