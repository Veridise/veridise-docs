---
sidebar_position: 3
---

## Under-Constrained Outputs (`uc-outputs`)

### Summary and Usage

The Under-Constrained Output (UCO) detector finds under-constrained output vulnerabilities in ZK circuit code.
The UCO detector looks to see if a used output from a component is constrained either by an input value or a single constant value---if neither is true, then the output is not constrained and can result in a vulnerability, as a malicious actor may be able to create valid proofs for bogus statements when outputs are unconstrained.
The UCO detector can be invoked when running ZK Vanguard on the command-line with the argument `--detector uc-outputs` or by adding "Under-constrained outputs" (`uc-outputs`) to the Detectors selection on ZK Vanguard's Configuration Step on Veridise's SaaS platform.

### Example and Explanation

```circom title="uco_bug.circom"
pragma circom 2.0.0;

template LowestBitIsOne() {
  signal input inp;
  signal output outp;

  outp <-- inp & 1;
  outp * (outp - 1) === 0;
}

component main = LowestBitIsOne();
```

In this example, `outp` is assigned to `inp & 1`, but is not constrained by the input `inp`, which is flagged as a UCO bug.
The constraint `outp * (outp - 1) === 0` may be satisfied by the assignment `outp = 0` or `outp = 1` regardless of the value of `inp`, allowing the
attacker to forge arbtrary proofs of the form `{inp = <any value>, outp = <0 or 1>}`.

<details>
<summary>Vanguard Command and Output</summary>

```shell title=Shell Command
vanguard_driver --detector=uc-outputs uco_bug.circom
```

```txt title=Output
----Preprocessing sources----
Running circom...
Done running circom
----Running Vanguard with uc-outputs detector----
Running detector: uc-outputs
============================================================================
 Vanguard's unconstrained output signal detector found the following issue:
============================================================================
[CRITICAL] In template LowestBitIsOne in uco_bug.circom:3, Vanguard found an output signal that is unconstrained:
  * Signal outp
```

</details>
