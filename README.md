# PRAJNA — Frontend Web
> **Professional AI Companion for GITAM Faculty (Phase 1)**
> PRAJNA mobile-first React + TypeScript PWA frontend code.

---

## 📌 Repository Overview

This repository (`prajna-frontend-web`) contains the source code, unit tests, and infrastructure stacks for PRAJNA.


---

## 📁 Repository Structure

```text
prajna-frontend-web/
├── .github/                # GitHub-specific files
│   ├── ISSUE_TEMPLATE/     # Templates for bug reports and features
│   ├── workflows/          # GitHub Actions CI/CD workflows
│   └── CODEOWNERS          # Direct code ownership review mapping
├── docs/                   # Documentation-first design artifacts
│   ├── architecture/       # System and component high-level designs
│   ├── lld/                # Low-Level Design (LLD) templates
│   ├── api-specs/          # OpenAPI spec definitions
│   ├── decisions/          # Architecture Decision Records (ADRs)
│   └── diagrams/           # Diagrams and guide
├── src/                    # Application source code
├── tests/                  # Integration and Unit testing suite
├── scripts/                # Utility validation and linting scripts
├── CONTRIBUTING.md         # Branching strategy & developer standards
├── SECURITY.md             # Security tools & vulnerability reporting
└── LICENSE                 # License terms (MIT)
```

---
## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [AWS CLI v2](https://aws.amazon.com/cli/) configured with your sandbox developer credentials
- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) (`npm install -g aws-cdk`)

### Installation & Local Setup
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local validations:
   ```bash
   npm run validate
   ```

---
## 🛡️ Governance & Quality Gates

1. **Branching Strategy:** No direct pushes to `mainline` or `release`. Work must take place in `feature/*`, `bugfix/*`, `hotfix/*`, or `chore/*`.
2. **Review Policy:** Every PR must be reviewed by the respective Module Owner (defined in [CODEOWNERS](file:///Users/Santosh/Prajna/{repo_name}/CODEOWNERS)) and at least one Project Lead before merge.
3. **CI/CD Quality Gates:** All code must pass type safety, lint checks, test suites, and infrastructure vulnerability scans before landing.

For detail-oriented rules, read the [Developer Contributing Guidelines](file:///Users/Santosh/Prajna/{repo_name}/CONTRIBUTING.md).

---

## 📞 Support & Contacts
- **Project Lead:** Harini C (@HariniC)
- **Principal Software Architect:** @Navaneeth Kumar Buddi
- **Repository Coordinator:** Chethan S (@ChethanS)
