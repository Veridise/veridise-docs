---
title: Organizations
sidebar_position: 4
---

In AuditHub, an `organization` is the top-level workspace. It groups the users, projects, and shared configuration needed to run security tools and collaborate during an audit or review.

A user can belong to multiple organizations, but only one is active at a time in the UI. See [Organizations](/saas/guide/pages/organizations) for how to select or switch your active organization.

## Why organizations matter

An organization:
- Defines the collaboration boundary: members can see and work on the same projects.
- Scopes access control: permissions, roles, and membership apply at the organization level.
- Scopes project data: projects, versions, tasks, findings, issues, and threads live inside an organization.
- Holds shared configuration used by tools (e.g., organization-wide libraries of [V] specs, hints, and detectors).

## What an organization represents

Conceptually, an organization can be associated with a real team or entity working on one or more codebases (e.g., an audit firm, a protocol team, or a client team). It is the "container" for all work in AuditHub:
- [Projects](/saas/guide/concepts/projects)
- [Versions](/saas/guide/concepts/versions)
- [Tasks](/saas/guide/concepts/tasks)
- [Findings](/saas/guide/concepts/findings)
- [Issues](/saas/guide/concepts/issues)
- [Threads](/saas/guide/concepts/threads)

## Organization model

The organization model is defined by what AuditHub currently uses. Key attributes include:

### Identity

- `name`: The organization name.

### Limits

- `user_limit` (optional): The maximum number of users allowed in the organization (support users may not count toward this limit).

For managing members and invitations, see [User Management](/saas/guide/pages/organization_settings/user_management).

### Shared tool configuration

Organizations can maintain shared libraries used by tools, such as [V] specs, hints, or custom detectors. See [Tool Configuration](/saas/guide/pages/organization_settings/tool_configuration) for more details.
