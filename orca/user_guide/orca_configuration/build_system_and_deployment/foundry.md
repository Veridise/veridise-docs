# Using OrCa with Foundry Projects

OrCa supports usage with projects using the Foundry build/deployment systems.

## Foundry Project Prerequisites

OrCa has been tested on a wide variety of Foundry project and enjoys good support for most major features. OrCa requires that the project is compilable and has a **single** deployment script.

While it is difficult to enumerate all restrictions on Foundry projects, if you are able to run the following commands locally, it is likely that the project should be able to be fuzzed by OrCa:

```bash
forge build
anvil
forge script <path_to_deploy_script.s.sol> --root . --ast --extra-output metadata --use-literal-content --slow --silent --broadcast 
```

For more information on debugging build/deployment issues with OrCa, see [Debugging Build and Deployment Issues](debug.md).
