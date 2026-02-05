---
title: Picus Constraint Language
sidebar_position: 3
---

# Picus Constraint Language Documentation

## 1. Introduction
The Picus Constraint Language (PCL) is intended to express constraints used in zero knowledge circuits. Constraints in this language are effectively polynomial equations over a finite field (modulo range constraints) which represent some computation. They can be provided as input to Picus v2 to check if they encode deterministic computation. 

## 2. Basics

### Key Concepts
- **Modules**: Encapsulate logical constraints.
- **Inputs/Outputs**: Define input and output signals (aka variables).
- **Assumptions**: Assumptions over the inputs such that if the assumptions hold, then the circuit should be deterministic. 
- **Assertions**: Establish the constraints over signals.
- **Lookups**: Asserts that a set of signals $v_1, ..., v_n$ belong to a set of lookup tables $t_1, ..., t_n$.
- **Calls**: A call $(o_1,  \dots, o_n) = M(i_1, \dots i_m)$ declares signals $o_1, \dots, o_n$ are the outputs of a module $M$ when instantiated with inputs $i_1, \dots, i_m$. This is a useful construct because if Picus can prove that 1) $M$ is deterministic, 2) can  determine that $i_1, \ldots, i_m$ are also deterministic, 3) Can prove the inputs satisfy any determinism assumptions made in $M$,  then it can safely assume all $o_1, \ldots, o_n$ are also deterministic.
- **Post conditions**: Formulas over input and output variables that should be entailed by the constraints.


### Syntax Overview

Constructs in the Picus language are expressed as [S-Expressions](https://en.wikipedia.org/wiki/S-expression).

- Modules are defined using `(begin-module <name>)` and `(end-module)`.
- Inputs and outputs are declared with `(input <name>)` and `(output <name>)`.
- Assertions use `(assert (<condition>))` to define logical expressions.
- Assumptions use `(assume (<condition>))` to define assumptions
- Calls are expressed as `(call [outvar_1, ..., outvar_n] <call-name> [invar_1, ..., invar_m])`
- Lookups are expressed as `(lookup [v_1, .., v_n] [t_1, ..., t_n])` to assert that each `v_i` belongs to table `t_i`.
- Postconditions use `(post-condition (<condition>))`

## 3. Declaring a Module

To declare a module:
```lisp
(begin-module ModuleName)
...
(end-module)
```

## 4. Prime Number Declaration
Defines the finite field that all signals/variables belong to. As such, all arithmetic expressed in constraints will be done modulo this field.

```lisp
(prime-number 2013265921)
```

## 5. Inputs and Outputs
### Declaring Inputs

```lisp
(input len0)
```

Inputs represent values that are provided to the module.

### Declaring Outputs
```lisp
(output out0)
```

Outputs are the signals which are result of the underlying computation.

## 6. Assertions

Each assertion represents a constraint defined by the module. For example:

```lisp
(assert (= (* var1 (- 1 var1)) 0))
```

expresses a constraint that `var` is either 1 or 0. Constraints are not limited to polynomial equalities as Picus supports comparisons like:

```lisp
(assert (< var1 var2))
```

The meaning of such comparisons are that $var1 \mod p < var2 \mod p$ where $p$ is the prime specified in the module.

Picus additionally supports boolean combinations of predicates with operators like `&&` (conjunction), `||` (disjunction), `=>` (implication), and `<=>` (if and only if).

## 7. Builtin Predicates
In addition to standard predicates `=`, `<`, etc., Picus has custom builtin predicates for proving determinism. 

- The `det` predicate takes as input an expression and returns true if it is deterministic. 

## 7. Detailed Example: BuggyExample Module

Here is an extended example with annotations
```lisp
(prime-number 2013265921) ; Defines the prime modulus for operations

(begin-module BuggyExample) ; Starts the module 'BuggyExample'

(input len0) ; Input declaration
(output high1) ; Output declaration
(output low22)
(output isZero12)
(output isZero14)
(output var_0_0_4)
(output DecomposeLow2_out15)

; Assertions to define relationships and logical constraints
(assert (= (* var_0_0_4 (- 1 var_0_0_4)) 0))
(assert (= (* var_0_1_6 (- 1 var_0_1_6)) 0))
(assert (= (* var_0_2_8 (- 1 var_0_2_8)) 0))
(assert (= (* var_0_3_10 (- 1 var_0_3_10)) 0))
(assert (= (+ (+ (+ (+ 0 var_0_0_4) var_0_1_6) var_0_2_8) var_0_3_10) 1))
(assert (= (+ (+ (+ (+ 0 (* var_0_0_4 0)) (* var_0_1_6 1)) (* var_0_2_8 2)) (* var_0_3_10 3)) low22))
(assert (= (* isZero12 (- 1 isZero12)) 0))
(assert (= (* high1 inv13) (- 1 isZero12)))
(assert (= (* isZero12 high1) 0))
(assert (= (* isZero12 inv13) 0))
(assert (= (* isZero12 var_0_0_4) isZero14))
(assert (= DecomposeLow2_out15 (+ (+ var_0_1_6 var_0_2_8) var_0_3_10)))

(end-module) ; Ends the module
```

## Grammar

Putting everything together, here is the grammar for the PCL.

```bnf
<program> ::= <prime-declaration> <modules> | <prime-declaration> <modules> <fixed>

<prime-declaration> ::= "(prime-number" <integer> ")"

<fixed> ::= "(fixed " {<lookup>}+ ")"

<lookup> ::= "[" <constants> "]"

<modules> ::= {<module>}+
<module> ::= "(begin-module" <module-name> ")" <declarations> <assumptions> <assertions> "(end-module)"

<declarations> ::= {<input-declaration> | <output-declaration> }*

<input-declaration> ::= "(input" <identifier> ")"
<output-declaration> ::= "(output" <identifier> ")"

<assumptions> ::= {<assumption>}*

<assertions> ::= {<assertion>}*

<condition> ::= "(=" <expression> <expression> ")"
                | "(!=" <expression> <expression> ")"
                | "(<" <expression> <expression> ")"
                | "(<=" <expression> <expression> ")"
                | "(>" <expression> <expression> ")"
                | "(>=" <expression> <expression> ")"
                | "(det <expression> ")"
                | "(<=>" <condition> <condition> ")"
                | "(=>" <condition> <condition> ")"
                | "(&&" <condition> <condition> ")"
                | "(||" <condition> <condition> ")"

<assertion> ::= "(assert" <condition> ")" | <call-assertion>

<assumption> ::= "(assume" <condition> ")"

<call-assertion> ::= "(call [" <identifiers> "]" <identifier> "(" <identifiers> ")"

<lookup-assertion> ::= "(lookup" "[" <identifiers> "]" "[" <constants> "])"

<expression> ::= <term>
               | "(*" <expression> <expression> ")"
               | "(+" <expression> <expression> ")"
               | "(-" <expression> <expression> ")"

<term> ::= <identifier>
         | <integer>
         | <constant>

<module-name> ::= <identifier>
<identifiers> ::= <identifier> " " <identifiers> | "" 
<identifier> ::= [a-zA-Z_][a-zA-Z0-9_]*

<constants> ::= <constant> " " <constants> | ""
<constant> ::= "0" | "1"

<integer> ::= <digit> {<digit>}*
<digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

```