# Tasks: Auth-Aware Todo API with User-Level Data Isolation

**Feature**: Auth-Aware Todo API with User-Level Data Isolation
**Branch**: `001-auth-aware-todo`
**Generated**: 2026-01-17
**Based on**: `/specs/001-auth-aware-todo/spec.md` and `/specs/001-auth-aware-todo/plan.md`

## Implementation Strategy

MVP approach: Start with User Story 1 (core task ownership enforcement) and build incrementally. Each user story should result in independently testable functionality that can be validated separately.

## Dependencies

User stories can be implemented in parallel after foundational setup is complete. User Story 1 provides the foundational authorization logic that can be reused by Stories 2 and 3.

## Parallel Execution Examples

- T010-T012 (Foundational auth updates) can run in parallel with T013-T015 (ORM-level filtering)
- T020-T025 (US1 implementation) can run in parallel with T030-T035 (US2 implementation)
- T040-T042 (US3 implementation) can be developed after core authorization logic exists

---

## Phase 1: Setup (Project Initialization)

**Goal**: Prepare the project structure and update existing files to support user-level data isolation.

- [X] T001 Create/update backend/src/models/base.py with base SQLModel including user_id
- [X] T002 Update backend/src/models/task.py to include user_id foreign key and proper relationships
- [X] T003 Verify existing JWT authentication components from Spec-3 are available

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Implement core authorization components that will be used by all user stories.

- [X] T010 [P] Update backend/src/services/task.py with user-scoped task retrieval methods
- [X] T011 [P] Implement user_id validation between URL and JWT token in backend/src/services/task.py
- [X] T012 [P] Add reusable authorization helpers for task ownership validation in backend/src/services/task.py
- [X] T013 [P] Update backend/src/models/task.py with ORM-level filtering methods
- [X] T014 [P] Create authorization validation Pydantic models in backend/src/models/task.py
- [X] T015 [P] Implement consistent error handling for unauthorized access in backend/src/exceptions.py
- [X] T016 Create base authorization test suite in backend/tests/task/test_authorization_base.py
- [ ] T017 Update existing JWT authentication tests to validate user_id extraction in backend/tests/auth/

---

## Phase 3: User Story 1 - Secure Task Access and Ownership (Priority: P1)

**Goal**: Enable authenticated users to only access their own tasks, preventing access to other users' tasks.

**Independent Test Criteria**: Can be fully tested by having multiple users create tasks, then attempting to access other users' tasks and verifying that access is denied with appropriate error responses (404 for unauthorized access).

**Acceptance Tests**:
- [ ] T020 [US1] Test authenticated user can access their own tasks via GET /api/{my_user_id}/tasks
- [ ] T021 [US1] Test authenticated user receives 404 when accessing another user's task list via GET /api/{other_user_id}/tasks
- [ ] T022 [US1] Test authenticated user can access their specific task via GET /api/{my_user_id}/tasks/{my_task_id}

**Implementation Tasks**:
- [X] T023 [US1] Update GET /api/{user_id}/tasks endpoint to filter by authenticated user_id
- [X] T024 [US1] Add URL user_id validation against JWT user_id in GET /api/{user_id}/tasks
- [X] T025 [US1] Implement proper 404 responses for unauthorized access attempts

---

## Phase 4: User Story 2 - User-Level Task Operations (Priority: P1)

**Goal**: Allow authenticated users to perform all CRUD operations on their own tasks while preventing operations on others' tasks.

**Independent Test Criteria**: Can be tested by having a user perform all CRUD operations on their own tasks and verifying that operations on other users' tasks are blocked with appropriate error responses.

**Acceptance Tests**:
- [ ] T030 [US2] Test authenticated user can create tasks for their own user_id via POST /api/{my_user_id}/tasks
- [ ] T031 [US2] Test authenticated user can update their own tasks via PUT /api/{my_user_id}/tasks/{my_task_id}
- [ ] T032 [US2] Test authenticated user receives 404 when attempting to update another user's task via PUT /api/{other_user_id}/tasks/{my_task_id}

**Implementation Tasks**:
- [X] T033 [US2] Update POST /api/{user_id}/tasks to bind new tasks to authenticated user_id
- [X] T034 [US2] Update PUT /api/{user_id}/tasks/{id} to validate task ownership before update
- [X] T035 [US2] Update DELETE /api/{user_id}/tasks/{id} to validate task ownership before deletion
- [X] T036 [US2] Add URL user_id validation for all task operation endpoints

---

## Phase 5: User Story 3 - Secure Task Completion Toggle (Priority: P2)

**Goal**: Allow authenticated users to securely toggle completion status of their own tasks without affecting others' tasks.

**Independent Test Criteria**: Can be tested by having users toggle completion status on their own tasks and attempting to toggle other users' tasks, verifying appropriate access controls and 404 responses for unauthorized access.

**Acceptance Tests**:
- [ ] T040 [US3] Test authenticated user can toggle their own task completion via PATCH /api/{my_user_id}/tasks/{my_task_id}/complete
- [ ] T041 [US3] Test authenticated user receives 404 when attempting to toggle another user's task via PATCH /api/{other_user_id}/tasks/{my_task_id}/complete
- [ ] T042 [US3] Test authenticated user receives 404 when attempting to toggle another user's task via PATCH /api/{my_user_id}/tasks/{other_user_task_id}/complete

**Implementation Tasks**:
- [X] T043 [US3] Update PATCH /api/{user_id}/tasks/{id}/complete to validate task ownership
- [X] T044 [US3] Add proper 404 responses for unauthorized completion toggle attempts
- [X] T045 [US3] Ensure completion toggle respects user isolation constraints

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Complete the implementation with proper documentation, security enhancements, and validation of all requirements.

- [ ] T050 Update OpenAPI/Swagger documentation to reflect authorization requirements
- [ ] T051 Add comprehensive logging for authorization failures
- [ ] T052 Handle edge cases: malformed user_ids, non-existent tasks in user scope
- [ ] T053 Validate performance: authorized requests complete within 100ms (per SC-006)
- [ ] T054 Add validation that URL user_id matches JWT user_id for all task endpoints
- [ ] T055 Create developer documentation for the authorization system
- [ ] T056 Test that data leakage does not occur between different users' task collections
- [ ] T057 Validate that all CRUD operations respect user isolation (per FR-005)
- [ ] T058 Run full test suite to ensure all functionality works together
- [ ] T059 Update main FastAPI app to include authorization middleware if needed