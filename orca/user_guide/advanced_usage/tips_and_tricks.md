# Tips and Tricks

In this section, we will describe some tips and tricks that we have found useful for getting the most out of OrCa. We offer suggestions on improving deployment, hints, and [V] specifications.

## Deployment

### Mocking

Smart contract protocols can be quite complicated and can involve interactions among many contracts. Sometimes it can be helpful to simplify projects by testing only a handful of contracts at once and providing simple mocks for the others. Mocks are often vastly simplified versions of the contracts that perform the minimal necessary computation. In many cases, AI can be quite effective at quickly creating a mock for a complex contract.

Mocking can enable more targetted fuzzing and can help get around complex cross-contract dependencies that make fuzzing deeper parts of the protocol infeasible.

### Funding Default Users

Many smart contract protocols involve the transfer of tokens between users and the protocol. Often it is the case that a user must have some amount of funds to interact with the protocol at all. Thus, it is often useful to mint users some non-trivial amount of tokens in the deployment script to enable them to interact with the main protocol functionality.

### Disabling Token Approvals

Often smart contract protocols expect users to send ERC20 tokens to a protocol by approving a protocol contract to transfer tokens on behalf of the user. While OrCa is capable of fuzzing these approvals, they are often known to the user ahead of time and are otherwise uninteresting behavior. To avoid wasting time fuzzing these known behaviors, it can be useful to perform token approvals directly in the deployment script *or* using a token that enables transferring from without prior approval.

## Fuzzing Guidance and Hints

### Contract Wrappers

While fuzzing a contract, it may be useful to create a wrapper of that contract that offers additional functionality that is useful for exposing to the fuzzer. For example, if you are fuzzing a contract `C`, it may be useful to introduce a new contract `OrCaWrappedC` that has additional functions exposed for fuzzing. Some functions that may be useful in a wrapped contract include:

1. Getter functions for exposing values for hints/specifications (see [helper functions](#helper-functions) and [public getters](#public-getters)).
2. Wrapped versions of functions with hard-coded values, which can be helpful for targetting a more narrow window of functionality provided by the original function interface of the contract. For example, suppose we are fuzzing an Auction protocol that enables users to post items up for auction and have other users bid ERC20 tokens for those items. It might be the case that each item is assigned a unique `itemID` when posted and all bidding operations require that unique `itemID` to be provided. For instance, perhaps there is a bid function `bid(uint itemId, uint amount)` that enables a user to bid on the given itemID. We may want to create a simple Auction with one known `itemID` and created a wrapped function `wrappedBid(uint amount)` which simply calls `bid(knownItemID, amount)` that uses a hard-coded `knownItemID`.
3. Functions that combine multiple function calls together, which can be helpful for targetting specific function interactions. For instance, suppose we have a vault contract that allows users to deposit and withdraw funds. We may want to test that a withdraw immediately after a deposit of the deposit amount always succeeds. We could attempt to formulate this as a somewhat complicated [V] specification, but a simpler way to do this might be to add a function `depositThenWithdraw(uint amount)` that simply calls `deposit(amount) ; withdraw(amount)` and then write a simple specification that asserts calls to `depositThenWithdraw` never revert.

### Helper Functions

Hints are useful for allowing auser to tell OrCa how to more effectively construct inputs for a function call. Sometimes the inputs to a function can be quite complicated to construct, including complicated structs, hashed values, etc. In these cases, it can be useful to add helper functions to Solidity that expose the desired behavior, especially if some of that behavior is already in the contracts via private functions (which are not callable from hints).

For example, suppose we have a function which is expected to receive a cryptographic signature of a complicated hash of the other inputs of a function. In code, this might look like:

```solidity

function callThatRequiresSignature(uint amount, address sender, address recipient, bytes memory signature) external {
    bytes memory inputsHash = _computeInputsHash(amount, sender, recipient);
    _validateSignature(inputsHash, signature);
    ...
}

function _computeInputsHash(uint amount, address sender, address recipient) internal returns (bytes memory) {
    ...
}
```

In this case, it may be tempting to try to write a hint like the following:

```solidity
vars: Contract c
hints: finished(c.callThatRequiresSignature(amount, sender, recipient, signature),
    inputsHash := // Complicated logic copied from _computeInputsHash
    signature := ecdsa256_sign(inputsHash)
)
```

While this may be possible, it is often messy and error prone. An easier way might be to simply add the following helper function and invoking it from the hint directly:

```solidity
function computeInputsHash(uint amount, address sender, address recipient) external returns (bytes memory) {
    return _computeInputsHash(amount, sender, recipient);
}
```

## [V] specifications

### Public Getters

[V] specifications are unable to access private variables and functions. Thus, similar to [the section on helper functions above](#helper-functions), it can be helpful to add getters for values that one might want to access in a [V] specification.

### Free Variables

[V] specifications allow users to use free variables to express a connection between contract state and function arguments at multiple different function calls. For example, the following specification states that it should never be the case that the function `foo` is called twice with the same `id` and user address:

```solidity
vars: Contract c, uint id, address user
spec: []!(finished(c.foo(id1, user1), id = id1 && user1 = user) && X<>finished(c.foo(id2, user2), id = id2 && user2 = user))
```

While this is a perfectly valid specification, it may not be the most efficient. In general, when free variables are used, OrCa needs to *search* for values of those free variables that lead to a violation of the specification (ostensibly amounting to an even larger search space). In this case, that would mean having to search for possible IDs and users that lead to a violation of this specification. Thus, when possible, it is advised to minimize the use of free variables in specifications.

For example, the specification can be rewritten as follows to avoid the use of free variables:

```solidity
vars: Contract c
spec: []!finished(c.foo(id, user), 
    // There has been at least 1 previous call to foo with the same ID and user
    fsum{c.foo(oldId, oldUser) when oldId = id && user = oldUser}(1) >= 1
)
```
