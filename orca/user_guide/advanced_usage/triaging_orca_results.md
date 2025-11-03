# Triaging OrCa Results

Once you've successfully run OrCa, the next question is what do you do with the results. This section will walk you through how you can interpret the outputs of OrCa, including both any counterexamples found as well as the function call statistics reported.

## Interpretting Counterexamples

Coutnerexamples are formatted in a [V]-like syntax. Here is an example:

```solidity
vars: Contract c, address __user0__, address __user1__
test: finished(c.call1(100), sender = __user0__) ;
      finished(c.call2("hello", "world"), sender = __user1__ && value = 100 && timestamp_delta = 20)
```

This can be interpretted as follows: a violation of the specification can be triggered by `user0` calling `call1(100)` follwed by `user1` calling `call2("hello", "world")` with `msg.value` of `100` at the timestamp `20` after the previous call.

A counterexample is **guaranteed** to violate the specification provided. However, a few things should be noted about the reported counterexample:

1. While we attempt to simplify the counterexample as much as possible, there is not guarantee that it is the simplest violation of the specification nor that all calls in the counterexample are necessary to trigger the violation.
2. Addresses that are given unique names in the `vars` section are guaranteed to be unique (which is a distinction from [V] where they may refer to the same address). For instance, in the example `__user0__` and `__user1__` are not the same.
3. If `value = X` or `timestamp_delta = Y` is mnissing from a call, it indicates that these values are simply set to `0`.

## Interpretting Function Success/Revert

Information about reverted/successful function calls can give additional insights into protocol behavior and potential improvements for future fuzzing runs. In what follows we offer a few examples of things to look out for in these results.

### Functions that Revert All or Most of the Time

Sometimes a function has a number of complicated preconditions which are difficult for OrCa to satisfy via random fuzzing. In these cases, it may be necessary to provide OrCa with hints to help it get beyond these challenging checks. It can help in these cases to observe which error reasons are most common and address these first.

### Reverting as a DoS Vector

In Solidity, Denial-of-Service (DoS) attacks are often triggered by a user getting a contract into a state where a function reverts even on expected/valid inputs. Thus, it can be useful to pay attention to revert reasons for functions as they can indicate possible DoS vectors. For instance, an unexpected arithmetic underflow may indicate a potential DoS vector.

### Success as an Indicator of Poor Access Control

It is often the case that protocol designers intentionally limit certain functionality to trusted users. Often this takes the form of a single owner who is allowed to call a function. By default, OrCa fuzzes calls from `10` different users. Thus, if there is a function for which there should be access control but there are very few or no instances of reverts, it may be an indication that proper access controls have not been applied.
