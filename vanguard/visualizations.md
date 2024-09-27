---
title: Visualizing Vanguard Analyses
sidebar_position: 6
---

The analyses run by Vanguard can be visualized in graphical form through a
special user interface on AuditHub, which can be useful for gaining insights
about the code being analyzed.

## Supported Visualizations

The following detectors produce analysis result files that are compatible with
the visualization tool:


| Detector                         | File name                                 |
|----------------------------------|-------------------------------------------|
| Generate Intracontract Callgraph | results/dump-intracontract-callgraph.json |

## Usage

1. In AuditHub, create a Vanguard task as described in the
   [Getting Started guide](./getting-started.md).
2. Go to the task results page and download the files corresponding to the
   supported detectors in the above table.
3. Open https://vanguard-vis-poc.veridise.tools/ in your internet browser.
4. Select your analysis result file(s) and click "Render" to view the
   visualization.
