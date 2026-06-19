# Low-Level Design (LLD) Document
## Module [Number]: [Module Name]

- **Version:** 1.0
- **Date:** [Date]
- **Author:** [@GitHubUsername]
- **Status:** Draft / In Review / Approved

---

## 📌 1. Introduction & Requirements

### Purpose
Describe what this module does, who uses it, and how it fits into the overall PRAJNA Faculty Data stack.

### Key Requirements Checklist
- [ ] Requirements from PRD / user stories.
- [ ] Security constraints (RBAC, isolation).
- [ ] Performance metrics (e.g. Scopus fetch latency, S3 upload sizes).

---

## ⚙️ 2. Detailed Technical Design

### Component Architecture
Explain the internal code layout of the Lambda handlers, services, and repository layers for this module.

```text
src/[module-name]/
├── handlers/         # Lambda API handlers (entry points)
├── services/         # Core business logic / validations
├── repository/       # Data storage operations (DynamoDB/S3 client calls)
└── models/           # TypeScript schemas and type definitions
```

---

## 🗄️ 3. Data Schema & Entities

### Database Access Design (DynamoDB or SQL)
Detail the keys, secondary indexes (GSIs), and attributes for this module's records.

#### DynamoDB Access Patterns:
- **Query 1:** Fetch all achievements for a faculty member.
  - *PK:* `FACULTY#<Id>`
  - *SK Prefix:* `ACHIEVEMENT#`
- **Query 2:** Check for duplicate publication DOIs.
  - *GSI1-PK:* `DOI#<DoiHash>`
  - *GSI1-SK:* `FACULTY#<Id>`

#### Attributes Format (JSON Schema / Interface):
```typescript
interface IFacultyAchievement {
  PK: string;             // FACULTY#<FacultyId>
  SK: string;             // ACHIEVEMENT#<AchievementId>
  title: string;
  category: 'Award' | 'Talk' | 'Membership' | 'Editorial';
  issuer: string;
  year: number;
  proofS3Key?: string;
  status: 'draft' | 'pending_approval' | 'approved';
  createdAt: string;
}
```

---

## 🔌 4. API Endpoints Contract

List the REST API endpoints exposed by this module through API Gateway.

### Endpoint: `POST /faculty/achievements`
- **Auth Role:** `Faculty`
- **Description:** Submit a new achievement for approval.

#### Request Headers:
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Request Body:
```json
{
  "title": "Best Teacher Award 2026",
  "category": "Award",
  "issuer": "GITAM University",
  "year": 2026,
  "proofS3Key": "proofs/achievements/award-123.pdf"
}
```

#### Responses:
- **`201 Created`**
  ```json
  {
    "success": true,
    "achievementId": "ach_abc123",
    "status": "pending_approval"
  }
  ```
- **`400 Bad Request`** (Validation error)
  ```json
  {
    "success": false,
    "message": "Invalid year. Year cannot be in the future."
  }
  ```

---

## 🧪 5. Testing & Verification

### Unit Test Specifications
List the test cases that must be implemented in the matching `tests/` directory:
- [ ] **TC-001:** Successfully save achievement and trigger event.
- [ ] **TC-002:** Reject submission if mandatory fields (title, year) are missing.
- [ ] **TC-003:** Reject file upload if `proofS3Key` contains an invalid path extension.
- [ ] **TC-004:** Fail verification if caller role in JWT is not `Faculty`.

### CDK Stack Verification
Verify that `cdk-nag` rules pass:
- [ ] Cognito integration is required for API validation.
- [ ] CloudWatch logs have retention policies set.
- [ ] IAM roles are narrow.
