# Running OrCa with Hardhat Projects

This page outlines how to fuzz Hardhat projects using OrCa.

## The Basics

Before attempting to fuzz your Hardhat project using OrCa, please ensure that your code compiles and can be deployed without error.
To do so, perform the following steps on your Hardhat project locally and ensure that they pass.

```
npm ci
npx hardhat compile
npx hardhat node
npx hardhat run --network localhost <path_to_deploy_script.js>
```

If the above commands all pass, your project is ready to be fuzzed with OrCa.

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

1. The `FSEvents` node library required by Hardhat projects on MacOS is not compatible with Linux systems. If your Linux system is attempting to install `FSEvents` during `npm ci`, perform the following steps to fix the issue.
    * Delete `package-lock.json` from your project directory.
    * Remove the `FSEvents` dependency from `package.json`.
