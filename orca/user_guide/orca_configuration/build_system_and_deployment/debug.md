# Debugging Build and Deployment Issues

Running OrCa requires that your project can both build and deploy. When there are issues in this process, it can be tricky to debug as the deployment is happening through AuditHub.

When encountering any issue, the **first** thing you should try is building/deploying locally to ensure the project is actually ready to be fuzzed (see the guidance on [Hardhat](hardhat.md) and [Foundry](foundry.md) for determining which commands to run to mimic operations done through AuditHub).

Assuming local building/deployment works successfully, your issue may be one of the following common issues.

## Common Issues

### Unspecified Environment Variables

Many deployment scripts require environment variables to be set in order for the script to run. When possible, it is usually advisable to simply remove reliance on these environment variables (they are often only required for validation procedures which are not necessary for testing). However, when they are necessary, AuditHub allows users to provide these environment variable definitions in the project setup.

### Unrecognized Deployment Address

It is common in both Foundry and Hardhat to set the deployer address to be the address derived from a private key provided locally via an Environment variable. For obvious reasons, we do not suggest sharing your private key on Audithub via environment variables. Instead, it is advised to use one of the following default addresses for sending transactions in the deployment script:

```solidity
address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266),
address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8),
address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC),
address(0x90F79bf6EB2c4f870365E785982E1f101E93b906),
address(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65),
address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc),
address(0x976EA74026E726554dB657fA54763abd0C3a0aa9),
address(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955),
address(0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f),
address(0xa0Ee7A142d267C1f36714E4a8F75612F20a79720)
```

### Deploying via Proxies

Good news is that OrCa supports deployment through many of the commonly used proxy standards, including:

- ERC1967Proxy
- BaseUpgradeabilityProxy
- TransparentUpgradeableProxy
- UpgradeableBeacon
- BeaconProxy

However, OrCa does not support deployment through other proxy patterns, including diamond proxies and custom proxy patterns. When these are used, Orca may successfully deploy contracts but fail to fuzz them appropriately.

### Deployment through Factories

Sometimes one may want to deploy contracts through a Factory contract in the deployment script. Currently OrCa will not register these deployments, meaning the deployment script will run successfully but those contracts deployed through the factory will not be fuzzed. In these cases, it is advised to adjust the logic to deploy the desired contracts directly from the deployment script.

### Dynamic Contract Deployment

In some protocols there may be contracts that are deployed dynamically during execution of the program. For instance, it may be the case that every time a user purchases a position, a contract is deployed for them which represents their current state. OrCa **does** support fuzzing such protocols, but it **does not** support fuzzing the dynamically-deployed contracts. In other words, OrCa will only fuzz those contracts which are deployed when the deployment script is executed.

### `--via-ir` and Optimizations Enabled

Both Foundry and Hardhat have options that allow for optimizations during compilation that can be used to improve code performance and circumvent size restrictions placed by both SOLC and the EVM more generally. OrCa should continue to work if these flags are enabled, but it may lead to unexpected statics reporting, particularly when it comes to information about coverage. When possible, it is suggested to disable these flags for the best experience using OrCa.

### Reading from and Writing to Files

Sometimes deployment scripts will read from or write to files. In many cases, these are used to read in configuration information and dump information about the deployed contracts. These often cause issues for deployment with OrCa arising from permissioning. In most cases these can be circumvented by inlining the necessary values and removing the writing of deployment information (which is almost always unnecessary for testing).

### Foundry FFI

Foundry enabels a "foreign function interface" (FFI) for interacting with outside code in deployment scripts. Due to restrictions we place on deployment scripts, these do not work on deployment through AuditHub. To circumvent, it is often possible to simply hard-code the expected results of the external call.

### Desired Transactions are not Broadcast

If you notice that deployment succeeds but OrCa does not appear to be fuzzing the intended contracts, it is possible you failed to broadcast the intended transactions. In particular, OrCa will register all transactions from the deployment script that are broadcast, so all intended transactions must be wrapped with `vm.startBroadcast()` and `vm.stopBroadcast()`.
