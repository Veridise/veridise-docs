---
title: Tutorials
sidebar_position: 30
---

## Exercise: investigating project-specific access controls

One common category of issues is access controls, which is especially important
for large protocols such as the one in an
[example project](https://github.com/Veridise/DSS-Buggy-DeFi-Code-November-2025) that we have
prepared for this exercise.
In particular, this project uses a combination of OpenZeppelin ownable contracts
as well as custom ownership logic (see `CoreOwnable`).

Using custom detectors, we can do a quick check to see which functions are
missing access controls. This proceeds in a few steps:

First, we should determine which (concrete) contracts define an `owner` function:

```
FIND Contract c WHERE
  c.isContract,
  regexMatch(c.filepath, "src/.*"),
  EXISTS Function f IN c WHERE { f.name == "owner" }
```

Vanguard reports that over 50 such contracts exist.

Second, we need to know which external functions may write to storage with the
owner function called at some point (including in nested internal function
calls):

```
FIND
  Contract c,
  Function f IN c,
WHERE
  c.isContract,
  regexMatch(c.filepath, "src/.*"),
  EXISTS Function ownerFun IN c WHERE { ownerFun.name == "owner" },

  f.isExternallyCallable,
  (EXISTS StorageWrite w IN f.reachable),
  EXISTS InternalCall ownerCall IN f.reachable WHERE { ownerCall.callee.name == "owner" }
```

The results include at least 14 functions which do so, including several
"setter" functions and ownership management functions.

How about the functions that do NOT invoke the owner function?

```
FIND
  Contract c,
  Function f IN c,
WHERE
  c.isContract,
  regexMatch(c.filepath, "src/.*"),
  EXISTS Function ownerFun IN c WHERE { ownerFun.name == "owner" },

  f.isExternallyCallable,
  (EXISTS StorageWrite w IN f.reachable),
  !EXISTS InternalCall ownerCall IN f.reachable WHERE { ownerCall.callee.name == "owner" }
```

This unfortunately ends up flagging over 100 functions, including some functions
that are already marked with `onlyOwner` modifiers. Upon inspection, these are
functions that extend from the `CoreOwnable` contract, whose `onlyOwner`
directly reads from an immutable `owner` variable; hence there are no storage
reads.

We can work around this by excluding contracts that inherit from `CoreOwnable`:

```
FIND
  Contract c,
  Function f IN c,
WHERE
  c.isContract,
  regexMatch(c.filepath, "src/.*"),
  EXISTS Function ownerFun IN c WHERE { ownerFun.name == "owner" },
  !EXISTS Contract super IN c.superClasses WHERE { super.name == "CoreOwnable" },

  f.isExternallyCallable,
  (EXISTS StorageWrite w IN f.reachable),
  !EXISTS InternalCall ownerCall IN f.reachable WHERE { ownerCall.callee.name == "owner" }
```

The results have then been reduced us to 26 functions which should be inspected
for access controls, which is much more manageable.
