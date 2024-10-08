---
title: Visualizing Vanguard Analyses
sidebar_position: 6
---

:::warning
These features are experimental and subject to change.
:::

The analyses run by Vanguard can be visualized in graphical form through a
special user interface on AuditHub, which can be useful for gaining insights
about the code being analyzed.

## Supported Visualizations

The following detectors produce analysis result files that are compatible with
the visualization tool:


| Detector                         | File name                                 |
|----------------------------------|-------------------------------------------|
| Generate Intracontract Callgraph | results/dump-intracontract-callgraph.json |
| Generate Intercontract Callgraph | results/dump-callgraph.json |
| Generate Currency Value Flow Graph | results/dump-currency-value-flow-graph.json |

## Usage

1. In AuditHub, create a Vanguard task as described in the
   [Getting Started guide](./getting-started.md).
2. Go to the task results page and download the files corresponding to the
   supported detectors in the above table.
3. Open https://vanguard-vis-poc.veridise.tools/ in your internet browser.
4. Select your analysis result file(s) and click "Render" to view the
   visualization.

## More Details

### Generate Intracontract Callgraph

#### Contract View
- This view includes nodes for each function within the contract.
- There are edges corresponding to internal calls between functions in the contract.
- This view can be used to understand how the different functions within a contract work
  together and to see which execution flows are possible when users call externally visible
  functions.

##### Options
- Select External: This will select all externally visible functions in the graph.

### Generate Currency Value Flow Graph

#### Contract View
- This view includes nodes for each ERC20 transfer/approve and for each involved address 
  within the contract.
- There are edges from the address sending funds to the transfer node and an edge from each
  transfer node to the recipient of the transfer.

##### Options
- Show Amounts: Includes nodes for values that influence the amount of funds transferred and edges
  between such nodes and the transfer whose amount is influenced.
- Show Writes: Includes edges from each transfer whose params are used to influence the value of a storage
  variable to that storage variable.
- Show Addresses: Toggled on by default. Shows address nodes corresponding to the "to" and "from" parameters of 
  a transfer.

### Generate Intercontract Callgraph

#### Whole Protocol View
- This view contains nodes for each contract in the project and for each external call
  selector targeted by calls within the project
- For each contract, there are outgoing edges to each external call selector targeted
  by calls within the contract and incoming edges from each external call selector for 
  which the contract has defined a potential target (note: this may include fallback or 
  receive functions).
- This view is intended to show how the different contracts within a project interact with
  each other at a high level.

##### Options
- Hide Selectors: Hides selector nodes from the view and includes edges between contracts that
  may call each other.

#### Contract View
- This view is an enhanced version of the Intracontract callgraph. It contains information about 
  all the internal calls within each contract as well as edges from functions in the contract to 
  external call selectors targeted by calls within that function. 
  - Selecting a node in this view will display additional information about the given function/selector.
    For example, selecting a selector node will list all potential targets of that selector within the 
    project (note: the target of the call may also be defined outside of the project).
