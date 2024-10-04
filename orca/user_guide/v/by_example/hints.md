---
title: Guiding the Search
sidebar_position: 4
---

This section introduces the `hints` and `fair` sections as tools [V] developers can use in order to help guide
the search for counterexamples against the input specification.

## Our Bug: "I'll need your John Hancock"

For this bug, we'll focus on the `transferCheckSignature` transaction.

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

Here, `hashMsg` is a simple hashing function that uses `keccak256` to hash a message. `get_vrs` splits the `bytes` signature into three parts, which can be used by the `ecrecover` function to recover the original signer of the signature.

The bug itself is fairly straightforward -- the `from` address is not passed to `transfer`, meaning that funds will instead be sent from the message sender. This bug, though fairly straightforward, is difficult to reach in practice because it requires passing a valid signature into `transferCheckSignature`.

Thus, in order to find bugs for functions like these in practice, we'll need to include a hint in our [V] spec that describes how to construct a valid signature. We can write such a spec like this:

```solidity
vars: MyVToken token
hints: finished(token.transferCheckSignature(from, sig, to, amt),
                sig := ecdsa256_sign_bytes(from, token.toBytes(to)))
spec: []!finished(token.transferCheckSignature(from, sig, to, amt),
                  old(token.balanceOf(from)) != token.balanceOf(from) + amt)
```

## Understanding the Spec

At this point, the `vars` and `spec` sections are nothing new to us. The spec is saying that it should never be the case that `transferCheckSignature` finishes and the old balance for `from` is not exactly the new balance for `from` plus the transfered amount. Said another way, any successful call to `transferCheckSignature` should remove `amt` from the balance of `from`. Though this spec accurately describes a correctness property of `transferCheckSignature` that is violated by the bug we saw, finding such a counterexample in practice. That's because tools like OrCa perform enumerative search on the arguments of transactions, and the likelihood of randomly generating a valid signature is nearly zero.

This is where the `hints` section comes in. In order to give tools like OrCa additional information about transaction parameter values, [V] developers may include an optional `hints` section that assigns transaction parameters to specific values or sets of valid values. In our example, the hint specifies that the `sig` argument to any successful call to `transferCheckSignature` must be `ecdsa256_sign_bytes(from, token.toBytes(to))` -- an expression using a builtin [V] function `ecdsa256_sign_bytes`, a call to `MyVToken`'s function `toBytes`, and other transaction parameters. The builtin function `ecdsa256_sign_bytes` signs a hashed message using the private key of the address given in the first argument. Here, the "message" we're signing is the `to` address converted into a byte representation. When OrCa performs fuzzing on this spec, it will use the hint to restrict the values that it tests for the `sig` argument to only those that match this bytes signature. Thus, any test case generated where `amt > 0` will register as a counterexample, exposing the bug!


### General Hint Syntax

Note that there are a few pieces of necessary syntax for the hint. Hints are expressed as `finished` statements, containing both a target function and a condition. Unlike normal `finished` statement conditions, hint conditions _must_ be expressed as a series of expressions, separated by `&&`. Multiple hints for different target transactions can be given in a single `hints` section. These hints are delimited by `;`. The general form of the hints section is as follows:

```solidity
hints: finished(target1, cond1 && cond2 ...) ;
       finished(target2, cond3 && ...)
```

Notice that in the hint from the example, we use `:=` as the assignment operator. This is special syntax for hints, and it allows users to directly assign values to transaction parameters. The expected syntax for the assignment condition is `var := expr`, where the variable being assigned `var` is a transaction parameter. Generally, it is recommended to use assignment hints when possible, as these hints will lead to the best performance. However, hint conditions containing equality between two variables or inequality operators are also allowed.

### Other Hint Examples

In addition to `ecdsa256_sign_bytes`, [V] provides several other useful built in functions for defining hints.

The signature returned by `ecdsa256_sign_bytes` is a bytes-string, 65 bytes in length. An alternative `ecdsa256_sign` function can be used to get signatures as `(uint8, bytes32, bytes32)` tuples `(v,r,s)`.

The function `elem_in_range(low, high)` returns a random element in the range `[low, high)`. For input values that should always lie within a specific range, use a hint like this:
```solidity
hints: finished(c.foo(percent), percent := elem_in_range(0,101))
```

The function `user_address()` returns random user address. For input addresses that should always be user addresses, use a hint like this:
```solidity
hints: finished(c.foo(addr), addr := user_address())
```
