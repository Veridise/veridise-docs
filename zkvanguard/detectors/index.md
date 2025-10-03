---
title: Detectors
sidebar_position: 2
---

import {DisplayDetectorCards} from '@site/src/components/vanguard/DetectorTypeUtils';

ZK Vanguard is equipped with the following set of detectors and general analysis tools:

<!-- These header links are required so backlinks redirect to the correct header. -->
## Compute and Constrain Detectors {#compute-constrain}

These detectors operate on both witness-generation operations and constrain operations in the circuit.

<DisplayDetectorCards docIds={["detectors/compute-constrain-difference", "detectors/out-of-range-signals", "detectors/private-input-leakage", "detectors/unused-fields"]}/>

## Compute-Only Detectors {#compute-only}

These detectors identify issues specific to witness generation.

<DisplayDetectorCards docIds={["detectors/divide-by-zero", "detectors/signal-dependent-control-flow"]}/>

## Constrain-Only Detectors {#constrain-only}

These detectors identify issues specific to circuit constraints.

<DisplayDetectorCards docIds={["detectors/unconstrained-signals", "detectors/underconstrained-outputs"]}/>