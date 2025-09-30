# Getting Started with OrCa

In this section, we will walk you through the steps necessary to run OrCa on a Solidity project. In particular, we will walk you through:

1. [Prerequisites for Running OrCa](#prerequisites-for-running-orca)
2. [Organizing a Project for OrCa](#organizing-a-project-for-orca)
3. [Writing a V Specification](#writing-a-v-specification)
4. [Running OrCa](#running-orca)
5. [Interpretting OrCa Results](#interpretting-orca-results)

## Prerequisites for Running OrCa

In order to fuzz a Solidity project, OrCa requires the following things:

1. A Solidity project organized using either [Foundry](https://getfoundry.sh/) or [Hardhat](https://hardhat.org/) (either version 2 or 3).
2. A deployment script that deploys the desired smart contracts.
3. At least one [V] specification that will be checked by OrCa.

In the following sections, we will examine each of these requirements via a simple example. For a more detailed breakdowns of the requirements, particularly with respect to build system and deployment scripts, please see [Build System and Deployment Requirements]().

## A Running Example

For this introduction, we will demonstrate how to setup and run OrCa on the following simple `Vault` contract which allows a user to deposit and withdraw ETH.

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.22;

contract Vault {
    mapping(address => uint) public balances;
    bool public closed;

    function close() public {
        closed = true;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint balanceBeforeWithdrawal = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{
            value: balanceBeforeWithdrawal
        }("");
        
        require(success, "Unsuccessful withdrawal.");
    }
}
```

## Organizing a Project for OrCa

As mentioned in [the prerequisites section](#prerequisites-for-running-orca), OrCa requires projects to be built using either Foundry or Hardhat. For the sake of this example, we will assume our project is organized as a Foundry project with the following directory structure:

```bash
vault-project/
├── foundry.toml
├── src/
│   └── Vault.sol
├── script/
│   └── OrCa.s.sol
└── lib/
    └── forge-std/
```

OrCa will accept most common Foundry project-structures, so no special change should be needed here to adapt a project to work with OrCa. However, OrCa does expect **a single deployment script** that deploys all contracts which OrCa should fuzz. In this case, we use the following deployment script (saved in `script/OrCa.s.sol`):

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Vault} from "src/Vault.sol";


contract OrCaDeploymentScript is Script {
    Vault public vault;

    function run() external {
        // OrCa will only fuzz contracts deployed within "broadcasts"
        vm.startBroadcast();

        // Any contract created in here will be fuzzed
        vault = new Vault();

        vm.stopBroadcast();
    }
}
```

For more information on setup and deployment, see [Build System Integration]() and [Writing a Deployment Script]().

## Writing a [V] Specification

In order to run OrCa, we need a property that we want to check. For this example, we will check that the "closed" functionality of the Vault works as intended, namely that a user should only be able to deposit into the vault if it is not "closed" (we will always allow users to withdraw so that their money is not trapped).

We express this as the following [V] specification:

```solidity
vars: Vault v
spec: []!finished(v.deposit, v.closed)
```

In English, this specification can be read as "it is never the case that we finish a call to deposit where the vault is closed." A more detailed introduction to the [V] specification language can be found in [this guide](user_guide/v/by_example/hello_bugs).

The [V] specification can be added as part of the AuditHub project, embedded in the project itself as a file with the extension `.spec`, or added during the configuration phase of OrCa as an "ad-hoc" specification.

## Running OrCa

Now that we have all of our inputs, it is as easy as running an OrCa task (see [instructions on running an AuditHub task]()).

When running OrCa, there are a number of configurable options, including the amount of time to fuzz, contracts to ignore during fuzzing, and others (see [OrCa Configuration Options]() for more on these). Good news here is we can run with all of the default options. Just make sure to select/add the [V] specification above when this option is presented.

## Interpretting OrCa Results

The fuzzer will run for at most the amount of minutes specified for the timeout (defaults to `10` minutes), at which point it will report its results (it will return sooner if violations are found to the specifications provided).

If a violation of a specification is found, it will be reported as a tool finding. For instance, running OrCa on the Vault with the specification above produces the following finding in just a few seconds:

```solidity
vars: Vault v, address __user0__
test: finished(v.deposit(), sender = __user0__ && value = 100)
```

This "counter-example" shows how the specification can be violated -- in this case, someone can violate the specification by simply calling deposit with `msg.value` of `100` (this is because the `closed` value is not used to constrain when deposits happen).

In addition to the counter-example, OrCa also reports information about coverage achieved during fuzzing (as an LCOV file that can be downloaded) as well as information about how OrCa was able to fuzz the contracts/functions in the protocol. Reported information includes which functions were called, how many times they were called, and what percentage of those calls reverted. This information can be helpful in understanding how well OrCa explored the protocol and hints/updates that may be useful for more effective fuzzing. See [Triaging OrCa Results]() for more notes on how to interpret and use OrCa results.