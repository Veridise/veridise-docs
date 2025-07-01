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

Since hints are used to constrain the arguments of transactions, nearly all hints will use the first form of the target (though hints that constrain the transaction `sender` or `value` may use the alternate forms).

The hint program must consist of any sequence of assignment expressions or for-all blocks separated by semicolon (`;`). Expressions inside the for-all block can be described as another hint program, so it may contain any sequence of assignment expressions or for-all blocks.

The assignment expression `<LHS> := <RHS>` must satisfy a few properties:

* `<LHS>` must be either a transaction argument, tuple of transaction arguments, an array access on an argument, a field access on an argument, or the keyword `sender` or `value`
* `<RHS>` must be an expression that evaluates to the type of `<LHS>`, or a `solve` expression that has returns the same type as `<LHS>`. For details on `solve`, please refer to [here](./by_example/hints.md#general-solve-syntax-and-behavior).

For a hint like `finished(c.foo(arg1, arg2))`, `arg1`, `arg1.field`, `arg1[0]`, `(arg1, arg2)` can be candidates for `<LHS>`.

For-all expressions can define hints on arrays. To modify each element of an array `arr` with its index value, use a hint like below:

```solidity
finished(c.foo(arr), forall{i : range(0, len(arr))}(arr[i] := i))
```

For right hand side values `<RHS>`, you can provide expressions which will be interpreted when the hint is being executed. As an example, the hint below describes that the argument `sum` will be equal to the sum of the first two arguments:

```solidity
finished(c.checksum(arg1, arg2, sum), sum := arg1 + arg2)
```

### Useful Functions for Expressing Hints

The hint language has a series of utility functions used to express hint constraints or assignments, here is the list below.

#### `user_address() -> address`

Return a random address among non-contract addresses in the Anvil state (contains default Anvil user addresses and addresses used for deployment).

#### `address(val) -> address`

Return the converted value `val` as an address. `val` can be an integer, or a hex string, so `address(0)` or `address("0xdeadbeef")` are valid uses of this function. In Solidity, addresses are 20-byte long, so this function converts any integer or shorter hex-string to a 20-byte representation. If the passed address is longer than maximum possible address value, OrCa will crash with a value error.

#### `elem_in_range(int low, int high) -> int`

Return a random integer in the range of `[low, high)`.

In the example below, the argument `percent` is assigned a random value from 0 to 100.

```solidity
finished(
  c.foo(percent),
  percent := elem_in_range(0, 101)
)
```

#### `len(arr) -> int`

Return the length of the array `arr` as an integer.

#### `range(int low, int high) -> list[int]`

Return a sorted array consisting of `low, low + 1, low + 2, ..., high-1`.

This function and `len` function can be used to iterate over an array in hints such as the hint below. In the example below, each cell of the array is assigned to its index value.

```solidity
finished(
  c.foo(arr), 
  forall{i: range(0, len(arr))}(arr[i] := i)
)
```

#### `ecdsa256_sign_bytes(address signer, bytes msg) -> bytes`

Return the signature based on the bytes string `msg` and the address `signer` as a 65-byte bytes string.

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

#### `ecdsa256_sign(address signer, bytes msg) -> (uint8, bytes32, bytes32)`

Return the signature based on the bytes string `msg` and the address `signer` as a `(uint8, bytes32, bytes32)` tuple.