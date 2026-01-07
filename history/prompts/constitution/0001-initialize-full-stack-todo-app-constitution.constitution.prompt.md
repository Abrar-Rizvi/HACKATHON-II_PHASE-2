---
id: 0001
title: Initialize Full-Stack Todo App Constitution
stage: constitution
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: /sp.constitution
labels: ["constitution", "governance", "principles", "initialization"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (documentation update)
---

## Prompt

```text
Project: Full-Stack Todo Web Application (Phase II)
Core principles:

Strictly spec-driven: All code must come from specs via Claude Code + Spec-Kit Plus; no manual coding ever
Sub-agent specialization with strong orchestration for clean, scalable code
Full multi-user support: User isolation via JWT (Better Auth), data stored in Neon PostgreSQL
Modern stack: Responsive Next.js frontend + RESTful FastAPI backend
Zero deviation from defined tech stack, folder structure, and API endpoints

Key standards:
Roles & Responsibilities

Frontend UI sub-agent: Owns all Next.js code (App Router, TypeScript, Tailwind, components, pages, API client); only references specs/ui, specs/features, frontend/CLAUDE.md
Backend API sub-agent: Owns FastAPI routes, Pydantic models, JWT middleware, error handling; only references specs/api, specs/features, backend/CLAUDE.md
Database sub-agent: Owns SQLModel schema, Neon connection config, queries, migrations; only references specs/database, backend/CLAUDE.md
Main Orchestrator (you): Breaks specs into tasks, delegates correctly, reviews & integrates all outputs, resolves conflicts, enforces consistency and security

Workflow

Update/write specs in /specs first (Spec-Kit Plus)
Orchestrator assigns tasks to correct sub-agent(s)
Sub-agents implement only via Claude Code, citing relevant @specs/...
Orchestrator merges, tests (docker-compose), iterates on specs if needed
All changes committed to monorepo with clear messages

Strict rules

Tech: Next.js 16+ (App Router), FastAPI, SQLModel, Neon PostgreSQL, Better Auth + JWT
Monorepo structure mandatory: /specs, /frontend, /backend, CLAUDE.md files, .spec-kit/config.yaml
Exact API endpoints with user_id + JWT protection
Unit tests from sub-agents; integration tests by orchestrator

Fallback rules

If suitable sub-agent unavailable → Orchestrator MUST handle the task itself
If sub-agent gets out-of-role task → MUST reject with explanation and return to orchestrator
Orchestrator always owns final integration and quality

Constraints

No manual coding allowed
Single monorepo only
JWT secret shared via env vars; auth enforced everywhere
All data persisted with user ownership

Success criteria

Working multi-user Todo app (CRUD + toggle complete) with login/signup
100% spec traceability
Full user isolation (no data leaks)
Clean structure ready for Phase III
Runs perfectly with docker-compose up
```

## Response snapshot

Created comprehensive project constitution v1.0.0 for Full-Stack Todo Web Application with 9 core principles:

1. **Strictly Spec-Driven Development** (NON-NEGOTIABLE) - All code from specs via Claude Code + Spec-Kit Plus
2. **Sub-Agent Specialization** - Clear roles for Frontend UI, Backend API, Database, and Main Orchestrator agents
3. **Multi-User Isolation** (SECURITY-CRITICAL) - JWT authentication with user_id filtering at all layers
4. **Modern Stack Adherence** - Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth
5. **Monorepo Structure** - Mandatory layout with /specs, /frontend, /backend, CLAUDE.md files
6. **API Contract Enforcement** - RESTful design with JWT protection and consistent error responses
7. **Testing Requirements** - Unit tests by sub-agents, integration tests by orchestrator
8. **Fallback Responsibility** - Orchestrator handles tasks when sub-agents unavailable
9. **Zero Manual Coding** - Strict prohibition on coding outside spec-driven workflow

Added comprehensive sections for:
- Roles & Responsibilities (detailed sub-agent boundaries)
- Workflow & Process (specification-first cycle)
- Technical Standards (auth, data persistence, error handling, code quality)
- Architectural Requirements (API design, database schema, folder structures)
- Governance (amendment procedure, versioning, compliance review)

Constitution includes embedded Sync Impact Report showing version change from 0.0.0 → 1.0.0 (MAJOR) with all template compatibility verified.

## Outcome

- ✅ Impact: Initial constitution ratified (v1.0.0), establishing governance framework for entire Full-Stack Todo App project
- 🧪 Tests: N/A (documentation artifact)
- 📁 Files: 1 created (.specify/memory/constitution.md with 331 lines)
- 🔁 Next prompts: Ready for feature specifications (/sp.specify), implementation planning (/sp.plan), or task generation (/sp.tasks)
- 🧠 Reflection: Constitution successfully transforms unstructured requirements into enforceable principles with clear agent boundaries, security mandates, and quality gates. All placeholders resolved with concrete values derived from user input.

## Evaluation notes (flywheel)

- Failure modes observed: None - clean execution with all templates validated for consistency
- Graders run and results (PASS/FAIL): Template consistency check PASS (plan-template.md, spec-template.md, tasks-template.md all align with constitution principles)
- Prompt variant (if applicable): Standard /sp.constitution workflow
- Next experiment (smallest change to try): Validate constitution enforcement during first feature specification creation to ensure principles are actionable
