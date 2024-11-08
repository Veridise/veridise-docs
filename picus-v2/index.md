---
title: Picus v2 Overview
sidebar_position: 1
---

# Picus V2

Picus V2, referred to as V2 in the rest of this document, is a successor to our tool Picus and checks if a ZK Circuit is deterministic. A major difference between V2 and the original Picus is that V2 defines its own constraint language (Picus Constraint Language) and verifies circuits written in that language. As such, V2 can verify any circuit which has been translated into its language. When V2 checks a circuit there are three possible outcomes:

- `verified`: the circuit is guaranteed to be deterministic.
- `unknown`: the tool can't make any guarantee, but also can't find any counterexample.
- `unsafe`: the circuit is provably nondeterministic. In this case, Picus can additional output two distinct witnesses that satisfy the constraints.


## Getting Started 

For instructions on how to get started with running Picus, checkout [the guide here](getting_started/running_picusv2_through_saas.md).

## Picus Constraint Language 

Detailed information on the Picus constraint language can be found [here](./picus_constraint_language/picus_constraint_language.md).

