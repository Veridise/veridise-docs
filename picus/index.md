---
title: Picus (Circom) Overview
sidebar_position: 1
---

# Picus (Circom)

Picu (Circom) is a legacy tool to determine if a Circom circuit is underconstrained or not. 
Picus (Circom) takes as input either a `.circom` file or a `.r1cs` file. 
The tool then returns one of the following status

- `safe` (exit code 8): the circuit is guaranteed to not be underconstrained.
- `unknown` (exit code 0): the tool can't make any guarantee, but also can't find any counterexample.
- `unsafe` (exit code 9): the circuit is underconstrained. In this case, Picus (Circom) can additional output two witness files (`.wtns`) as counterexamples.

Picus (Circom) is based on a research paper [_Automated Detection of Under-Constrained Circuits in Zero-Knowledge Proofs_](https://dl.acm.org/doi/abs/10.1145/3591282) (PLDI 2023). 


## Getting Started 

For instructions on how to get started with running Picus (Circom), checkout [the guide here](getting_started/running_picus_through_saas.md).

