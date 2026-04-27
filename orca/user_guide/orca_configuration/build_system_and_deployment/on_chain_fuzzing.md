# On-Chain Fuzzing

OrCa can fuzz **already deployed** contracts by supplying a configuration file whose name ends with `.deployment.json` (for example, `protocol.deployment.json`). This mode enables on-chain fuzzing: OrCa drives the same hints, [V] specifications, and fuzzing options as in a normal campaign, but it learns callable interfaces from **ABIs** attached in the deployment file instead of from your Solidity sources.

## `deployed_contract_information` (required)

The deployment JSON must contain `deployed_contract_information`. It is an object whose keys are **checksummed** contract addresses on the chain you fork, and whose values describe each contract OrCa should fuzz:

- `name`: A display name for the contract in OrCa.
- `abi`: The contract ABI produced by `solc` (the standard JSON ABI array). For verified contracts, this ABI can often be downloaded directly from block explorers such as Etherscan or similar providers.

Only the contracts listed here are targeted for fuzzing in this mode.

## `users` (optional)

You may supply a `users` field: an array of objects, each with:

- `address`: The **checksummed** address OrCa should use as a fuzzing actor.
- `private_key`: The 32-byte hex private key for that address. This value is used for **cryptographic hints** when your hints require signing or related operations.

When cryptographic signing is not needed for an address (which is usually the case for most or all fuzzing users), you can use the dummy key:

`0x0000000000000000000000000000000000000000000000000000000000000000`

**NOTE:** Addresses in `users` do not have to be externally owned accounts (EOAs). However, OrCa treats each listed user as an EOA for fuzzing purposes.

**WARNING:** If an address appears in `users` **and** your protocol calls that address during fuzzing (either directly or indirectly), you may see **unexpected reverts**. OrCa replaces user code sections with **empty code** for fuzzing when modeling those actors, which can break call paths that expect contract logic at those addresses.

## Specifications, Hints, and ABI-Only Information

[V] specifications and the hint language work the same way as in source-based fuzzing. The only difference is what OrCa knows about the contracts: it has the **ABI** of deployed contracts, not their original source.

You should therefore:

- Treat **structs** as **tuples** in types you pass to specs and hints.
- Treat **enums** as **integers**.
- Avoid assuming that **interface** relationships or richer type information from Solidity are available for fuzzed contracts.

All other fuzzing configuration options apply unchanged, including [Fuzzing Blacklist](../advanced_settings.md) and other settings documented under [Advanced Settings](../advanced_settings.md).

## Auxiliary Deployment Script

On-chain fuzzing also supports an **auxiliary deployment script**. Use it to deploy extra helper contracts, fund accounts, or otherwise set up chain state before fuzzing runs. General guidance on deployment scripts and common pitfalls appears in [Using OrCa with Foundry Projects](foundry.md) and [Debugging Build and Deployment Issues](debug.md).

### Foundry and Anvil

When you use Foundry to construct your auxiliary deployment script for this workflow, keep the following in mind:

- If your `users` list includes addresses that correspond to **contracts that still have bytecode** on the forked chain, you should **clear that bytecode at the end of your script** so OrCa’s EOA modeling stays consistent—see `anvil_setCode` in the Anvil RPC documentation.
- To **broadcast transactions** as specific accounts from a script, use **`anvil_impersonateAccount`** so those accounts can be impersonated for sending.
- It is often useful to grant test ETH with **`anvil_setBalance`** so user addresses can pay for gas and interact with the protocol.

## Example `*.deployment.json`

```json
{
  "deployed_contract_information": {
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": {
      "name": "ExampleContract",
      "abi": [
        {
          "type": "function",
          "name": "deposit",
          "inputs": [{ "name": "amount", "type": "uint256" }],
          "outputs": [],
          "stateMutability": "nonpayable"
        }
      ]
    }
  },
  "users": [
    {
      "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "private_key": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  ]
}
```

The `abi` array should contain the full compiler ABI for each contract; the snippet above is abbreviated for readability.
