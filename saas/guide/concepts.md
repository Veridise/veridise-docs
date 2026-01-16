---
title: Concepts
sidebar_position: 1
---

AuditHub helps users manage `projects`. Each project definition contains the metadata that AuditHub requires to facilitate usage of its security tools against it. 
For each project, the user creates a `version`, uploading a snapshot of the project's source code. 
Then the user can start a `task` using one of the offered security tools, to either statically or dynamically analyze the specific version of this project, and produce `findings`.
Each finding is a potential security vulnerability, that the user can manage and either characterize as a true positive, or opt to ignore.

AuditHub organizes projects inside organizations. Thus, an organization may contain multiple projects. Users are granted access to an organization, and can work with the projects within. A user may have access to multiple organizations, but can only have one of them active at any time.

Moreover, for security companies, AuditHub is a comprehensive audit facilitation platform. Besides the offered security tools, AuditHub allows users to collaborate while reviewing the source code code a project, and define and manage security `issues`. These issues are reported by the auditors to the project's developers from within AuditHub, which allows the two parties to further collaborate on addressing these issues. The final list of issues is attached to the Audit Report.

ß