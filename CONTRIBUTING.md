# Contributing Guidelines

This document outlines the strict version control rules for working on this repository. To maintain a clean, readable, and professional Git history, all branches and commits must adhere to the standards below.

## 1. Branching Strategy

Do not commit directly to `main` while building major features. Use feature branches to keep your work isolated and organized.

**Branch Name Format:**
`<type>/<short-description>`

**How to identify your branch name:**

1. Determine the core nature of your work (the `<type>`) using the commit types listed in Section 3.
2. Write a brief, kebab-cased description of the feature or fix (the `<short-description>`).

**Examples:**

- `feat/case-crud` (Building the Case CRUD operations)
- `fix/task-deletion-cascade` (Fixing a bug in task deletion)
- `chore/project-setup` (Initial repository setup)

## 2. Commit Message Format

Your commit messages must explain your intent clearly. We use the **Conventional Commits** standard.

**Format:**
`<type>(<scope>): <subject>`

- **`<type>`**: The category of the change (see Section 3).
- **`<scope>`**: (Optional but recommended) The specific feature, page, or architectural layer you are working on (e.g., `cases`, `tasks`, `auth`, `backend`, `ui`).
- **`<subject>`**: A short description of the applied changes.

## 3. Identifying the Right `<type>`

Ask yourself: _What does this specific commit actually do?_ Choose the single most accurate type from this list:

- **`feat`**: Are you adding a new feature or behavior?
  _Example: `feat(cases): add case creation endpoint`_
- **`fix`**: Are you resolving a bug, crash, or incorrect behavior?
  _Example: `fix(tasks): resolve crash on invalid date format`_
- **`refactor`**: Are you rewriting code without changing its external behavior or adding features?
  _Example: `refactor(backend): move db connection logic to config folder`_
- **`style`**: Are you changing formatting, CSS, or UI polish (not affecting logic)?
  _Example: `style(dashboard): update empty state visual hierarchy`_
- **`test`**: Are you adding or fixing frontend/backend tests?
  _Example: `test(cases): add unit test for case validation`_
- **`docs`**: Are you updating documentation like README or AI logs?
  _Example: `docs(readme): add setup instructions`_
- **`chore`**: Are you updating dependencies, configuration, or build scripts?
  _Example: `chore(deps): install mongoose and express`_

## 4. Guidelines for the `<subject>`

The subject line is the most important part of the commit message. Follow these strict rules:

- **Use the imperative mood:** Write as if you are giving a command (e.g., use "add", not "added" or "adds").
- **Keep it concise:** Aim for under 50 characters if possible, but prioritize being highly descriptive.
- **No capitalization:** Do not capitalize the first letter of the subject.
- **No punctuation:** Do not end the subject with a period.

**Good Example:** `feat(cases): implement case deletion with cascade`
**Bad Example:** `Added the delete button and it works now.`
