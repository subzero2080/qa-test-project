# AutoRun QA — Product & Engineering Build Specification

**Status:** Implementation blueprint  
**Product:** AutoRun QA (MCP-connected application debugging and verification)  
**Primary customer:** Developers building and maintaining SaaS/web applications with Claude Code, Cursor, or another MCP-capable AI agent  
**Core philosophy:** The user's AI understands the code. AutoRun QA stores and orchestrates tests. Playwright executes browser/API checks. AutoRun QA independently verifies assertions, retains evidence, and enables repeatable regression testing.

> **Instructions to Claude Code:** Build the application specified below. Treat this document as the product requirements and implementation blueprint, not a brainstorming prompt. Make reasonable implementation decisions where details are unspecified, preserve the stated scope and subscription tiers, and maintain an implementation checklist in the repository. Do not claim a feature or test works until it has actually been exercised. Prefer working end-to-end functionality over placeholder buttons or mock integrations. Never silently weaken the safety controls.

## 1. Product goals and non-goals

Build a clean, minimal SaaS dashboard with a powerful MCP-connected debugging engine. Users select one of their projects, maintain a Trello-style test board, launch tests, monitor execution, and inspect detailed historical evidence. Claude can inspect the user's own codebase, propose tests, construct project-specific steps, submit tests through MCP, and later retrieve failures. AutoRun QA must also be able to execute *saved repeatable tests without an active Claude session*.

**Product goals**

1. Make recurring application testing simple and reliable, especially signup, login, email verification, Stripe test checkout, subscription cancellation, navigation, UI, and responsive behavior.
2. Support arbitrary project-specific tests through a structured test definition and exploratory AI-assisted discovery.
3. Use local execution by default to minimize AutoRun QA operating expenses and preserve user control. Add hosted cloud execution as a metered option.
4. Combine browser and API assertions when appropriate; neither should be treated as a universal substitute for the other.
5. Retain reproducible evidence: status, steps, assertions, screenshots, browser traces, console/network errors, and optional video.
6. Keep a permanent, reusable definition of each test distinct from its individual execution runs.
7. Provide safeguards against destructive operations, real charges, account changes, production writes, credential leaks, and unsafe cleanup.

**Non-goals initially:** Building a new browser automation framework, a proprietary browser, a code editor/IDE, a complete replacement for Claude Code, automatic codebase repairs without permissions, or universal automatic understanding of any website from a one-line natural-language prompt.

## 2. UX, navigation, and primary screens

Design: restrained, developer-oriented, fast, responsive, accessible; strong typography, minimal decoration, light/dark mode, sensible empty states, loading states, and keyboard support. All data is scoped to the selected project. Use a project selector at the **upper left** of the application shell, showing current project and subscription usage (e.g., `Project 1 of 3` for Developer).

### Sidebar

1. **Dashboard** — summary of pending, running, passed, failed, blocked tests; active runs with progress and Stop button; most recent activity; project health; clear local-runner online/offline status; recent failures and next actions.
2. **Test Board** — horizontally scrolling, draggable Trello-style columns representing *Test Groups* (e.g., Onboarding, System UX, Billing, Permissions). Each column contains draggable, reorderable *Test Cases*. Users can add, edit, delete, reorder, duplicate, and move groups/cards. Each case contains reorderable steps, expected outcomes/assertions, fixtures, environment, execution method, recording settings, safety category, run controls, last result, and history link.
3. **Test Runs** (the “Tests Completed” concept) — history table with group headers/filters, sortable by date, outcome, duration, environment, execution source, and test title. Include screenshot/video/trace indicators, notes, and error summaries. Clicking a result opens a **full-screen detailed overlay** with step-by-step timeline, assertions and exact observed values, screenshots, video playback (when available), console logs, network failures, attachments, and previous run comparison. A run remains in history even if the test case is edited or subsequently passes.
4. **Test Bank** — project-specific testing resources: environments, dedicated test accounts and roles, credentials/secrets (never display raw values after saving), email verification inboxes, Stripe test settings and safe test card references, API credentials, reusable fixtures, seeded data, test files, reusable test templates, and cleanup policies. Global templates are distinct from project-specific configurations.
5. **Settings** — project URL, environments (localhost/staging/production), MCP installation/connect instructions, local runner setup and pairing, available browsers, connected integrations, allowed domains, project policies, cloud usage, billing, membership, retention, recording controls, and emergency-stop settings.

### Dashboard details

- Statuses: **Draft, Ready, Queued, Running, Passed, Failed, Blocked, Cancelled**. Separate *test-case last status* from *run status* and from *bug fixed/resolved* status.
- Show what execution infrastructure is available: local runner connected, existing Chrome browser available, cloud runner credits, API connectivity.
- Real-time updates via server events/WebSockets or equivalent authenticated subscription.
- Support single case, whole group, selected cases, and all-ready-tests execution.
- Show pending approvals/required setup instead of failing mysteriously.

### Test Board sample data for UI development

**Onboarding:** “Sign up and create user,” “Verify signup email,” “Stripe sandbox checkout,” “User cancels subscription and entitlements update.”  
**System UX:** “Dark/light mode works,” “Menus visible with sufficient contrast,” “Responsive navigation on mobile.”  
Use example data only in preview or seed mode, not as fake production results.

## 3. Data model

Use a robust relational schema with migrations, tenant isolation, indices, auditing and sensible pagination. Recommended entities:

- **User, Organization/Workspace, Membership** (role: owner/admin/member/viewer), **Subscription/Entitlement**, **Project** (name, URLs, allowed domains, settings).
- **Environment** (local/staging/production, base URL, safety classification, access constraints).
- **TestGroup** (project, title, ordered position).
- **TestCase** (group, title, description, order, expected business behavior, test kind, risk level, enabled, latest revision, latest status).
- **TestCaseRevision** (immutable version of steps, assertions, credentials references, execution requirements, and compiled recipe). Preserve the revision used by each run.
- **TestStep** and **Assertion** (structured typed DSL below; explicit expected outputs).
- **TestRun** (project/case/revision, execution type, origin, environment, queued/start/end, status, duration, runner version, cancellation, errors, metrics, verification result).
- **TestStepResult** (step times, status, observed/expected, artifacts, redacted logs).
- **Artifact** (screenshot/video/trace/log/HAR where safe; object storage URL/key, retention, size, redaction state).
- **TestBankEntry / SecretReference** (scoped fixture, inbox, account, integration, nonsecret metadata). Encrypt secrets with managed KMS or equivalent; never store plaintext credentials in test instructions.
- **RunnerRegistration** (project/workspace access, device id, pairing state, short-lived credentials, online status, last heartbeat, version, capabilities).
- **ExecutionJob / Lease** (queue status, worker ownership, retry policy, idempotency key, stop flag).
- **AuditEvent** (who created/edited/executed/approved; security-sensitive actions).

Use stable IDs, tenant-scoped authorization on every API/MCP query, and soft-delete or archive strategies where required to preserve historical evidence.

## 4. Execution architecture

### Four execution mechanisms

**A. Local isolated Playwright browser (default):** A small user-installed AutoRun QA companion/runner application runs on their computer, receives authorized execution jobs, launches its own Chromium/Firefox/WebKit browser via Playwright (headed or headless), and streams status/artifacts to AutoRun QA. It does *not* take over the user's mouse/keyboard. Their computer must remain on, and their local companion must be running.

**B. Existing Chrome browser session:** A supported browser-extension/Chrome connection lets the runner automate an authorized existing Chrome tab, including authenticated state when explicitly selected. This occupies the controlled tab, but the user can continue working elsewhere. Prefer reusing supported Playwright extension integrations initially; only write a proprietary extension if necessary. Do not assume access to restricted pages, other profiles, or private Chrome internals.

**C. Cloud Playwright:** Hosted isolated browser containers or a hosted browser provider execute tests without an open local computer or active user Claude session. Only publicly reachable/appropriately connected environments are available; `localhost` is not reachable from cloud by default. Meter browser-hours, concurrency, artifacts and retries. Do not expose internal/private-network targets by default. Add cloud execution with the existing job/runner abstraction, not a second test engine.

**D. API/backend execution:** Use Playwright's APIRequestContext or equivalent audited HTTP client for API assertions. Run through local or cloud runners. Optional explicit integrations support server logs, test database access, Stripe test API, and webhook verification. Browser/API tests may run together in one test case. API success alone must not be treated as proof that a user-facing button or workflow works.

**Screenshots, recordings, and traces are evidence settings, NOT a fifth execution method.** Provide screenshot-on-failure and screenshot-on-success; capture console/network errors; support traces on browser tests; video recording optional and enabled by default when sensible. Honor retention quotas and secret redaction.

### Claude's role versus AutoRun QA's role

- **Claude:** Understands project source, determines what to test, authors structured recipes or scripts, performs exploratory investigation when required, interprets complex failures, and—if user-authorized in the user's coding environment—changes application source code.
- **AutoRun QA:** Owns sessions, test definitions, revisioning, run scheduling, assignment to an available runner, credentials policy, safety gates, artifact capture, explicit pass/fail assertion evaluation, history, notifications, and reporting.
- **Playwright:** Executes precise browser and API actions; it does not natively interpret arbitrary English and does not autonomously fix application bugs.
- **Optional AutoRun QA AI fallback:** A small hosted model may diagnose broken locators or unfamiliar page structure when deterministic execution becomes blocked. Limit calls and spending per run. Never let an AI rewrite a failed business assertion just to force a pass, bypass permission boundaries, or execute destructive actions without authorization.

**Important orchestration rule:** A remote MCP server cannot unilaterally “wake up” the user's connected Claude Code session. MCP permits tool use by a connected client; asking Claude to continue in the background requires a separately supported local agent/bridge and explicit user setup. Without that, record a blocked task for later Claude investigation or use AutoRun QA's own explicitly authorized AI fallback. Do not advertise autonomous user-Claude callbacks that have not been implemented.

### Repeatable versus exploratory execution

1. **Exploratory:** The user's Claude/agent, with connected authorized browser tools, discovers selectors, transitions and requirements. AutoRun QA captures suggested steps/results. It must convert them into a valid repeatable recipe and actually test the recipe before marking it Ready.
2. **Deterministic replay:** An already validated structured recipe or Playwright script runs through the AutoRun QA companion/cloud worker **without Claude issuing each click**. Store its exact revision and results.
3. **Fallback:** If a selector breaks or a page unexpectedly changes, first use explicit alternative locators and retry policies; optionally call a budget-limited AI to identify a candidate fix. Only automatically repair the *test implementation* when the intended assertions stay unchanged; record all changes and revalidate. An application failure remains Failed, not silently bypassed.

### Structured test definition

Provide a versioned, validated DSL or schema. Do not accept arbitrary code from an untrusted client on shared cloud infrastructure without robust sandboxing. Example:

```yaml
version: 1
name: Signup and verify account
kind: browser_api
risk: creates-test-data
environment: staging
baseUrlRef: project.staging
fixtures:
  email: testbank.generated_inbox
  password: testbank.generated_password
steps:
  - action: navigate
    url: /signup
  - action: fill
    locator: { role: textbox, name: Email }
    valueRef: fixtures.email
  - action: fill
    locator: { label: Password }
    valueRef: fixtures.password
  - action: click
    locator: { role: button, name: Sign up }
  - action: wait_for_email
    inboxRef: fixtures.email
    subjectPattern: verify
    timeoutSeconds: 90
  - action: follow_email_verification_link
    inboxRef: fixtures.email
  - action: assert_visible
    locator: { text: Account verified }
  - action: assert_url
    pattern: /dashboard
assertions:
  - kind: no_uncaught_browser_errors
    severity: warning
capture:
  screenshots: success_and_failure
  video: true
  trace: true
cleanup: test_users_only
```

Support typed actions such as navigate, click, fill, select, upload fixture, wait for element, wait for email, follow verification link, assert text/visible/URL, assert API status/schema/body, assert authorized backend state, capture screenshot, and explicit wait conditions. Validate selectors and domains and provide useful errors when requirements cannot be resolved. The sample above is illustrative: final DSL may differ, but it must have typed steps, expected outcomes, fixture references, and safety metadata.

## 5. Test Bank and high-value reusable patterns

Build **two layers**:

- **Reusable Test Template Library** (platform-provided, versioned): signup, email verification, login/logout, reset password, profile editing, Stripe sandbox checkout, subscription cancellation, form submission, navigation, dark/light modes, contrast/accessibility, responsive layouts, role permissions, API endpoints, webhook lifecycle, and regression suites. Templates supply expected phases and configurable assertions, not magical universal selectors.
- **Project Test Bank** (user-owned): per-environment base URL, test credentials, email addresses/inboxes, ephemeral test identities, fixtures, Stripe test keys/webhook references, expected redirect URLs, endpoint descriptions, permitted cleanup routines, and permitted actions.

### Email verification

- Support unique AutoRun QA-managed test inbox aliases (per project, run or test identity) using a configurable inbound email provider; receive messages through authenticated webhook/inbound pipeline, match reliably to the test run, extract verification link/code, and expire/delete retained mail appropriately.
- Support user-supplied test inboxes through a secure integration as fallback. Do not ask users to paste normal mailbox passwords if safer provider-specific auth is available.
- Prevent cross-project email disclosure. Handle resend delays, timeouts, multiple emails, expiring codes, and anti-temporary-mail domain restrictions.

### Stripe testing

- Use publicly documented Stripe **test-mode** cards and test keys only; store references to standard fixtures rather than secrets in scripts.
- Verify test/sandbox mode from configured Stripe credentials and relevant checkout/session/environment state **before any payment execution**. A test card number alone does not prove sandbox mode.
- Test checkout, webhook receipt, subscription activation, cancellation mode (immediate or period-end per application rules), entitlements, and subscription status using both UI and API/integration assertions as appropriate.
- Block real-charge payment tests unless a distinct future feature defines explicit specialized safeguards; do not implement real charges in initial scope.

## 6. Security and production safety — non-negotiable

1. **Environment classification:** staging/local preferred. Production read-only by default; state-changing production tests require explicit per-action permission and verified scope. Destructive/financial tests blocked on production by default.
2. **Allowed domains and SSRF defense:** enforce project-specific host allowlists at coordinator and runner; block cloud access to internal IP ranges, cloud metadata endpoints and sensitive network destinations unless a separately isolated, explicitly authorized mechanism exists. Recheck redirect destinations.
3. **Test identity isolation:** use test accounts, synthetic data, dedicated test Stripe assets, and least-privileged integration credentials. Never use real customer data by default.
4. **Secrets:** encrypt at rest and transit; avoid passing passwords back to Claude or exposing them in tool responses, logs, traces, screenshots or videos. Use scoped ephemeral tokens for local runner and signed upload URLs; rotate/revoke credentials.
5. **Protected operations:** explicit authorization gates for deleting accounts, resetting databases, issuing refunds, sending mass messages, changing billing, and similar destructive/irreversible actions. Approval is bound to specific project, environment, action and run.
6. **Cleanup:** only delete artifacts/data that AutoRun QA created or that the user explicitly designated for cleanup; use idempotent identifiers, preview/dry run when needed, and audit trails. Do not run broad `DELETE` statements.
7. **Emergency Stop:** terminate queued/running jobs and close test browser contexts; cancellation must propagate to local/cloud workers and audit the event.
8. **Cloud isolation:** per-job containers/browser contexts, resource limits, concurrency quotas, sandboxed untrusted scripts, no unrestricted shell/network/filesystem permissions, and strict tenant isolation.
9. **Do not bypass CAPTCHAs, anti-abuse protections or third-party security controls.** Mark such runs Blocked and report a supported staging/test configuration alternative.
10. **Evidence redaction:** screenshot/video recording can contain personal data or secrets; use dedicated test data and configurable masking, access controls, retention, and deletion. Retain trace/network data with redaction to avoid leaking auth headers/cookies.
11. **Trust boundary:** Claude-provided instructions and web page content are untrusted inputs; constrain to approved actions and domains and never let page text instruct the platform to execute unrelated operations.

## 7. MCP integration and API

Use a maintained MCP TypeScript SDK and a documented, authenticated MCP integration appropriate for Claude Code and other clients. Offer simple copyable setup/configuration. Implement project-scoped tools with well-defined schemas and actionable results; add full documentation and examples.

Suggested MCP tools (names flexible but behavior required):

- `list_projects`, `get_project`, `list_environments`
- `list_test_groups`, `create_test_group`, `reorder_test_groups`
- `list_test_cases`, `get_test_case`, `create_test_case`, `update_test_case`, `reorder_test_cases`, `archive_test_case`
- `list_test_templates`, `instantiate_test_template`, `validate_test_case`
- `get_test_bank_metadata`, `request_fixture` (never expose raw secrets)
- `start_test_run`, `start_test_group_run`, `get_run_status`, `list_test_runs`, `get_run_results`, `cancel_test_run`
- `get_failed_tests`, `get_run_artifact_links`, `add_test_run_note`, `propose_test_repair`

MCP calls must enforce plan limits, auth, project selection, security policies and idempotency. Support polling run IDs since browser jobs can outlast a single MCP tool-call timeout. Return concise, structured failure summaries that minimize Claude token usage, with detailed diagnostics available on request. Use short-lived artifact links instead of returning binary/video content inline.

Make the backend API usable by both dashboard and local worker; do not duplicate business logic in the MCP layer.

## 8. Local companion / worker

The user installs a small, signed (when distributing) desktop/CLI helper once. It securely pairs with their AutoRun QA account and registered project, advertises supported browser environments, polls/subscribes for assigned jobs, runs Playwright, captures evidence, streams heartbeats/results and reports offline status. Support macOS first, design for Windows/Linux. Provide clear install, upgrade, uninstall, and troubleshooting instructions.

- Default headless isolated browser so user can continue working. Optional headed visual mode for observing tests.
- Existing Chrome mode must require user selection/consent and avoid controlling a tab they are actively using.
- The web dashboard **cannot itself start a local browser** without a paired companion/extension; clearly communicate disconnected or offline status.
- The runner should support local-only URLs (including localhost), validate per-job authorization, support cancellation and timeouts, and avoid broad filesystem access.
- Keep local raw data local where possible; upload only configured redacted evidence. Use backpressure/size limits for artifacts.

## 9. Cloud runner and recurring execution

Cloud runner interface should implement the same validated job contract as local runners and return equivalent structured results.

- Prefer configurable provider integration or isolated Playwright containers; avoid hardcoding a single vendor.
- Assign browser-hours, elapsed run time, concurrency and storage usage to an organization/project; enforce quota and overage policy.
- Scheduled and CI-triggered regression testing requires an online executor (cloud runner or user-supplied always-online CI/local worker). Never imply that an offline local computer can execute scheduled jobs.
- Provide GitHub/deployment integration at Pro+ for triggering suites on push, PR preview readiness or deployment. Verify target environment is reachable before starting.
- Support scheduled runs on Pro+ with time zone-aware schedules, queues and retry limits; tests should be idempotent where possible.
- Use an explicit external network/credential permission model for cloud execution; handle sites requiring VPN, IP allowlisting or local access as Blocked, not false failures.

## 10. Test execution, evidence, and failure handling

Test run lifecycle: `Draft -> Ready -> Queued -> Running -> Passed | Failed | Blocked | Cancelled`; backend should enforce valid transitions. Some individual assertions may warn while overall outcome passes according to configured rules.

For each run:

1. Validate user/project/plan, environment, test revision, fixture availability, allowed domains, action permissions, runner availability and quotas.
2. Resolve runtime fixtures and issue time-bound access to secrets; never persist secrets in job payload history.
3. Execute Playwright steps and/or API calls with timeouts, explicit assertions, deterministic waits, controlled retry limits and clear step-level timings.
4. Capture screenshots, console errors, network failures, trace, video when configured, plus observed/expected assertion values.
5. Return `Passed` only if the required assertions actually pass. Distinguish product failures from test-script errors, environment/setup failures and blocked permissions.
6. Upload redacted artifacts using scoped URLs; save immutable results and link to Test Case and Test Group; emit live progress.
7. Optionally attempt locator/test-script repair on recoverable execution failures. Preserve test revision and change history, require validation before accepting proposed updates, and do not change required assertions.
8. Show user-friendly failure explanations and allow Claude to fetch exact structured evidence.

**Recording defaults:** screenshot on pass/fail; capture browser console/network errors; browser trace whenever supported; video optional (enabled by default for UI/browser tests, with retention/storage controls). API-only tests have structured request/response evidence rather than fake video. Redact all secrets and sensitive headers; ensure masking of sensitive DOM inputs when possible.

**Full-screen Run Details** should support video playback, screenshot gallery, trace download/view, step timeline, assertion table, errors, execution metadata, notes, and compare to previous run. Never pretend artifacts exist when capture failed.

## 11. Subscription plans — KEEP EXACT AGREED PRICING

**Developer — $19.99/month**
- 1 user, **3 projects**.
- Full browser debugging tools, API/network debugging, MCP connectivity, Chrome connection and unlimited **local** test execution.
- Persistent sessions, Test Board, Test Bank, screenshots and traces; locally generated videos permitted.
- **7 days** hosted artifact/evidence retention.
- No hosted browser-hours allowance; no automated recurring regression suite/scheduled retesting, visual regression automation, deployment triggers, or team collaboration.

**Pro — $49.99/month**
- 1 user, **10 projects**.
- Everything in Developer, plus reusable regression suites, scheduled testing, visual regression comparisons, GitHub/deployment integration, cloud-stored recordings and **90 days** evidence retention.
- **10 cloud browser hours/month** included, subject to actual available hosted capacity and fair usage controls.

**Team — $99.99/month**
- **5 included users**, **unlimited projects** within reasonable abuse controls.
- Everything in Pro, plus shared test history, collaborative workflows, member roles, approvals, and team reporting.
- **50 cloud browser hours/month** included; **1 year** evidence retention.

**Across all tiers:** Unlimited local test executions (subject to reasonable security, API rate limits and infrastructure abuse controls). User supplies their own Claude/AI model access; AutoRun QA does not bundle unrestricted Claude inference. Any AutoRun QA-hosted AI fallback is metered/capped. Cloud usage beyond allowances must be blocked or require explicit paid add-on consent, never incur silent unexpected costs.

**Important implementation detail:** Implement actual entitlements and subscription enforcement in the database/API/MCP and dashboard. Keep these prices/limits constant; do not invent a fourth tier or revise the agreed plans. Payment processing itself must be integrated in test mode during development, live only after explicit launch configuration.

## 12. Recommended implementation stack

Use existing repository architecture if one already exists. Otherwise sensible defaults:

- **Dashboard/API:** Next.js App Router + TypeScript, accessible component library, Tailwind CSS.
- **Database/auth:** Postgres/Supabase with row-level security or equivalent strict tenant policy.
- **Realtime jobs:** durable queue with leased jobs, retries, cancellation and heartbeat (e.g., Postgres-backed queue initially; separate worker when needed).
- **Object storage:** R2/S3-compatible storage for screenshots/videos/traces with private buckets and signed URLs.
- **MCP:** TypeScript MCP SDK with authenticated remote endpoint and copyable configuration for supported Claude Code clients.
- **Browser/API execution:** Playwright with isolated browser contexts. Keep runner logic as a reusable package shared by local and cloud workers.
- **Cloud:** container-based isolated workers or replaceable managed browser provider adapter.
- **AI fallback:** optional provider adapter, limited to recoverable test-execution problems with token/cost budgets, audit, and explicit disable switch.
- **Billing:** Stripe subscriptions for AutoRun QA plans (distinct from the users' Stripe test integrations).

Avoid requiring a specific hosting vendor, but keep implementation concrete and deployable. Document all env vars, secrets, migrations, and integration setup.

## 13. Implementation order / acceptance gates

Build in vertical slices rather than only generating UI and stubs.

### Phase 1 — Working foundation

- Auth, workspace, project switcher with Developer three-project limit.
- Dashboard and working draggable Test Board; create/edit/delete/reorder groups/cases and steps.
- Database schema, revisioning, secured API/MCP tools, job state machine.
- Local Playwright companion and local isolated Chromium execution. Pairing and connected/offline status.
- Successful end-to-end signup test using a deterministic staging demo app; assert actual outcome, save screenshot/trace and view history/detail overlay.
- Basic Test Bank for staging URL, test identity, credentials, fixture references and safety rules.

**Acceptance gate:** A user connects Claude, Claude creates an onboarding test via MCP, user launches it from AutoRun QA, local Playwright actually executes it, and AutoRun QA shows truthful status and replayable evidence.

### Phase 2 — Common test coverage and robustness

- Built-in repeatable templates: signup/login/logout/password reset/UI/navigation/forms.
- Unique inbound email test addresses and email verification automation.
- Stripe sandbox checkout/cancellation pattern with API verification, explicit test-mode guardrails and webhook checks.
- Direct API testing, mixed browser+API assertions, error categorization, timeout/retry policy and cleanup.
- Recordings, trace viewer, redaction, artifact retention; optional hosted AI recovery and proposed test-repair workflow.

**Acceptance gate:** Signup + email verify + dashboard access works; Stripe sandbox checkout and cancellation work without real payment operations; negative test examples correctly fail or block.

### Phase 3 — Pro automation + cloud

- Cloud runner using same job format, hours metering and 10/50 included hours.
- Saved regression suites, visual regression, scheduled testing, GitHub/deployment triggers.
- Retention enforcement, quota enforcement, billing entitlements and usage visibility.

**Acceptance gate:** Pro user can run the same saved suite headlessly without local machine online, within allotted cloud hours, and inspect immutable results.

### Phase 4 — Team and polish

- Team memberships, approvals, shared reporting, audit views, additional platform integrations.
- Windows/Linux local companion support, concurrency controls, deeper performance/accessibility diagnostics and broad template coverage.
- Production hardening: security reviews, integration tests, load testing, alerting, error monitoring, backup/recovery.

**Acceptance gate:** Multiple team members can operate shared projects with correct roles and data isolation; Team cloud quota, evidence retention and approvals are correctly enforced.

## 14. Required automated and manual tests for AutoRun QA itself

- Auth and tenant isolation; a user cannot query another organization's projects, tests, secret metadata, artifacts or run results.
- Entitlement enforcement at UI, API, MCP and worker dispatch boundaries (3/10/unlimited projects, users, cloud hours, feature gates, retention).
- Group and card drag-and-drop persist order after reload; concurrent edits have defined behavior.
- Test revision immutability and run linkage; deleting/editing a card does not falsify prior results.
- Playwright runner can launch/close a browser without taking over user desktop; offline, timeout, crash, retry, cancellation and reconnect handling.
- Read-only production policy, domain restrictions, redirect validation, SSRF prevention, secret redaction and destructive-action approval tests.
- Correctly distinguish Failed from Blocked; no AI fallback converts failing assertions to Passed.
- Email inbox isolation, one-time code matching, expired messages, duplicate messages and webhook spoofing resistance.
- Stripe *test* mode guard detects live-mode misconfiguration before execution.
- Full-screen result overlay loads only authorized artifacts with working download/playback, privacy settings and retention behavior.
- Cloud job isolation, quota accounting and limit behavior; no unapproved overage.

## 15. Definition of done

The product is not complete when screens render. It is complete when authorized users can connect an MCP client, create test cases, run real browser/API tests locally or in the cloud according to entitlement, get accurate pass/fail/blocked statuses, view actual screenshot/video/trace artifacts, reuse tests across code changes, and operate safely across staging and production boundaries. All key actions must have working error handling, user-facing feedback, backend authorization and automated coverage.

**Build notes:** Document any deferred capabilities honestly in `IMPLEMENTATION_STATUS.md`, with completed functionality, known limitations and exact setup instructions. Do not represent placeholders, simulated results or unwired integrations as working functionality. Implement and verify each phase before proceeding to the next. Preserve the pricing and feature distinctions above.
