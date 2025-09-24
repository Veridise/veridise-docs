# Common Settings

## Timeout

This setting allows a user to specify how long (in minutes) the fuzzer should run. It is important to note that if the project has no violation of the property being checked, it will run for the full time specified, so user's should be thoughtful when setting this value to conserve resources.

## Fork Network & Fork Block Number

This setting allows OrCa to start fuzzing based on a set of Ethereum, Arbitrum, and Base mainnets and testnets and allows users to pass a block number to reference which block OrCa should reference. If no block number is provided, the latest is used. This field may be required for a few cases. The project under test might have contracts which contain on-chain calls or the project might have deployment scripts which refer to contracts already deployed on the blockchain and the deployment script will fail without on-chain access.
