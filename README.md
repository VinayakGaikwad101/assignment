# Case Intake and Hearing Readiness Module

**Full Stack Development Intern Assignment**

**Repository:** [Github URL](https://github.com/VinayakGaikwad101/assignment)

**Demo Video:** [Insert Video Link Here]

A task-oriented application built using the MERN stack and TypeScript. This module manages legal case records and tracks hearing preparation tasks, utilizing a hybrid API architecture that incorporates both REST and GraphQL.

## Technical Stack

- **Frontend:** React 18 with TypeScript and Tailwind CSS.
- **Backend:** Node.js and Express with TypeScript.
- **Database:** MongoDB via the Mongoose ODM.
- **API Layer:** RESTful endpoints for standard CRUD and Apollo Server 4 for GraphQL mutations.
- **Icons:** Lucide-React for interface elements.

## Project Architecture

The project is divided into two main directories: `backend` and `frontend`.

The backend follows a controller-route pattern for REST. The GraphQL implementation is handled via a schema-first approach in the `src/graphql` directory. On the frontend, state is managed through React hooks, while API communication is abstracted into a service layer to separate UI logic from data fetching.

## Local Installation and Setup

### 1. Backend Configuration

1.  Navigate to the `backend` folder.
2.  Install dependencies: `npm install`
3.  Create a `.env` file with the following variables:
    - `PORT=5000`
    - `MONGO_URI` (Your MongoDB connection string)
    - `NODE_ENV` (Set to development/production respectively)
4.  Start the development server: `npm run dev`

### 2. Frontend Configuration

1.  Navigate to the `frontend` folder.
2.  Install dependencies: `npm install`
3.  Start the application: `npm run dev`

## Core Features

### Case Management (Feature A)

The system supports the full lifecycle of a legal case. Validation is enforced both on the client side and in the Mongoose schema. Fields include case title, client name, court name, case type, and a specific legal stage. When a case is deleted, the system is designed to handle dependent tasks to maintain database integrity.

### Task Tracking (Feature B)

Users can assign multiple preparation tasks to a specific case. Each task tracks a due date, an assignee, and a priority level. The UI provides a toggle to switch task status between Pending and Completed, with visual distinctions for finished items.

### Dashboard and Metrics (Feature C)

The dashboard calculates the total number of active cases and summarizes task completion rates. It also includes a filter to identify cases with hearing dates scheduled within the next seven days to help users prioritize their workload.

## Bonus Implementations

### GraphQL Integration

A hybrid approach was chosen to demonstrate flexibility. While REST handles the bulk of the application, GraphQL is used for specific, high-frequency operations.

- **Mutation:** `updateCaseStage` allows for immediate updates to a case's legal status directly from the UI.
- **Integration:** This was implemented using `@as-integrations/express5` to resolve common module resolution conflicts between Apollo and CommonJS environments.
- **How to Review:** Navigate to any Case Details page and click the Quick Stage status buttons (e.g., Filing, Evidence) to see the GraphQL mutation update the database and UI in real-time.

### Role-Based Access Control (RBAC)

The application includes logic to distinguish between Admin and Intern roles.

- **Constraint:** The delete functionality for cases and tasks is conditionally rendered. If the user context is not set to Admin, the delete actions are removed from the UI to prevent unauthorized data removal.
- **How to Review:** Toggle the user role to 'Intern' using the UI role switch. Observe that the 'Delete' button on the Case Details page and Task items is restricted and no longer visible.

### AI-Assisted Development Log

- **Assistance:** AI was used for initial boilerplate generation and scaffolding the GraphQL schema.
- **Manual Intervention:** Significant manual debugging was required to resolve TypeScript type mismatches between Mongoose documents and GraphQL resolver returns.
- **Conflict Resolution:** The default Apollo Server middleware subpath caused a package export error. This was manually fixed by switching to a standalone integration package that supports the project's specific module resolution settings.
- **Documentation:** AI was used to generate documentation for the project, wherever necessary.

## Assumptions and Constraints

- **Authentication:** A full JWT-based authentication system was not requested; therefore, roles are managed through a simulated auth context for demonstration purposes.
- **Database:** The application assumes a working MongoDB instance is available via the provided URI.
- **Scaling:** Search and filtering are currently handled through client-side logic for immediate responsiveness on small-to-medium datasets.
