# Running OrCa with Hardhat Projects

This page outlines how to fuzz Hardhat projects using OrCa.

## The Basics

Before attempting to fuzz your Hardhat project, please ensure that your code compiles and can be deployed without error.

Follow these steps in order to fuzz your Hardhat project locally. When using OrCa through our SaaS platform, these steps will be performed automatically when the "Hardhat" option is chosen.

1. Run `npm install hardhat` in the project directory, ensuring that the `node_modules` folder is created with all required dependencies.
2. Add the following options to the OrCa `config.json` file:
    * Set `"deployment_system"` to `"hardhat"`
    * Set `"include_path"` to `"node_modules"`
    * Set `"deployment_script_path"` to the path to your deploy script, e.g. `"scripts/deploy.js"`
    * Set `"src_path"` to the path to your solidity source files, e.g. `"contracts"`
3. Run `python3.9 orca.py <path_to_config.json>


## Additional Requirements

This section discusses requirements and restrictions on Hardhat projects that may be fuzzed with OrCa.

### Deployment Script Restrictions

* Only one deployment file (in either Typescript or Javascript) is permitted. All deployment should be executed by a single script.
* Proxy deployments are not supported.

### Hardhat with Other Deployment Systems

* OrCa only supports standalone Hardhat projects, meaning that projects which use Hardhat in conjunction with other deployment systems (e.g. Truffle, Foundry, etc.) are not supported.

### Other Requirements

* Ensure that all required secrets (e.g. wallet keys, API keys, etc.) are provided prior to running OrCa.


## Known Issues

This section lists known issues for fuzzing Hardhat projects with OrCa.
Workarounds are also listed wherever applicable.

1. The `fsevents` node library required by Hardhat projects is not compatible with Linux systems.
    * TODO include workaround here
