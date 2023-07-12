# Configuration Options

The following is a full list of the configuration options available to OrCa and an explanation of their purpose. If these are left out of the configuration, they will be given the default values indicated below:

| Configuration Option | Type | Default Value | Description |
| :------------------- | :--: | :-----------: | :---------- |
| `add_constructor_for_nested_initializers` | `bool` | `False` | TODO |
| `artifacts_path` | `string` | `.artifacts` | default relative path from configuration path where OrCa artifacts are stored while OrCa is running (these artifacts include things like compiled contracts and [V] specifications) -- deleted after running Orca by default |
| `async_run` | `bool` | `False` | TODO: Remove this option! |
| `blockchain`| `bool` | `web3` | indicates which blockchain to use when fuzzing (`Ethereum` and `Starknet` are only supported values) |
| `blockchain_imp` | `string` | `web3` | indicates which implementation of the blockchain to use (For `Ethereum` options are `web3` and `revm` with default of `web3` while for `Starknet` the only option is `starknet_testing`) |
| `compiler` | `string` | `crytic` | TODO: Remove this option! |
| `compiler_optimize` | `bool` | `False` | Enable compiler optimization -- may be necessary for some projects with large files (**important**: only has affect when used with Solidity contracts) | 
| `constructor_vars` | `Dict` | `{}` | TODO: Remove this option! |
| `contract_invariant_mode` | `Dict` | `None` | Adds an option to spoof call sfrom a contract (**important**: this option is not well tested!) |
| `debug` | `bool` | `False` | Enable debugging mode with extra printouts |
| `decider` | `string` | `benevolent` | TODO: Remove this option! |
| `deployment` | `Dict` | `None` | TODO: Remove this option! |
| `deployment_blacklist` | `List` | `[]` | TODO: What is this option? |
| `disable_user_proxies` | `bool` | `False` | Setting this option to `True` disables reentrancy detection, which will result in faster fuzzing but may miss certain vulnerabilities if they rely on reentrancy to be found|
| `fork_url` | `str` | `None` | URL for forking an blockchain instance (e.g., mainnet)
| `function_vars` | `Dict` | `{}` | TODO: What is this option? |
| `fuzz_pure` | `bool` | `False` | By default, OrCa *does NOT* fuzz pure functions as they do not affect state -- set this flag to `True` to enable fuzzing of pure functions |
| `fuzz_targets` | `List` | `[]` | Defines a list of contract names to fuzz -- if this list is left empty, all contracts will be fuzzed |
| `fuzzing_blacklist` | `List` | `[]` | Defines a list of contracts/functions not to fuzz -- if left empty, all public-facing functions will be fuzzed |
| `hints` | `List` | `[]` | Defines hints which can be used to help out the fuzzer. Hints are described in more detail below |
| `include_path` | `str` | `None` | Relative path from configuration file to includes for a project (e.g. `node_modules` for Hardhat projects) |
| `init_blockchain_states` | `int` | `1` | How many initial blockchain states to fuzz -- if deployment scripts (i.e. `init` section of [V] specification) are provided, this likely needs to only be 1 |
| `language` | `string` | `solidity` | Which programming language is being taken in (right now only `solidity` and `cairo` supported) |
| `num_free_var_assignments` | `int` | `1000` | How many free variable assignments to fuzz for [V] specifications with free variables -- the higher this number the slower the fuzzer will run for specifications with many free variables. However, making this number too low could avoid finding violations |
| `num_users` | `int` | `10` | The number of simulated users interacting with the protocol -- should be set as low as possible for finding a given violation |
| `oracle_imp` | `string` | `interpreter_oracle` | TODO: Remove this option! |
| `random_deployment_sender` | `bool` | `False` | TODO: Remove this option! |
| `running_non_cex` | `bool` | `False` | TODO: Remove this option! |
| `save_artifacts` | `bool` | `False` | TODO: Remove this option! |
| `seed` | `int` | `1234` | Seed for OrCa randomness |
| `spec` | `string` | `None` | Name of specification to run -- when set to `None` all specs in the `specs_path` will be run |
| `spec_lang` | `string` | `V` | TODO: Remove this option! |
| `specs_path` | `string` | `specs` | Relative path from configuration file to folder containing [V] specifications |
| `src_path` | `string` | `src` | Relative path from configuration file to folder containing source code |
| `timeout` | `int` | `600` | Maximum number of seconds for fuzzer to run for |

## Hints

TODO: Write me!
 

