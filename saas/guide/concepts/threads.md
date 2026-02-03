---
title: Threads
sidebar_position: 9
---

<!-- AUDITING-FEATURES: start -->
In AuditHub, a `thread` is a discussion anchored to a specific place in the codebase. Threads help auditors and developers collaborate while reviewing a project by capturing questions, notes, and decisions directly next to the relevant source context.

Threads are tied back to the project and version you are reviewing, and they provide a lightweight way to discuss code without turning every comment into a tracked [issue](/saas/guide/concepts/issues).

## Why threads matter

A thread:
- Keeps discussion close to the code by attaching it to a specific file and line (or line range).
- Preserves context and decisions across the team, so review conversations don’t get lost.
- Makes review faster through navigation features like "go to line" and line-based filtering.
- Supports collaboration patterns like questions, status updates, and follow-up actions.

## What a thread represents

Conceptually, a thread represents:
- A topic of discussion anchored to a source location in a project version.
- A set of messages posted over time by participants.
- A status indicating whether the topic is still active or already resolved.

Threads are visible to all members of the organization who have access to the project.

## Thread model

The thread model is defined by what AuditHub currently uses. Key attributes include:

### Core fields

- **Type**: Threads are either **notes** (general observations/documentation) or **questions** (requests for clarification or help).
- **Title**: A short summary of the discussion topic.
- **Description**: The initial message/context for the thread.
- **Location**: The referenced file and line number (or range) in the codebase.

### Messages and collaboration

- Threads support follow-up messages to continue the conversation. Messages appear in chronological order.
- Participants can tag groups in messages (e.g., **@auditors** and **@developers**).
- Threads can reference issues by linking to them in messages.
- Thread links can be copied and shared.
- Message content can be copied for use elsewhere.

#### Message model

Each thread message captures:
- **Author**: The user who posted the message.
- **Timestamp**: When the message was posted.
- **Text**: The message content.

Messages may be edited or deleted, and AuditHub keeps the thread conversation anchored to the same source location.
AuditHub also preserves the message timeline (comments history) for each project version.

### Filtering and navigation

- Threads can be filtered by source location (line-based filtering) to show only discussions relevant to a specific area of code.
- Opening a thread can take you directly to the referenced source location.

### Notifications and resolution

- You can configure notification preferences for thread messages (included in digest emails).
- Threads can be marked as **resolved** when they are no longer needed.

## Where to view and manage threads

Threads are managed in the **Audit Issue Management** view of the project viewer. See:
- [Audit Issue Management](/saas/guide/pages/projects/project_viewer/audit_issue_management)
<!-- AUDITING-FEATURES: end -->
