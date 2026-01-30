---
title: Tools
sidebar_position: 5
---

AuditHub provides security `tools` that run against a project version. Each tool supports a specific type of analysis and can produce findings. In short, AuditHub offers:

* **a fuzzer for DeFi**: [OrCa](/orca)
* **static analyzers for DeFi**: [Vanguard](/vanguard), Vanguard (Legacy)
* **static analyzers for ZK**: [ZK Vanguard](/zkvanguard), [ZK Vanguard (Circom)](/zkvanguard-legacy)
* **formal verifiers for ZK**: [Picus](/picus-v2), [Picus (Circom)](/picus)

Tools are executed through tasks, which capture the execution context and configuration for a specific version. Auditors and developers use these tools to automate security analysis during a review.
