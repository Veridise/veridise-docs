# Using OrCa with Hardhat Projects

OrCa supports usage with Hardhat project in both versions 2 and 3. It should be noted that OrCa has the best support for Foundry projects, so it may be advantageous to use Foundry unless Hardhat is necessary.

## Hardhat Project Prerequisites

OrCa can support most features of standard hardhat projects. OrCa requires that the project is compilable and has a **single** deployment script (either written using an ignition module or deployment script).

While it is difficult to enumerate all restrictions on Hardhat projects, if you are able to run the following commands locally, it is likely that the project should be able to be fuzzed by OrCa:

```bash
npm ci
npx hardhat compile
npx hardhat node
# For Hardhat deployment script
npx hardhat run --network localhost <path_to_deploy_script.js>
# For Hardhat ignition script
npx hardhat ignition deploy --network localhost <path_to_ignition_module.ts>
```

For more information on debugging build/deployment issues with OrCa, see [Debugging Build and Deployment Issues](debug.md).
