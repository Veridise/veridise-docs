---
title: Triaging Findings
sidebar_position: 4
---

In this page, we will explain how to triage findings reported by Vanguard.
We first start with some background information on what different finding
classifications mean (e.g., true positive vs false positive).
The second half of this page explains how to triage findings using the code
viewer interface.

## Soundness vs Completeness

Because it is theoretically impossible to create a static analysis tool that can
detect all vulnerabilities with perfect accuracy in general, tool authors need
to make a trade-off between (1) the degree to which the analyzer is confident
that a given program is free from vulnerabilities (_soundness_) and (2) the
degree to which the issues found are actual vulnerabilities (_completeness_).
In plain words, a _sound_ tool is always correct when it says that there are no
vulnerabilities (but may raise false alarms on some programs), and a _complete_
tool is always correct about the things it says are vulnerabilities (but it may
miss some legitimate vulnerabilities).

The principle behind Vanguard's design is that it is better to alert the user to
potential vulnerabilities---even if some of those may be false alarms---rather
than risk the possibility of missing a vulnerability.
That is, Vanguard's detectors are designed to be closer to the soundness part of
the spectrum rather than the completeness part of the spectrum.
To make up for the shortcoming of having false alarms, we provide the user with
tools that can effectively classify the findings and remove all false alarms, so
only legitimate vulneabilities remain.

:::tip

If you would like to learn more soundness and completeness, an excellent article
on the subject can be found [here][soundness-completeness-article].

:::

## Finding Classifications

When a finding is reported by Vanguard, it can fall into one of the following
categories:

* A _true positive_ (TP) finding is one that is reported by Vanguard and _is_ an
  actual vulnerability.
  Such findings must be treated seriously.
* A _false positive_ (FP) finding is one that is reported by Vanguard but is
  _not_ an actual vulnerability.
  Such a finding may be invalid or has no security impact.
* A _false negative_ finding is one that is an actual vulnerability that is _not_
  reported by Vanguard (i.e., a vulnerability missed by Vanguard).

Since it is only possible to triage issues that are reported, we will only care
about TP and FP findings.

## Using the Triage Interface

:::info

This section of the documentation is still being written.
:::

The main interface for triaging issues is the code viewer.

A table of all findings reported by Vanguard will be shown at the bottom left
panel.
Each row will show the detector that produced the finding, the estimated
severity, and the current classification of the finding.

Clicking on a finding will show the detailed description of the finding.
You can click on various entities within the description (such as location
information or variable names) in order to jump to the corresponding locations
or declarations.

### Classifying Findings

The top part of the finding details panel contains a dropdown menu labeled
"Actions".
You can apply an action to mark a finding as TP or FP, or to remove irrelevant
details from one or more findings.
Every action requires the user to write a comment justifying why a finding is
being classified or modified.

The "history" of the applied actions can be displayed by clicking on the history
bar at the top of the findings table panel.
Here, you will be able to see what actions were applied in response to which
findings, who applied the actions, and the justifications.
This is helpful for undoing errorneously applied actions, or for performing a
post-mortem after a security breach.

[soundness-completeness-article]: https://cacm.acm.org/blogcacm/soundness-and-completeness-defined-with-precision/
