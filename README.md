# UNSW Planner

UNSW Planner is a full-stack web application designed to help UNSW students organise their courses across different terms and academic years.

Students will be able to search for courses, build a personalised study plan for Term 1, Term 2 and Term 3, and move or remove courses as their degree plan changes. The project also aims to build a reusable course catalogue so that course information does not need to be entered repeatedly.

## Project Status

The project is currently in early backend development.

Completed:

- Student registration with input validation
- Secure password hashing with bcrypt
- Student login and password verification
- UUID-based authenticated sessions
- JSON file persistence for local development
- REST endpoints for registration and login
- Unit and HTTP integration tests for authentication

In progress:

- Remaining authentication and session-management features

Planned next:

- Course catalogue and course search
- Personal study plans grouped by year and term
- Adding courses to a study plan
- Moving courses between terms
- Removing or replacing planned courses
- Frontend interface for viewing and editing a plan

## MVP Scope

The first usable version of UNSW Planner will allow a student to:

1. Register and log in.
2. Search or browse available courses.
3. Add a course to a year and term in their study plan.
4. Move a planned course to another term.
5. Remove a course from their plan.
6. Return later and retrieve the saved plan.

More advanced features, such as community-contributed course data, prerequisite checking, a relational database, CI/CD and deployment, will be considered after the MVP is complete.

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- bcrypt for password hashing
- UUID for session identifiers
- Validator for email validation
- JSON file storage during early development

### Testing

- Vitest
- Node.js `fetch` for HTTP integration tests

### Frontend

Frontend development has not started yet. The intended frontend will provide a visual study-plan editor for courses, terms and academic years.

## Project Structure

```text
UNSW-Planner/
├── backend/
│   ├── src/
│   │   ├── auth.ts             # Authentication business logic
│   │   ├── dataStore.ts        # Data types and JSON persistence
│   │   ├── helper.ts           # Validation and ID helpers
│   │   ├── requestHelpers.ts   # HTTP helpers used by integration tests
│   │   └── server.ts           # Express server and API routes
│   ├── test/
│   │   └── auth.test.ts        # Authentication unit and HTTP tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Reserved for frontend development
└── README.md
```

## Getting Started

### Requirements

- Node.js 18 or later
- npm

### Install dependencies

```bash
cd backend
npm install
```

### Start the backend server

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

### Run tests

The HTTP integration tests require the backend server to be running. Keep `npm run dev` open in one terminal, then run the following in another terminal:

```bash
npm test
```

### Run the TypeScript check

```bash
npx tsc --noEmit
```

## API Endpoints

### Register a student

```http
POST /v1/admin/auth/register
Content-Type: application/json
```

Example request body:

```json
{
  "email": "z5678705@unsw.edu.au",
  "password": "abc123~!@",
  "nameFirst": "Alan",
  "nameLast": "Guo",
  "programName": "Computer Science",
  "age": 20
}
```

Successful response:

```json
{
  "controlUserSessionId": "generated-session-uuid"
}
```

### Log in

```http
POST /v1/admin/auth/login
Content-Type: application/json
```

Example request body:

```json
{
  "email": "z5678705@unsw.edu.au",
  "password": "abc123~!@"
}
```

Successful response:

```json
{
  "controlUserSessionId": "generated-session-uuid"
}
```

Invalid registration or login requests return an error response with an appropriate HTTP status code:

```json
{
  "error": "Error description"
}
```

## Development Approach

Features are developed as complete vertical slices. Each feature should include:

1. DataStore types and persistence changes
2. Business logic
3. Unit tests
4. An Express route
5. A request helper
6. HTTP integration tests

This keeps each endpoint independently testable before development moves to the next feature.
