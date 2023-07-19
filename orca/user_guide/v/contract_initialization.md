# Contract Initialization

[V] also provides an *OPTIONAL* contract initialization section denoted by the tag `init`.

The idea behind deployment scripts is to simplify things for OrCa by telling it how to set up the contracts we are fuzzing. This is essential for more complex dApps with multiple smart contracts that depend on one another or have to be deployed to the blockchain in a particular order. 

## Deployment Instructions

Deployment instructions take the form of `finished` [V] statements with a restricted `constraint` field as follows:

```solidity
finished(target, optional_sender_or_value_field)
```

As with normal [V] statements, the `target` field names a smart contract you wish to deploy or a `public`/`external` function of an already deployed contract you wish to invoke. Assuming you declared some contract `ContractName c` in your `vars` section, the `target` used for deploying it takes the form of: 

```solidity
c = ContractName(constructor_args)
```

The constructor inputs (i.e., `constructor_args`) must either be concrete values (e.g., integers, strings, arrays, structs, addresses, etc.) or variables declared in the `vars` section.

## Transaction Instructions

Once a contract has been deployed, you can invoke any of its `public`/`external` functions to preconfigure the state of the blockchain. For example, the following `init` section contains the instructions to **deploy** the `Token` contract `t` and to **mint** `5000` tokens to its `owner`:

```solidity
vars: Token t, address owner
init: finished(t = Token(), sender = owner);
      finished(t.mint(owner, 5000), sender = owner) 
```

As can be seen in the previous example, calling a function takes the following form:

```solidity
contract_var.function_name(function_inputs)
```

Similar to constructor inputs, the `function_inputs` can be either concrete values or variables declared in the `vars` section.

As the above example illustrates, OrCa allows you to specify a user address that deploys a contract or calls a specific function (i.e., the `msg.sender`). This can be done within the `optional_sender_or_value_field` field, and it takes the form: 

```solidity
sender = sender_free_var
```

Alternatively, it can also be used to specify the value of `msg.value`, like so: 

```solidity
value = some_value
```

Both can be done in tandem with an `&&` operator (i.e., logical AND):

```solidity
sender = sender_free_var && value = some_value
```

## Deployment Sequences

Deployment sequences consist of both deployment instructions and transaction instructions as shown above. A sequence is made by combining these instructions using the `;` sequencing operator as follows:

```solidity
vars: Token t, address owner
init: finished(t = Token(), sender = owner);
      finished(t.mint(owner, 5000), sender = owner) 
```

**IMPORTANT**: No other temporal operators besides `;` can be used to construct deployment sequences!
