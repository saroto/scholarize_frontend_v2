# Scholarize test data

`scholarize.dump.json` contains synthetic data based on the API consumers in
`src/app/api/service`, UI components, and `types.d.ts`. This frontend checkout
does not include a database schema, so the dump is JSON for API and component
tests rather than an importable SQL backup.

## Generate or refresh

From the project root:

```sh
node scripts/generate-test-data.cjs
```

The default reference date is today in UTC. To reproduce the checked-in dump or
anchor calendar events to a chosen date:

```sh
node scripts/generate-test-data.cjs --date 2026-11-04
```

The generator uses Node built-ins, adds no dependencies, validates identifiers
and relationships before writing, and replaces only `test-data/scholarize.dump.json`.
The same reference date produces the same output.

## Contents

| Section | Contents |
| --- | --- |
| `metadata` | Format, reference date, and limitations |
| `entities` | 8 users, 3 roles, 4 departments, 3 research types, and linked records |
| `entities.papers` | 16 papers: 8 published, 4 awaiting, 3 rejected, 1 unpublished |
| `entities.collaborations` | 2 active groups, 1 archived group, and a pending invite |
| `entities.tasks` | 18 tasks across 4 statuses, including unassigned and priority tasks |
| `entities.subtasks` / `comments` | 36 subtasks and 9 task comments |
| `entities.schedules` | 9 events, including past events and weekly recurrence metadata |
| `entities.folders` / `files` | 9 folders (3 empty) and 12 file metadata records |
| `entities.notifications` | Read, unread, and invitation examples |
| `entities.chatSessions` | A saved conversation with page citation metadata |
| `sessions` | 7 session-shaped fixtures for active users |
| `apiResponses` | Request method, path, acting user, HTTP status, and response body |
| `scenarios` | Empty lists, expired token, forbidden, missing paper, and service failure |

The default fixture user is `Sok Dara`, user ID `1`, email `dara@example.test`.
User `4` is a department head for approval UI tests. User `7` has a pending
invitation. User `8` is inactive and has no session fixture. All names and
addresses are fictional.

## Use in tests

Example from a CommonJS test or mock handler in the project root:

```js
const dump = require("./test-data/scholarize.dump.json");

const fixture = dump.apiResponses.find(
  (item) => item.id === "repository-papers",
);

const response = new Response(JSON.stringify(fixture.body), {
  status: fixture.status,
  headers: { "Content-Type": "application/json" },
});

const studentSession = dump.sessions.find((item) => item.user.id === 1);
const expiredToken = dump.scenarios.expired_token;
```

For component tests, `fixture.body.papers` matches the research paper store's
input. The task board fixture is `tasks-201`, folder fixtures include
`files-701` and `files-703` (empty), and the publication fixtures are scoped by
user, such as `publications-user-1`. `calendar-user-1` contains the combined
calendar response. `chat-answer` is a POST response from the separate semantic
search service, identified by its `service` field.

`apiResponses[].body` is the backend JSON response, before frontend server
actions add wrappers such as `{ success: true, data: body }`. Match paths,
query parameters, and `acting_user_id` in your mock handler. Multiple users
have fixtures for the same endpoint; selecting by fixture ID is simplest.
Date values are ISO strings and should be converted to `Date` objects where a
component expects them.

The data is not automatically loaded by the app. It does not start a mock
server, configure fetch interception, bypass NextAuth, or seed a backend.
Tokens and invite codes are inert placeholders, not usable credentials.
PDF and attachment paths are metadata placeholders; binary files are not
included, so download/PDF rendering tests need actual sample assets.

For a database seed, use the backend's real migrations/schema to map these
entities to tables and constraints.
