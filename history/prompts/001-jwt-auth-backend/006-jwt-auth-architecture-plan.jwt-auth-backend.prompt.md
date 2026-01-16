---
id: 006
title: JWT Auth Architecture Plan
stage: plan
date: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: jwt-auth-backend
branch: 001-jwt-auth-backend
user: claude
command: sp.plan
labels: [authentication,jwt,fastapi,architecture,security]
links:
  spec: ../specs/001-jwt-auth-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-jwt-auth-backend/plan.md
 - specs/001-jwt-auth-backend/research.md
 - specs/001-jwt-auth-backend/data-model.md
 - specs/001-jwt-auth-backend/quickstart.md
 - specs/001-jwt-auth-backend/contracts/jwt-auth-openapi.yaml
tests:
 -
---

## Prompt

Create:
- JWT verification architecture sketch (middleware vs dependency)
- Auth flow diagram: Request → Header → JWT Decode → User Context
- Section structure for implementation steps

Decisions needing documentation:
- Middleware vs dependency injection (tradeoffs)
- JWT library choice (e.g., python-jose vs PyJWT)
- Error handling strategy (401 vs 403)
- Token payload contract assumptions

Testing strategy:
- Missing Authorization header → 401
- Invalid signature → 401
- Expired token → 401
- Valid token → user context available
- OpenAPI security scheme visible

Technical approach:
- Stateless JWT verification
- Shared secret via BETTER_AUTH_SECRET
- FastAPI dependency injection
- No DB calls during auth
- Build incrementally and validate per endpoint

## Response snapshot

Successfully completed the implementation planning for JWT-based authentication in the FastAPI backend. The plan includes:

1. **Architecture Decision**: Chose dependency injection approach over middleware for better integration with FastAPI's type system and OpenAPI documentation
2. **Technology Selection**: Selected python-jose[cryptography] for JWT validation due to compatibility with Better Auth
3. **Security Strategy**: Implemented 401 Unauthorized responses for all authentication failures
4. **Token Contract**: Defined expected payload structure with user_id and email claims

Generated comprehensive documentation:
- Implementation plan with technical context and constitutional compliance
- Research document covering key architectural decisions
- Data model defining JWT token and user context structures
- Quickstart guide for developers
- OpenAPI contract specification
- Updated agent context with new technologies

All constitutional requirements verified through pre- and post-design checks, ensuring security, proper technology stack usage, and architectural alignment.

## Outcome

- ✅ Impact: Comprehensive JWT authentication architecture plan completed with all required artifacts
- 🧪 Tests: Testing strategy documented with clear validation scenarios
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, contracts/jwt-auth-openapi.yaml
- 🔁 Next prompts: Ready for /sp.tasks to break down implementation work
- 🧠 Reflection: Dependency injection approach provides better FastAPI integration than middleware

## Evaluation notes (flywheel)

- Failure modes observed: None - all constitutional checks passed
- Graders run and results (PASS/FAIL): PASS - All architectural decisions align with requirements
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation with JWT utility functions