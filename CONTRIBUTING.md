# PRAJNA Developer Contribution Guidelines

Welcome to the PRAJNA Faculty Intelligence Platform development team! This guide outlines the engineering standards, branching strategy, code review process, and quality controls required for contributing to the `prajna-faculty-data` repository.

---

## 🚀 1. Branching Strategy & Workflow

To coordinate work across 30 developers, we use a structured branch layout. No developer is allowed to commit directly to protected branches.

```text
                          ┌── feature/m7-profile-crud (working branch)
                          │   [commit] ── [commit] 
                         /                       \
[mainline] (protected) ─●─────────────────────────●── [PR review & squash-merge]
                         \                       /
                          └── release (protected) ────────────────────────● [Release merge]
```

### Protected Branches
- **`mainline` (default):** Reflects the current stable development build. All features are merged here. Direct pushes are disabled.
- **`release`:** Production-ready branch. Deployed to staging and production. Merging to `release` requires approval from the Project Lead and the Principal Architect.

### Working Branches
Create your branch from `mainline` using one of the following prefixes:
- **`feature/<module-number>-<short-description>`**: For new features (e.g., `feature/m7-profile-crud`).
- **`bugfix/<issue-number>-<short-description>`**: For bug fixes (e.g., `bugfix/102-fix-scopus-fetch`).
- **`hotfix/<short-description>`**: Urgent fixes directly targeting production issues (e.g., `hotfix/cognito-auth-leak`).
- **`chore/<short-description>`**: Maintenance, dependencies updates, configuration changes (e.g., `chore/bump-cdk-nag`).

### Pull Request Workflow
1. **Sync:** Always checkout `mainline` and pull the latest changes before starting work.
2. **Branch:** Create your working branch (e.g., `git checkout -b feature/m9-doi-validation`).
3. **Commit:** Keep commits small, atomic, and explain *why* the change was made.
4. **Local Verification:** Run the local validation script before pushing:
   ```bash
   npm run validate
   ```
5. **Open PR:** Open a Pull Request targeting `mainline`. Fill out the Pull Request template entirely.
6. **Code Review:** Tag the designated module owners and wait for approval. Address feedback promptly.
7. **Merge:** Once CI passes and reviewers approve, the PR will be squashed and merged.

---

## 🛠️ 2. Engineering Standards

### TypeScript Clean Code
- **Enable `strict` compiler mode:** No `any` type allowed unless explicitly approved with an accompanying comment explaining why.
- **Interfaces & Types:** Explicitly define shapes for all parameters, database models, and API requests/responses.
- **Async/Await:** Prefer `async/await` syntax over raw Promises and callback functions.
- **Separation of Concerns:** Keep Lambdas focused on a single responsibility. Extract business logic into pure utility functions or domain services that can be tested independently of AWS event contexts.

### AWS Serverless Best Practices
- **Least Privilege IAM:** Assign granular, individual IAM policies to each Lambda function. Do not reuse single broad roles.
- **DynamoDB Keys:** Use consistent naming patterns for partition keys (`PK`) and sort keys (`SK`). 
- **Error Handling:** Gracefully catch and handle errors. Return descriptive, standardized HTTP status codes from the API Gateway wrapper (e.g., `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`). Never expose raw DynamoDB or Bedrock error traces to the client.

### Documentation-First Development
- **No code without architecture/LLD:** You must draft or update the module's Low-Level Design (LLD) document under `docs/lld/` before committing production code.
- **API Specification:** Document all API Gateway routes in `docs/api-specs/openapi.yaml` before implementing the lambda controllers.

---

## 🔍 3. Code Review & PR Checklist

When reviewing another contributor's PR, use this checklist to guide your inspection:

1. **Architecture Alignments:** Does this change fit within the serverless-only guidelines? Does it respect the boundaries of other stacks/modules?
2. **Security & Permissions:** Are IAM role policies minimal? Are environment variables stored or fetched securely? Are input parameters validated to prevent injection?
3. **Robustness & Error States:** What happens if DynamoDB tables throttle? What if Amazon Bedrock throws an API rate limit error? Are try-catch blocks logging helpful context to CloudWatch?
4. **Test Coverage:** Are unit tests covering edge cases, empty datasets, and error branches?
5. **Code Style:** Is the code clean, readable, and free of commented-out code blocks or placeholders?

---

## 🏁 4. Definition of Done (DoD)

A feature is considered **Done** only when it meets the following criteria:

- [ ] Code is fully implemented in TypeScript and compiles without errors.
- [ ] Automated unit tests achieve a minimum of **80% branch coverage**.
- [ ] No ESLint errors or formatting warnings remain.
- [ ] Local PR validation script (`npm run validate`) executes successfully.
- [ ] `cdk-nag` (CDK security tool) reports **zero** high or medium severity errors.
- [ ] The module's LLD documentation has been updated to reflect the final database schema and API changes.
- [ ] The API specification (`openapi.yaml`) has been updated and validated.
- [ ] The code has been reviewed and approved by the Module Owner and Project Lead.
- [ ] The feature has been successfully deployed and smoke-tested in a personal developer sandbox environment.
