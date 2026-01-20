---
id: 011
title: AuthZ Architecture Plan
stage: plan
date: 2026-01-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-aware-todo
branch: 001-auth-aware-todo
user: claude
command: sp.plan
labels: [authorization,security,todo,isolation,architecture]
links:
  spec: ../specs/001-auth-aware-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-auth-aware-todo/plan.md
 - specs/001-auth-aware-todo/research.md
 - specs/001-auth-aware-todo/data-model.md
 - specs/001-auth-aware-todo/quickstart.md
 - specs/001-auth-aware-todo/contracts/task-authorization-openapi.yaml
tests:
 -
---

## Prompt

Create:
- Ownership enforcement flow diagram
- Updated endpoint responsibility mapping
- Authorization logic placement plan

Decisions needing documentation:
- URL user_id vs JWT user_id enforcement strategy
- 403 vs 404 behavior for unauthorized resource access
- Query-level filtering vs post-fetch validation
- Reusable authorization helper patterns

Testing strategy:
- Access own tasks → success
- Access another user's tasks → 403 or 404
- Create task → user_id bound automatically
- Update/delete foreign task → blocked
- Toggle-complete respects ownership

Technical approach:
- Trust authenticated user context from Spec-3
- Enforce ownership at ORM query level
- Keep auth (Spec-3) and authorization (Spec-4) clearly separated
- Validate behavior incrementally per endpoint

## Response snapshot

Successfully completed the implementation planning for user-level data isolation and task ownership enforcement in the Todo API. The plan includes:

1. **Authorization Strategy Decision**: Validate both URL user_id and JWT user_id with ORM-level filtering
2. **Error Handling Decision**: Return 404 for unauthorized access to prevent information leakage
3. **Security Approach**: Defense-in-depth with multiple validation layers (JWT, URL, ORM)
4. **Reusable Helpers**: Create service-layer functions for consistent authorization

Generated comprehensive documentation:
- Implementation plan with technical context and constitutional compliance
- Research document covering key architectural decisions
- Data model defining authorization entities and relationships
- Quickstart guide for developers
- API Contract specification
- Updated agent context with new technologies

All constitutional requirements verified through pre- and post-design checks, ensuring security, proper technology stack usage, and architectural alignment.

## Outcome

- ✅ Impact: Comprehensive authorization architecture plan completed with all required artifacts
- 🧪 Tests: Testing strategy documented with clear validation scenarios
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, contracts/task-authorization-openapi.yaml
- 🔁 Next prompts: Ready for /sp.tasks to break down implementation work
- 🧠 Reflection: ORM-level filtering approach provides database-level security

## Evaluation notes (flywheel)

- Failure modes observed: None - all constitutional checks passed
- Graders run and results (PASS/FAIL): PASS - All architectural decisions align with requirements
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation with service-layer authorization functions