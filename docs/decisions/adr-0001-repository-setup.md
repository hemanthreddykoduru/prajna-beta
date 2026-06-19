# ADR-0001: Repository Setup, Structure, and CI Validation Policies

- **Status:** Accepted
- **Date:** 2026-06-19
- **Author:** @NavaneethKB
- **Deciders:** Harini C, Chethan S, Greeshmitha B, P Chaithanya, Abhigna Y, Harshitha R

---

## 📋 1. Context & Problem Statement
The PRAJNA Faculty Data stack contains six distinct modules (Modules 7-12) managed by multiple student developers. Working in a single codebase with multiple contributors can quickly lead to dependency conflicts, inconsistent formatting, regression bugs, and infrastructure misconfigurations unless strict, automated policies are established from day one.

---

## 🔍 2. Decision Driver / Alternatives Considered

### Option A: Monolith Stack
- **Pros:** Single codebase to build and deploy.
- **Cons:** Code merging is slow; conflicts are frequent; deploy failures block the entire development team.

### Option B: Polyrepo Structure (Chosen Option)
We deploy a modular, federated codebase where `prajna-faculty-data` serves as a dedicated repository housing all six faculty data sub-modules.
- **Pros:** Limits branch conflict boundaries; isolates dependencies for faculty data modules; allows independent CDK stack deployments within the domain.
- **Cons:** Shared code must be distributed using shared workspaces or local modules.

---

## 🏁 3. Proposed Decision & Rationale
We chose to structure `prajna-faculty-data` as a single TypeScript-based repository containing:
1. **Module Scaffolding:** Modules have isolated source files (`src/profile`, `src/teaching`, etc.) and corresponding Jest test suites.
2. **TypeScript Compiler (`tsconfig.json`):** Configured in strict mode to eliminate runtime Type errors and restrict the use of the `any` type.
3. **Automated CI/CD Quality Gates:** All Pull Requests targeting protected branches must pass strict checks:
   - Formatting and linting checks (`eslint`).
   - Compilation and type validation (`tsc`).
   - Jest Unit Testing with a minimum of **80% branch coverage**.
   - Security auditing using `cdk-nag` and `Checkov`.

---

## ⚡ 4. Consequences & Impacts
- **Positive Impacts:** High developer confidence, fast integration cycles, early identification of security issues (CDK misconfigurations) before deploying to AWS.
- **Negative Impacts:** Initial learning curve for student developers adjusting to strict linter and type-checking rules.
- **CI/CD Impact:** PRs will take approximately 2–3 minutes to build and scan on GitHub Actions runners.
