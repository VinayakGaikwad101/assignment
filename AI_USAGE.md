# AI-Assisted Development Log

## AI Usage Overview

- **Brainstorming:** Used AI to brainstorm the initial project structure and folder organization to ensure a clean separation of concerns.
- **Boilerplate Assistance:** Assisted in generating standard TypeScript interfaces and repetitive CRUD boilerplate for the MERN controllers.
- **Reference:** Used AI as a real-time documentation reference for Tailwind CSS classes and Vitest syntax.

## Manual Development & Logic

- **Architecture:** Manually designed and implemented the `AuthContext` to handle Role-Based Access Control, ensuring the UI reacts instantly to role changes.
- **UX Refinement:** Designed the custom "Silent Refresh" pattern in `CaseDetails.tsx`. I noticed the AI's standard fetching logic caused a flickering loader, so I manually refactored the state to allow background updates.
- **Component Engineering:** Extracted the `Navbar` and `DeleteModal` into modular components to improve maintainability and code reuse.

## Bug Fix Log

- **Layout Correction:** The initial modal layout was too wide for desktop views; I manually constrained the width and added backdrop blurring for a more premium, production-ready feel.
- **Filtering Logic:** Refined the hearing date filters to strictly capture the 7-day window, correcting an initial logic error that was including past dates in the "Upcoming" count.
