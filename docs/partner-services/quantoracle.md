# QuantOracle Partner Service Candidate

SkyGrid may integrate QuantOracle as a deterministic financial computation service for agentic routing, validator modeling, treasury projections, portfolio risk, staking/yield estimates, and exchange-support workflows.

Repository: https://github.com/QuantOracledev/quantoracle
Website/API: https://quantoracle.dev and https://api.quantoracle.dev

## What QuantOracle Provides

QuantOracle describes itself as a quantitative computation API for autonomous financial agents. Its README states that it provides 63 deterministic, citation-verified calculators plus 10 composite workflows, with 1,000 free calls per day and pay-per-call support on Base or Solana.

## SkyGrid Use Cases

Potential SkyGrid integrations:

1. validator yield projections
2. staking and restaking risk calculations
3. treasury rebalancing models
4. portfolio health reports
5. DeFi slippage estimates
6. impermanent loss estimates
7. liquidation risk checks
8. Monte Carlo projections
9. Kelly sizing for risk-controlled allocation
10. deterministic financial math for AI agents

## Agent Integration

QuantOracle exposes API and agent-friendly discovery surfaces, including:

- REST API
- OpenAPI spec
- MCP server
- CLI
- x402 payment discovery

SkyGrid agents should use deterministic services such as QuantOracle for financial math instead of relying on in-context LLM calculations.

## Payment / Network Fit

QuantOracle supports x402-style micropayments and advertises Base and Solana settlement paths. This aligns with SkyGrid's multi-network model and makes it a useful candidate for testing:

- Base-aligned agent payment flows
- Solana-compatible high-frequency agent calls
- API generator workflows
- pay-per-call financial computation

## Data Protection Boundary

QuantOracle should receive only the minimum numeric inputs required for calculations.

Do not send:

- secrets
- private keys
- seed phrases
- raw customer PII/PPI
- PHI
- student/minor records
- confidential business records unless approved

Preferred data classes:

- public market numbers
- synthetic test data
- anonymized portfolio weights
- aggregate validator metrics
- non-sensitive treasury projections

## Integration Status

Current status: `candidate`

This document does not claim a formal partnership, endorsement, or integration approval from QuantOracle. It records technical fit and intended evaluation within the SkyGrid ecosystem.

## Next Steps

1. Review QuantOracle OpenAPI spec.
2. Create Postman collection for selected endpoints.
3. Add safe sample payloads using synthetic validator data.
4. Test free-tier calls.
5. Evaluate x402 payment flow compatibility with Base/Solana.
6. Document response schemas for dashboard use.
7. Move status from `candidate` to `active_model` only after test artifacts exist.
