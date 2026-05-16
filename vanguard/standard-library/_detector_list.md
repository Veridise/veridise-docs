## ERC-20 (Fungible Token)

### Unsafe ERC20 transfer/approve

This custom detector finds all ERC20 transfer/approves that do not use
SafeERC20.

### Arbitrary ERC20 transferFrom/approve

Flag external functions that call ERC20 transferFrom and approve on a
caller-provided recipient, such that there are no access controls.

### Unrevoked ERC20 Approval

Flags contracts that grant ERC20 approval to an address stored in a storage
variable, but do not reset that approval if the storage variable is
modified.

NOTE: this custom detector currently does not distinguish between different
token types.

## Common Vulnerabilities

### Simple Flashloan

Flag simple flashloan vulnerabilities involving token transfers.

Specifically, this looks for external functions that transfer tokens, such
that they rely on balances to determine whether the transfers should occur.

### Arbitrary Delegatecall Address

Flags delegatecalls where the address is arbitrary,
i.e. 1) it is supplied via an argument to an external function and 2) there
is no validation performed on the address.

### Low-level Call Hijacking

Flags low-level calls where the calldata is arbitrary, i.e. 1) it is
user-supplied via an external function argument and 2) it is not used in a
require statement.

### Missing or Incorrect Access Control Checks

Flags externally callable functions that might perform some side-effect
(e.g. update state, transfer etc.) and are not guarded by a
"correct looking" require/revert involving msg.sender, that is a require/revert
with the following property: for all clauses involving msg.sender, the clause must be in the
form msg.sender == x, and there must exist at least one such clause.

This custom detector is mainly useful for identifying gaps in a protocol's
access controls or common mistakes such as using `msg.sender != x` instead of `msg.sender == x`.
It can also flag unnecessarily complicated require/revert conditions which could be simplified
into a `msg.sender == A || msg.sender == B || ...` form.

It may produce many false alarms, particularly on functions that are
intended to allow arbitrary users to modify the contract's state.
