# Advanced Settings

## Fuzzing Targets

The Fuzzing Targets config option lets the user specify which contracts should be fuzzed. If the user does not specify this option, all contracts with external/public functions can be fuzzed. However, when specified, only the contracts named by the user will be fuzzed.

**WARNING**: Users should be careful that only calling functions in the contracts in the Fuzzing Targets are necessary to find a violation of the specification -- if this is not the case, OrCa will not find the violation!

## Fuzzing Blacklist

Sometimes, specifying that certain functions should not be fuzzed may be useful. This is often the case for setter functions that should only be invoked when the contract is initialized. OrCa enables the user to provide this information using the "Fuzzing Blacklist** config option, where the user can list functions that should not be included in fuzzing.

**WARNING**: Users should be careful that no blacklisted function is required to find a violation -- if this is not the case, OrCa will not find the violation!

## Reentrancy Detection

By default, OrCa will not find reentrancy violations. However, toggling `Detect Reentrancy** will enable reentrancy detection, which will find violations of a specification that use reentrancies.

**WARNING**: While reentrancy detection is very powerful, it does come at a small cost -- fuzzing will be slower when this option is enabled. Therefore, it is suggested to test both with and without this option enabled.
