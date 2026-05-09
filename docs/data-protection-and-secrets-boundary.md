# SkyGrid Data Protection and Secrets Boundary

SkyGrid is intended to operate as an AI-assisted network switching, continuity, and support layer. Because workloads may involve organizations such as hospitals, schools, API providers, and AI infrastructure teams, the default posture must be privacy-preserving and secrets-safe.

## Default Classification

SkyGrid nodes must classify every workload before routing:

| Class | Examples | Home-node eligibility |
|---|---|---|
| Public | public docs, website assets, open data, status pages | allowed |
| Synthetic | test datasets, generated fixtures, mock payloads | allowed |
| Operational non-sensitive | uptime checks, public endpoint health, aggregate metrics | allowed |
| Confidential | internal logs, business records, non-public configs | restricted |
| PII/PPI | names, addresses, phone numbers, emails, payment identifiers | restricted / sanitized only |
| PHI | patient data, clinical records, identifiers tied to health data | not allowed without formal compliance design |
| Secrets | API keys, tokens, private keys, passwords, session cookies | never allowed on home nodes |

Note: PPI/PII are treated as protected personal data. PHI requires healthcare-specific controls.

## Hard Rules

1. No private keys on home nodes.
2. No raw API secrets on home nodes.
3. No PHI on home nodes without a formal compliant architecture.
4. No student/minor private data without written authorization and controls.
5. No sensitive customer AI data routed to volunteer or residential nodes.
6. Home nodes may process public, synthetic, non-sensitive, or fully anonymized workloads only.
7. Every route must be logged with workload class, destination class, and approval mode.

## AI Network Switching Controls

AI routing agents may recommend or select routes only after applying policy checks:

- data classification
- destination trust level
- encryption requirement
- allowed workload type
- jurisdiction/region rule if applicable
- audit logging requirement
- fail-closed behavior when classification is uncertain

If classification is uncertain, SkyGrid must treat the data as sensitive and avoid home-node routing.

## Secrets Handling

Secrets must remain in approved secret managers, such as:

- AWS Secrets Manager
- AWS Systems Manager Parameter Store
- GitHub Actions Secrets
- Postman Vault or environment secret storage
- Cloudflare secrets
- other approved enterprise secret stores

Secrets must be referenced by name, not copied into node logs, prompts, public files, dashboards, or operator chats.

## Token and Wallet Safety

- never request seed phrases
- never store private keys in repository files
- never paste live tokens into chat or public docs
- rotate any token that is exposed
- use least-privilege tokens
- prefer read-only tokens for monitoring
- use short-lived credentials where possible

## Encryption Coverage

Minimum expectations:

- TLS in transit for all APIs
- encrypted storage for central logs
- signed artifacts for proof files where possible
- hashes for audit artifacts
- no plaintext secrets in logs
- no sensitive payload retention by default

## Home-Based Node Eligible Workloads

Allowed:

- uptime probes
- public website mirroring
- public model/demo assets
- synthetic API test data
- generated educational content without student identifiers
- aggregate metrics
- community event status
- non-sensitive validator status

Not allowed by default:

- patient records
- student records
- private messages
- live credentials
- raw payment data
- private customer prompts
- proprietary datasets without approval

## Compliance Roadmap

Before handling regulated or sensitive data, SkyGrid needs:

1. written data classification policy
2. data processing agreement template
3. security incident response plan
4. access control policy
5. audit log retention policy
6. vendor/subprocessor list
7. HIPAA review for healthcare
8. FERPA/COPPA review for education involving minors
9. SOC 2-style controls roadmap for enterprise trust

## Safe Positioning Statement

SkyGrid can support AI-routed network switching and distributed continuity for public, synthetic, anonymized, or approved non-sensitive workloads. Sensitive data, PII/PPI, PHI, secrets, tokens, and private keys must remain inside controlled environments and must not be routed through home-based nodes without formal compliance controls and written authorization.
