---
title: "Hint Language Description"
sidebar_position: 2
---

The hint language is a declarative language for writing statements that tell OrCa *how* a given function should be fuzzed. Any hint contains several distinct sections. This document describes these sections, detailing their purpose and syntax.

## Overview of Sections

A hint contains the following sections:

```solidity
vars: <declarations>
hints: <hints>
```

The `vars` section is required, and is used to declare the contracts for which hints are being provided. The `hints` section is where one writes statements telling Orca how to fuzz a given function.

## `vars` Section

```solidity
vars: <varType> <varName>, <varType> <varName>, ...
```

The `vars` section contains a variable declaration for each contract for which we are writing a hint. These are contract variable declarations of the form `ContractName varName`.

## `hints` Section

```solidity
hints: finished(<target>, <hint-program>) ; finished(<target>, <hint-program>) ; ...
```

The hints section contains a sequence of special `finished` statements. Note that the sequence is not ending with a `;`, but `;` is required between each `finished` statement. These finished statements make up distinct hints.

Each hint contains both a `target` and a `hint-program`. The meaning of hint `finished(target, hint-program)` is that transaction `target` should be issued with transaction arguments (and `sender` and `value` values) based on the assignments in `hint-program`.

The target may take the following forms:

1. `contractVar.function(arg1, arg2, ...)`
2. `contractVar.function`
3. `contractVar.*`
4. `*`

Since hints are used to constrain the arguments of transactions, nearly all hints will use the first form of the target (though hints that constrain the argument `sender`, `value` or `timestamp_delta` may use the alternate forms).

The hint program must consist of any sequence of assignment expressions or for-all blocks separated by semicolon (`;`). Expressions inside the for-all block can be described as another hint program, so it may contain any sequence of assignment expressions or for-all blocks.

The assignment expression `<LHS> := <RHS>` must satisfy a few properties:

* `<LHS>` must be either a transaction argument, tuple of transaction arguments, an array access on an argument, a field access on an argument, or the keyword `sender`, `value` or `timestamp_delta`. For example, for a hint over a function `c.foo(arg1, arg2)`, `arg1`, `arg1.field`, `arg1[0]`, `(arg1, arg2)`, `(arg1[1], arg2.field)` are valid candidates for `<LHS>`.
* `<RHS>` must be an expression that evaluates to the type of `<LHS>`. For modifying `sender`, `<RHS>` must have the type `address`. For modifying `value` or `timestamp_delta`, `<RHS>` must be a non-negative value with the type `int`. `solve` expressions return the undefined solve variables defined in its expression as a tuple. For more details on `solve` expressions, please refer to [this link](./by_example/hints.md#general-solve-syntax-and-behavior).

For each assignment expression, the hint program will evaluate that assignment to modify the transaction arguments, or transaction's `sender`, `value`, or `timestamp_delta` (representing the time difference that passes between this transaction and the previous transaction).

For-all expressions can be used to perform a series of assignments over arrays or sequences. To modify each element of an array `arr`, use a hint like below:

```solidity
finished(c.foo(arr), forall{i : range(0, len(arr))}(arr[i] := i))
```

For right hand side values, `<RHS>`, you can provide expressions which will be interpreted when the hint is being executed. As an example, the hint below describes that the argument `sum` will be equal to the sum of the first two arguments:

```solidity
finished(c.checksum(arg1, arg2, sum), sum := arg1 + arg2)
```

### Useful Constants for Expressing Hints

Below are some useful constants for modifying values. The time related constants may be very useful to modify `timestamp_delta` to ensure some amount of time has passed before calling that transaction.

|   Constant                  | Description |
| :-------------------------- | :---------- |
| `MAX_UINT256`               | Returns maximum possible value for a `uint256`. |
| `MAX_INT256`                | Returns maximum possible value for a `int256`. |
| `SECOND`                    | Represents a second, returns the integer value equal to 1. |
| `MINUTE`                    | Represents a minute, returns the integer value equal to 60. |
| `HOUR`                      | Represents an hour, returns the integer value `60 * MINUTE`. |
| `DAY`                       | Represents a day, returns the integer value `24 * HOUR`. |
| `WEEK`                      | Represents a week, returns the integer value `7 * DAY`. |

### Useful Functions for Expressing Hints

The hint language has a series of utility functions used to express hint constraints or assignments, here is the list of the functions below.

#### `user_address() -> address`

Returns a random address from default Anvil user addresses.

#### `address(val: int | str | address) -> address`

Converts `val` to a corresponding address value and returns it. `val` can be an integer, a hex string, or an address, so `x := address(0)` or `sender := address("0xdeadbeef")` are valid uses of this function to convert an integer or a string to an address. In Solidity, addresses are 20-byte long, so this function converts any integer or shorter hex-string to a 20-byte representation. If the passed address is longer than maximum possible address value, OrCa will crash with a value error.

#### `len(val: list[any] | str) -> int`

Returns the length of the array or string `val` as an integer.

#### `range(int low, int high) -> list[int]`

Returns a sorted array consisting of `low, low + 1, low + 2, ..., high-1`. If `low` is equal to `high`, the range is empty and the function will return an empty list. If `low` is greater than `high`, the range is not valid and OrCa will crash with a value error.

This function and `len` function can be used to iterate over an array in hints such as the hint below. In the example below, each cell of the array is assigned to its index value.

```solidity
finished(
  c.foo(arr), 
  forall{i: range(0, len(arr))}(arr[i] := i)
)
```

#### `elem_in_range(low: int, high: int) -> int`

Return a random integer in the range of `[low, high)` (`high` excluded). If the range is empty (if `low` is greater than or equal to `high`), OrCa will crash with a value error.
In the example below, the argument `percent` is assigned a random value from 0 to 100.

```solidity
finished(
  c.foo(percent),
  percent := elem_in_range(0, 101)
)
```

#### `rand_int(low: int, high: int) -> int`

Returns a uniformly random integer in the range of `[low, high]` (`high` included). If the range is empty (if `low` is greater than `high`), OrCa will crash with a value error.

In the example below, the argument `percent` is assigned a random value from 0 to 100.

```solidity
finished(
  c.foo(percent),
  percent := rand_int(0, 100)
)
```

#### `rand_string(len: int) -> str`

Returns a random string of specified length value `len`. If `len` is negative, OrCa will crash with a value error.

#### `rand_bool() -> bool`

Returns a random boolean value (`True` or `False`).

#### `choose_rand(arr: list[T]) -> T`

Returns a random element from the provided array `val` using uniform sampling.

#### `weighted_choose_rand(arr: list[T], weights: list[int]) -> T`

Returns a random element from the provided array `arr` where sampling is performed based on the provided integer array `weights` and each element `arr[i]` has the probability to be selected proportional to the corresponding weight `weights[i]` for each index `i`. `arr` and `weights` must be the same length or OrCa raises a value error.

`arr` and `weights` arrays must have the same size. If they  or OrCa raises a ValueError.

#### `shuffle(val: list[T]) -> list[T]`

Returns a shuffled version of the provided array `val`.

#### `sample(arr: list[T], num_samples: int) -> list[T]`

This function randomly samples `#num_samples` elements from the provided array `val` without replacement and returns those sampled elements as an array. If `num_samples` is equal or greater than length of the input array `val`, this function samples all the elements of the array and returns a shuffled version of the original array.

#### `ecdsa256_sign_bytes(signer: address, msg: bytes) -> bytes`

Returns the signature based on the bytes string `msg` and the address `signer` as a 65-byte bytes string. `signer` has to be one of default user addresses defined by Anvil as the private key associated with the `signer` is used to sign the message and OrCa only has the private key information of Anvil's default user addresses.

Below is an example of a cryptographic hint where `transferCheckSignature` function requires the address `from` to be equal to the signer of the `signature` argument and different from the null address. `HashMsg` function is only a wrapper for the [keccak256 function](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#mathematical-and-cryptographic-functions).

```solidity
// Simple hashing function (uses keccak only)
function hashMsg(bytes memory my_msg) public pure returns (bytes32) {
    return keccak256(my_msg);
}

function transferCheckSignature(
    address from,
    bytes memory signature,
    address to,
    uint256 amount
) public {
    // Require that the signer was the `from` address
    (uint8 v, bytes32 r, bytes32 s) = get_vrs(signature);
    address signer = ecrecover(hashMsg(signature), v, r, s);
    require(signer != address(0));
    require(signer == from);
    // NOTE: Should transfer from the `from` address, not message sender!
    transfer(to, amount);
}
```

The hint to pass the require statements, described below, assigns `from` to a random user address using `user_address()` function and replaces the signature with a message containing the address `to`, signed by address `from` using `ecdsa256_sign_bytes`.

```solidity
vars: MyVToken token
hints: finished(token.transferCheckSignature(from, sig, to, amt),
                from := user_address();
                sig := ecdsa256_sign_bytes(from, token.toBytes(to)))
```

#### `ecdsa256_sign(signer: address, msg: bytes) -> (uint8, bytes32, bytes32)`

Returns the signature based on the bytes string `msg` and the address `signer` as a `(uint8, bytes32, bytes32)` tuple. `signer` has to be one of user addresses defined by Anvil as the private key associated with the `signer` is used to sign the message and OrCa only has the private key information of Anvil's default user addresses.
