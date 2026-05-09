# SkyGrid Airtable Routing Map

This document records the Airtable base and table routing for the SkyGrid GitHub Actions sync.

## Current Base

Base name: `Skygrid IT Project Tracker`

Base ID:

```text
appg4cfKNcNqOtOdd
```

## Available Tables

| Table | Table ID | Purpose |
|---|---|---|
| Projects | `tblqpwPkbnNPFx2js` | Central project hub for project status, priority, deadlines, owners, and completion. |
| Tasks | `tblMOg5MmjSN5JFxv` | Task tracking linked to projects, milestones, dependencies, and assignees. |
| Team Members | `tblHpP3nnaXfwVxMk` | Directory of team members, roles, emails, availability, and assignments. |
| Milestones | `tblM2FiIZA7qfTOjC` | Major project milestones, due dates, owners, status, and completion. |
| Phenomena Log | `tblvLH5Oq0PuxTlnd` | Structured observation log for research notes and evidence-backed observations. |

## Workflow Routing Recommendation

The current workflow should not use `Table 1` for this base. The SkyGrid project tracker uses named tables.

Recommended default for GitHub Actions sync:

```text
AIRTABLE_TABLE=Projects
```

Recommended GitHub Actions repository secrets:

```text
AIRTABLE_API_KEY=<Airtable personal access token>
AIRTABLE_BASE_ID=appg4cfKNcNqOtOdd
```

Recommended GitHub Actions repository variable:

```text
AIRTABLE_TABLE=Projects
```

## Why the Workflow Failed

The failing workflow showed:

```text
secrets.AIRTABLE_API_KEY => null
secrets.AIRTABLE_BASE_ID => null
AIRTABLE_TABLE=Table 1
```

Because the token and base ID were empty, the workflow constructed a malformed Airtable URL. Because the table was also set to `Table 1`, it would still be wrong for the SkyGrid IT Project Tracker even after the secrets are added.

## Correct Route

```text
https://api.airtable.com/v0/appg4cfKNcNqOtOdd/Projects
```

The workflow should URL-encode the table name and must never print secrets.

## Safer Sync Rule

Before calling Airtable, the workflow must validate:

1. `AIRTABLE_API_KEY` exists.
2. `AIRTABLE_BASE_ID` exists.
3. `AIRTABLE_TABLE` exists.
4. `AIRTABLE_TABLE` is one of the known table names or table IDs for the configured base.

If any validation fails, the workflow should fail closed with a clear GitHub Actions error.
