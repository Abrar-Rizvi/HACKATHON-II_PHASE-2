# Implementation Plan: Auth-Aware Todo API with User-Level Data Isolation

**Branch**: `001-auth-aware-todo` | **Date**: 2026-01-17 | **Spec**: [../001-auth-aware-todo/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-aware-todo/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of user-level data isolation and task ownership enforcement for the Todo API. This involves updating existing CRUD endpoints to validate that users can only access, modify, and delete their own tasks by comparing the authenticated user's identity (from JWT token) with the task's owner. The solution will enforce ownership at the ORM query level to prevent data leakage between users, while maintaining clear separation between authentication (Spec-3) and authorization (Spec-4) concerns.

## Technical Context

**Language/Version**: Python 3.10+ (as specified in CLAUDE.md)
**Primary Dependencies**: FastAPI, SQLModel, python-jose/cryptography, Better Auth JWT, PyJWT, uvicorn
**Storage**: PostgreSQL with SQLModel ORM (Neon database)
**Testing**: pytest for backend tests
**Target Platform**: Linux server (backend API service)
**Project Type**: web (backend API for full-stack Todo application)
**Performance Goals**: <100ms for authenticated requests with user validation (consistent with JWT verification performance from Spec-3)
**Constraints**: Must rely on authenticated user context from Spec-3, no auth logic changes, maintain RESTful API behavior
**Scale/Scope**: Multi-user support with individual user task isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check
### Security Requirements (from Constitution Principle III)
- ✅ Multi-user isolation: Enforcing task ownership by user_id to prevent data leakage
- ✅ Data filtering: All queries will be filtered by authenticated user's user_id
- ✅ Zero data leakage: Between users through proper authorization checks

### Technology Stack Compliance (from Constitution Principle IV)
- ✅ Backend: Using FastAPI (Python) as required
- ✅ Database: Using PostgreSQL with SQLModel ORM as required
- ✅ Authentication: Leveraging JWT tokens from Better Auth integration (Spec-3)

### API Contract Requirements (from Constitution Principle VI)
- ✅ JWT authentication on all protected routes: Leveraging existing auth from Spec-3
- ✅ user_id extracted from JWT and used for data filtering: Core requirement of this feature
- ✅ Consistent error responses: Will return 403/404 for unauthorized access

### Architectural Alignment
- ✅ RESTful design: Following standard HTTP methods and status codes
- ✅ User_id foreign key enforcement: Aligns with database schema requirements
- ✅ Separation of concerns: Keeping auth (Spec-3) separate from authorization (Spec-4)

### Post-Design Check
### Implementation Approach Validation
- ✅ ORM-level filtering: Provides database-level security for data isolation
- ✅ 404 for unauthorized access: Prevents information leakage about resource existence
- ✅ URL and JWT validation: Extra security layer validating both identifiers
- ✅ Reusable authorization helpers: Centralized security policies for maintainability

### Security Validation
- ✅ Defense-in-depth: Multiple layers of validation (JWT, URL, ORM-level)
- ✅ Information leakage prevention: Using 404 instead of 403 for unauthorized access
- ✅ Consistent error handling: Uniform response for unauthorized access attempts
- ✅ User isolation: Strict enforcement of user-specific data access

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py              # JWT verification utilities (from Spec-3)
│   │   ├── dependencies.py     # FastAPI dependency for auth (from Spec-3)
│   │   └── middleware.py       # Optional JWT middleware (from Spec-3)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication-related Pydantic models (from Spec-3)
│   │   ├── base.py            # Base SQLModel with user_id
│   │   └── task.py            # Task model with user_id foreign key
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication routes (from Spec-3)
│   │   └── tasks.py           # Task routes with user_id validation
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication services (from Spec-3)
│   │   └── task.py            # Task services with user ownership enforcement
│   └── main.py                # FastAPI app with security schemes
└── tests/
    ├── auth/
    │   ├── test_jwt.py        # JWT verification tests (from Spec-3)
    │   └── test_dependencies.py # Auth dependency tests (from Spec-3)
    └── task/
        ├── test_task_auth.py    # Task ownership validation tests
        └── test_user_scoping.py # User-scoped operations tests
```

**Structure Decision**: Following the Web application structure since this is a backend API for a full-stack Todo application. The authorization components will be integrated into the existing backend/src/ structure with user ownership validation at the service and route levels.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
