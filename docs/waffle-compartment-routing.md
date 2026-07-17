# SkyGrid Waffle Compartment Routing Policy

SkyGrid uses a simple compartment model for AI-assisted network switching:

> Like a waffle, every square holds its own contents. Syrup, butter, and toppings stay in the cubbyhole they belong in.

This policy translates that idea into routing logic for data, secrets, AI workloads, and home-based nodes.

## Core Principle

Each workload is placed into a compartment before routing. Data must not leak between compartments unless an explicit, logged, approved bridge exists.

## Compartments

| Compartment | Contents | Default routing |
|---|---|---|
| Public | website assets, public docs, open data | home/edge nodes allowed |
| Synthetic | mock data, generated fixtures, test payloads | home/edge nodes allowed |
| Operational | uptime, metrics, aggregate status, non-sensitive logs | approved edge/cloud nodes |
| Confidential | internal plans, private business records, unpublished configs | controlled cloud only by default |
| PII/PPI | personal identifiers, contact data, payment identifiers | sanitized or controlled cloud only |
| PHI | patient/clinical data | formal healthcare compliance only |
| Student/minor data | student records, private education data | formal education compliance only |
| Secrets | API keys, tokens, passwords, private keys, session cookies | secret manager only, never routed |

## Waffle Rules

1. Every packet/workload gets a compartment label before routing.
2. Unknown classification defaults to the most restrictive compartment.
3. Secrets never leave approved secret managers.
4. PHI never goes to home-based nodes.
5. Student/minor private data never goes to home-based nodes without formal controls.
6. PII/PPI must be minimized, masked, tokenized, or kept in controlled cloud environments.
7. Public and synthetic data may use home/edge capacity.
8. Bridges between compartments require explicit policy, logging, and approval.
9. AI agents may recommend routes, but policy decides whether the route is allowed.
10. When in doubt, fail closed.

## AI Routing Flow

```text
Incoming workload
  -> classify compartment
  -> check destination trust level
  -> check policy bridge permission
  -> route if allowed
  -> log route decision
  -> fail closed if uncertain
```

## Destination Types

| Destination | Suitable compartments |
|---|---|
| Home node | public, synthetic, limited operational |
| Community edge node | public, synthetic, limited operational |
| Cloud managed node | operational, confidential with controls |
| Regulated environment | PHI, student/minor data, sensitive PII |
| Secret manager | secrets only |

## Bridge Types

A bridge may allow limited movement between compartments only when defined:

- public artifact bridge
- synthetic test bridge
- metrics aggregation bridge
- anonymization bridge
- tokenization bridge
- compliance-approved regulated bridge

No implicit bridge exists.

## Operator-Friendly Summary

- Public syrup can flow to the public square.
- Synthetic butter can go to test squares.
- Secrets stay sealed in the pantry.
- Patient, student, and private identity data stay in protected containers.
- AI may suggest a path, but the waffle grid decides where the data belongs.

## Safe Positioning Statement

SkyGrid uses compartment-based routing to prevent sensitive data from leaking into inappropriate nodes. Home-based nodes are reserved for public, synthetic, and approved non-sensitive workloads, while secrets and regulated data remain in controlled environments.
