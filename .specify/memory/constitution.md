<!--
SYNC IMPACT REPORT

Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)

Modified Principles:
- Initial creation: 9 principles established

Added Sections:
- Core Principles (9 principles)
- Roles & Responsibilities
- Workflow & Process
- Technical Standards
- Architectural Requirements
- Governance

Templates Requiring Updates:
- ✅ plan-template.md: Constitution Check section aligns with principles
- ✅ spec-template.md: Requirements structure supports strict spec-driven approach
- ✅ tasks-template.md: Task organization matches workflow requirements

Follow-up TODOs:
- None - all placeholders resolved
-->

# Full-Stack Todo Web Application Constitution

## Core Principles

### I. Strictly Spec-Driven Development (NON-NEGOTIABLE)

All code MUST originate from specifications via Claude Code + Spec-Kit Plus workflow. No manual coding is permitted under any circumstances. Every implementation decision must trace back to a documented specification in `/specs`.

**Rationale**: Ensures complete traceability, prevents scope drift, and maintains architectural consistency across the multi-agent system.

### II. Sub-Agent Specialization

Development MUST use specialized sub-agents with clearly defined responsibilities and strict boundary enforcement:

- **Frontend UI Sub-Agent**: Owns all Next.js code (App Router, TypeScript, Tailwind, components, pages, API client); references only `specs/ui`, `specs/features`, `frontend/CLAUDE.md`
- **Backend API Sub-Agent**: Owns FastAPI routes, Pydantic models, JWT middleware, error handling; references only `specs/api`, `specs/features`, `backend/CLAUDE.md`
- **Database Sub-Agent**: Owns SQLModel schema, Neon connection configuration, queries, migrations; references only `specs/database`, `backend/CLAUDE.md`
- **Main Orchestrator**: Breaks specs into tasks, delegates to correct sub-agents, reviews and integrates outputs, resolves conflicts, enforces consistency and security

**Rationale**: Clean separation of concerns produces scalable, maintainable code and prevents cross-concern contamination.

### III. Multi-User Isolation (SECURITY-CRITICAL)

Full multi-user support MUST be enforced at all layers:

- User authentication via JWT tokens (Better Auth)
- Data storage in Neon PostgreSQL with strict user ownership
- Every database record MUST include user_id foreign key
- All API endpoints MUST validate JWT and filter by authenticated user_id
- Zero data leakage between users

**Rationale**: Security-first design prevents unauthorized access and data breaches in production.

### IV. Modern Stack Adherence

Technology stack is NON-NEGOTIABLE and MUST NOT deviate:

- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), Pydantic models
- **Database**: Neon PostgreSQL with SQLModel ORM
- **Authentication**: Better Auth with JWT tokens
- **Deployment**: Docker Compose for local development

**Rationale**: Standardization eliminates integration issues and ensures team expertise is focused.

### V. Monorepo Structure

Repository structure is MANDATORY and MUST follow this layout:

```
/specs               # All specifications (Spec-Kit Plus)
/frontend            # Next.js application
  /CLAUDE.md         # Frontend-specific guidance
/backend             # FastAPI application
  /CLAUDE.md         # Backend-specific guidance
/CLAUDE.md           # Main orchestrator guidance
/.spec-kit/config.yaml
/docker-compose.yml
```

**Rationale**: Predictable structure enables automation and prevents confusion across sub-agents.

### VI. API Contract Enforcement

API endpoints MUST follow exact specifications:

- RESTful design with standard HTTP methods
- JWT authentication on all protected routes
- user_id extracted from JWT and used for data filtering
- Consistent error responses (HTTP status codes + JSON error bodies)
- All endpoints documented in `specs/api`

**Rationale**: Contract-first design prevents integration failures between frontend and backend.

### VII. Testing Requirements

Testing MUST be comprehensive and distributed:

- **Unit tests**: Written by sub-agents for their respective domains
- **Integration tests**: Written by orchestrator to validate cross-boundary interactions
- All tests MUST pass before deployment
- `docker-compose up` MUST result in fully functional application

**Rationale**: Quality gates prevent regressions and ensure production readiness.

### VIII. Fallback Responsibility

When specialized sub-agents are unavailable:

- **Orchestrator MUST handle the task itself** using the same quality standards
- **Out-of-role tasks MUST be rejected** with clear explanation and returned to orchestrator
- Orchestrator always owns final integration and quality validation

**Rationale**: Ensures work continues despite agent availability while maintaining role boundaries.

### IX. Zero Manual Coding

Manual coding outside the spec-driven workflow is STRICTLY PROHIBITED:

- All code changes MUST originate from specs
- All code generation MUST use Claude Code tools
- Direct file editing without spec traceability is forbidden
- Changes MUST be committed with clear messages linking to specs

**Rationale**: Maintains complete audit trail and prevents undocumented technical debt.

## Roles & Responsibilities

### Frontend UI Sub-Agent
**Scope**: All Next.js application code
**Tools**: TypeScript, React components, Tailwind CSS, Next.js App Router
**Inputs**: `specs/ui/`, `specs/features/`, `frontend/CLAUDE.md`
**Outputs**: React components, pages, API client functions, frontend tests
**Boundaries**: MUST NOT touch backend code or database schemas

### Backend API Sub-Agent
**Scope**: All FastAPI application code
**Tools**: Python, FastAPI, Pydantic models, JWT middleware
**Inputs**: `specs/api/`, `specs/features/`, `backend/CLAUDE.md`
**Outputs**: API routes, request/response models, middleware, backend tests
**Boundaries**: MUST NOT touch frontend code or modify database schemas directly

### Database Sub-Agent
**Scope**: All database schema and query logic
**Tools**: SQLModel, PostgreSQL, Alembic migrations
**Inputs**: `specs/database/`, `backend/CLAUDE.md`
**Outputs**: SQLModel models, migrations, query functions, database tests
**Boundaries**: MUST NOT implement business logic or API routes

### Main Orchestrator (Primary Agent)
**Scope**: Overall project coordination and integration
**Responsibilities**:
- Break feature specifications into delegatable tasks
- Route tasks to appropriate sub-agents
- Review and integrate all sub-agent outputs
- Resolve conflicts between implementations
- Enforce security, consistency, and quality standards
- Run integration tests and validate end-to-end functionality

## Workflow & Process

### Specification-First Cycle

1. **Specification Creation**: Update or create specs in `/specs` using Spec-Kit Plus
2. **Task Breakdown**: Orchestrator analyzes specs and creates delegatable tasks
3. **Task Assignment**: Orchestrator assigns tasks to appropriate sub-agent(s)
4. **Implementation**: Sub-agents implement using Claude Code, citing `@specs/...`
5. **Review & Integration**: Orchestrator merges outputs and validates
6. **Testing**: Run `docker-compose up` and execute integration tests
7. **Iteration**: If issues found, update specs and repeat
8. **Commit**: All changes committed to monorepo with clear messages

### Sub-Agent Task Execution

When a sub-agent receives a task:

1. Verify task is within role scope (reject if out-of-role)
2. Reference only authorized spec files
3. Implement using Claude Code tools
4. Write unit tests for implemented functionality
5. Return completed work to orchestrator with summary

### Orchestrator Integration Flow

When integrating sub-agent outputs:

1. Review all implementations for consistency
2. Check for cross-boundary conflicts
3. Validate security requirements (JWT, user_id filtering)
4. Run integration tests
5. Update specs if gaps or conflicts discovered
6. Delegate rework if needed
7. Finalize and commit when all validations pass

## Technical Standards

### Authentication & Security

- JWT tokens MUST be validated on every protected API endpoint
- JWT secret MUST be shared via environment variables (`.env` files)
- Tokens MUST include `user_id` claim for data filtering
- All passwords MUST be hashed (handled by Better Auth)
- HTTPS MUST be enforced in production

### Data Persistence

- All user-generated data MUST include `user_id` foreign key
- Database queries MUST filter by authenticated user's `user_id`
- Soft deletes preferred over hard deletes where appropriate
- Migrations MUST be reversible

### Error Handling

- API errors MUST return consistent JSON structure: `{"error": "message", "code": "ERROR_CODE"}`
- HTTP status codes MUST follow RESTful conventions (200, 201, 400, 401, 403, 404, 500)
- Frontend MUST display user-friendly error messages
- All errors MUST be logged with sufficient context

### Code Quality

- TypeScript MUST be used for all frontend code (strict mode)
- Python type hints MUST be used for all backend code
- Linting and formatting MUST pass (Prettier for frontend, Black for backend)
- No commented-out code in commits
- Meaningful variable and function names required

## Architectural Requirements

### API Design

RESTful endpoints MUST follow this structure:

```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
GET    /api/todos             # List todos (filtered by user_id)
POST   /api/todos             # Create todo (with user_id)
GET    /api/todos/:id         # Get todo (verify ownership)
PUT    /api/todos/:id         # Update todo (verify ownership)
DELETE /api/todos/:id         # Delete todo (verify ownership)
PATCH  /api/todos/:id/toggle  # Toggle completion (verify ownership)
```

### Database Schema

Core tables MUST include:

```
users
  id: UUID (primary key)
  email: string (unique)
  password_hash: string
  created_at: timestamp

todos
  id: UUID (primary key)
  user_id: UUID (foreign key to users.id)
  title: string
  completed: boolean
  created_at: timestamp
  updated_at: timestamp
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and API client
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── CLAUDE.md               # Frontend agent guidance
```

### Backend Structure

```
backend/
├── src/
│   ├── models/             # SQLModel schemas
│   ├── routes/             # FastAPI route handlers
│   ├── middleware/         # JWT and other middleware
│   └── db/                 # Database connection and utilities
├── tests/                  # Backend tests
└── CLAUDE.md               # Backend agent guidance
```

## Governance

### Amendment Procedure

1. Proposed changes MUST be documented in an Architecture Decision Record (ADR)
2. Changes MUST be reviewed by all relevant stakeholders
3. Breaking changes require MAJOR version increment
4. All amendments MUST update this constitution and dependent templates
5. Version history MUST be maintained

### Versioning Policy

Constitution versions follow semantic versioning:

- **MAJOR**: Backward-incompatible governance or principle changes
- **MINOR**: New principles added or existing principles materially expanded
- **PATCH**: Clarifications, wording improvements, non-semantic fixes

### Compliance Review

- All pull requests MUST verify compliance with constitution principles
- Orchestrator MUST reject implementations that violate principles
- Monthly reviews to identify technical debt and constitution violations
- Security audits required before production deployment

### Complexity Justification

Any deviation from simplicity MUST be justified:

- Document the specific problem requiring complexity
- Explain why simpler alternatives were rejected
- Include mitigation plan for complexity overhead
- Review and challenge complexity during code review

---

**Version**: 1.0.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
