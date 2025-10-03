---
title: Detectors
sidebar_position: 2
---

import {DisplayDetectorCards} from '@site/src/components/vanguard/DetectorTypeUtils';

ZK Vanguard is equipped with the following set of detectors and general analysis tools:

<!-- These header links are required so backlinks redirect to the correct header. -->
## Compute and Constrain Detectors {#compute-constrain}

These detectors operate both on witness-generation and constrain operations in the circuit.

<DisplayDetectorCards docIds={["detectors/private-input-leakage", "detectors/unused-subcmps"]}/>

## Compute-Only Detectors {#compute-only}

These detectors target issues specific to witness generation.

<DisplayDetectorCards docIds={["detectors/non-det-wit", "detectors/zk-divide-by-zero"]}/>

## Constrain-Only Detectors {#constrain-only}

These detectors target issues specific to circuit constraints.

<DisplayDetectorCards docIds={["detectors/uc-inputs", "detectors/uc-outputs", "detectors/uc-subcmp-inputs", "detectors/uc-subcmp-outputs"]}/>
