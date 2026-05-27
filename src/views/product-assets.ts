import puppetIcon from "./assets/brand/logo-puppet-icon-reg.svg";
import puppetWord from "./assets/brand/logo-puppet-reg.svg";
import puppetCloudOpsWord from "./assets/brand/logo-puppet-cloudops-reg.svg";
import delphixIcon from "./assets/brand/logo-delphix-icon-reg.svg";
import delphixWord from "./assets/brand/logo-delphix-reg.svg";
import perfectoIcon from "./assets/brand/logo-perfecto-icon-reg.svg";
import perfectoWord from "./assets/brand/logo-perfecto-reg.svg";
import p4Icon from "./assets/brand/logo-p4-icon-reg.svg";
import p4Word from "./assets/brand/logo-p4-reg.svg";
import blazemeterIcon from "./assets/brand/logo-blazemeter-icon-reg.svg";
import blazemeterWord from "./assets/brand/logo-blazemeter-reg.svg";

import { PRODUCTS, type ProductCore, type ProductId } from "@/products.js";

export interface StarterChip {
  label: string;
  seed: { problem: string; outcome: string; audience: string };
}

export interface ProductExample {
  title: string;
  problem: string;
  outcome: string;
  audience: string;
}

export interface ProductBrand {
  iconSrc: string;
  wordmarkSrc: string;
  tint: string;
  starterChips: StarterChip[];
  examples: ProductExample[];
}

export interface ProductView extends ProductCore, ProductBrand {}

const SOFT_INDIGO = "rgba(76, 0, 255, 0.08)";

const PUPPET_CLOUD_OPS_CHIPS: StarterChip[] = [
  {
    label: "Add SSO / SAML",
    seed: {
      problem:
        "Operator Console login is username/password only; enterprise customers can't enforce their IdP policies (MFA, session length, conditional access).",
      outcome:
        "SAML SSO with SCIM provisioning in the Identity component, with at least Okta and Azure AD certified.",
      audience: "IT and security admins at enterprise customers — table-stakes for SaaS procurement.",
    },
  },
  {
    label: "Dark mode",
    seed: {
      problem:
        "Operator Console is a light-only UI; on-call engineers running it overnight strain their eyes during incident response.",
      outcome:
        "A native dark mode toggle in user settings that persists across sessions, theming the entire Operator Console including charts and code panels.",
      audience: "On-call SREs and platform engineers who use the console for late-night incident triage.",
    },
  },
  {
    label: "New integration",
    seed: {
      problem: "Drift, policy-violation, and run-failure events from the Operator Console don't reach Slack/PagerDuty without custom webhooks.",
      outcome: "Native Slack and PagerDuty connectors with per-event-type routing rules configured from the Console.",
      audience: "Platform teams who operate via Slack and PagerDuty.",
    },
  },
  {
    label: "Better reporting",
    seed: {
      problem: "Reporting only shows raw run history; there's no executive view of compliance posture over time.",
      outcome: "Compliance-over-time dashboard with trend lines per benchmark, exportable for board reviews.",
      audience: "Eng leadership and compliance officers.",
    },
  },
];

const PUPPET_CLOUD_OPS_EXAMPLES: ProductExample[] = [
  {
    title: "Air-gapped edge connector",
    problem:
      "Customers in regulated industries can't connect edge nodes to a SaaS control plane over the public internet, blocking adoption.",
    outcome:
      "A bundled edge connector that pulls config over a customer-controlled jumphost / private link, with offline policy bundles synced every N hours.",
    audience: "Regulated industry customers (finance, healthcare, gov) — unlocks deals currently lost to self-managed.",
  },
  {
    title: "Drift auto-remediation rules",
    problem:
      "When the Operator Console detects config drift, ops still has to triage and decide whether to remediate manually.",
    outcome:
      "Policy-based auto-remediation rules with a 'simulate before apply' mode and a kill-switch per policy.",
    audience: "Platform engineers who want self-healing infra without runaway changes.",
  },
];

const PUPPET_ENTERPRISE_CHIPS: StarterChip[] = [
  {
    label: "Add SSO / SAML",
    seed: {
      problem:
        "Customers can't use their existing identity provider to sign in to Puppet — they manage Puppet users separately, which adds onboarding friction and audit complexity.",
      outcome:
        "Support SAML 2.0 SSO in the Console UI with at least Okta, Azure AD, and Google Workspace, plus SCIM provisioning so users and groups stay in sync automatically.",
      audience: "Platform / IT admins at enterprise customers who already centralize identity in an IdP.",
    },
  },
  {
    label: "Improve scale / performance",
    seed: {
      problem:
        "Catalog compiles slow down significantly past ~10k agents, leading to long deploy times and timeouts.",
      outcome:
        "Cut p95 catalog compile time by 50% at 25k+ agents through parallelization, caching, or compile-server scaling.",
      audience: "SREs running Puppet at large enterprises. Faster compiles = faster change deployment.",
    },
  },
  {
    label: "New integration",
    seed: {
      problem: "We can't easily orchestrate Puppet runs from our CI/CD pipeline without custom scripting.",
      outcome: "First-class GitHub Actions and GitLab CI integrations that trigger Puppet runs and gate deploys on success.",
      audience: "DevOps engineers using GitHub/GitLab as the source of truth for infra code.",
    },
  },
  {
    label: "Better reporting",
    seed: {
      problem: "Compliance teams need to prove config state across the fleet, but PuppetDB queries are too low-level for non-engineers.",
      outcome: "Pre-built compliance dashboards in the Console for CIS, PCI, and HIPAA benchmarks with one-click PDF export.",
      audience: "Compliance and audit teams plus the SREs currently fielding evidence requests.",
    },
  },
];

const PUPPET_ENTERPRISE_EXAMPLES: ProductExample[] = [
  {
    title: "Auto-rotate SSH keys via Bolt",
    problem:
      "Security policy requires SSH key rotation every 90 days across 3,000 Linux nodes, but there's no built-in Bolt task — teams write one-off scripts.",
    outcome:
      "A shipped Bolt task `puppet.ssh::rotate_keys` that rotates root and service-account keys with optional Vault integration, dry-run support, and a rollback path.",
    audience: "Security engineers and platform teams running mixed Linux fleets.",
  },
  {
    title: "Per-environment Forge module pinning",
    problem:
      "Forge module versions drift across dev/staging/prod because the Puppetfile is shared, causing 'works in staging' bugs at deploy.",
    outcome:
      "Allow Puppetfile to declare environment-scoped version constraints and resolve them at code-deploy, with a CLI command to diff resolved versions.",
    audience: "Module authors and release engineers.",
  },
];

const HELIX_CORE_CHIPS: StarterChip[] = [
  {
    label: "Improve large-file workflow",
    seed: {
      problem:
        "Game/film teams commit 5-50GB binary assets; current clients stall and CI checkouts time out.",
      outcome:
        "Resumable / parallel transfer for large binaries with adaptive chunking, plus a CI mode that pulls only changed files.",
      audience: "Game studios, film/VFX teams, and any shop versioning very large binary assets.",
    },
  },
  {
    label: "Better Git interop",
    seed: {
      problem:
        "Engineers prefer Git tooling, but Helix4Git is rough around the edges for monorepo workflows with large changelists.",
      outcome:
        "First-class Git mirror with bidirectional sync, status visibility in Swarm, and protected-branch parity with P4 protections.",
      audience: "Engineering orgs that want Helix for asset storage but Git ergonomics for code.",
    },
  },
  {
    label: "Add code review",
    seed: {
      problem:
        "Swarm reviews lack inline thread resolution and 'request changes' state, forcing teams to track review status in Jira.",
      outcome:
        "Modern review workflow in Swarm with resolvable threads, request-changes blocking, and required-reviewer policies per stream.",
      audience: "Engineering managers and tech leads working around current review gaps.",
    },
  },
  {
    label: "New integration",
    seed: {
      problem: "CI builds don't have rich context about which streams / changelists they map to.",
      outcome: "Native Jenkins and GitHub Actions plugins that expose stream and changelist metadata to pipeline steps.",
      audience: "Build / release engineers automating CI against Helix streams.",
    },
  },
];

const HELIX_CORE_EXAMPLES: ProductExample[] = [
  {
    title: "Stream-aware protections preview",
    problem: "Editing the protections table is high-risk because it's hard to predict who loses access after a save.",
    outcome:
      "A dry-run UI that diffs effective access for sample users/streams before committing protections changes.",
    audience: "Helix admins managing access for large, multi-stream depots.",
  },
  {
    title: "Build-server checkout cache",
    problem: "Every CI agent re-syncs full workspaces, costing build time and Proxy bandwidth.",
    outcome: "A cache layer that lets agents share immutable file contents across runs, with cache-hit metrics in Swarm.",
    audience: "Build infra teams running large CI farms against Helix.",
  },
];

const PERFECTO_CHIPS: StarterChip[] = [
  {
    label: "Add device coverage",
    seed: {
      problem:
        "Customers ship apps for the latest iPhone within a week of release, but Perfecto's Mobile Lab adds new devices weeks later.",
      outcome:
        "SLA of new flagship iOS/Android devices in the Mobile Lab within 5 business days of public release.",
      audience: "Mobile QA leads at consumer-app companies.",
    },
  },
  {
    label: "Improve test stability",
    seed: {
      problem: "Cross-browser tests flake at ~15% due to mobile network simulation inconsistency.",
      outcome: "Cut flake rate to under 3% via deterministic network simulation and a documented retry strategy.",
      audience: "QA engineers maintaining cross-browser/mobile suites.",
    },
  },
  {
    label: "New integration",
    seed: {
      problem: "Test results don't surface in our team's Slack channel without manual links.",
      outcome: "A Slack bot that posts pass/fail summaries with one-click links to failing test artifacts.",
      audience: "QA teams who operate primarily in Slack.",
    },
  },
  {
    label: "Better reporting",
    seed: {
      problem: "Smart Reporting shows test status but not 'time to green' trends over time.",
      outcome: "Trend dashboards for run duration, flake rate, and time-to-green per suite, with weekly digest emails.",
      audience: "QA managers tracking suite health metrics.",
    },
  },
];

const PERFECTO_EXAMPLES: ProductExample[] = [
  {
    title: "Scriptless mobile gestures library",
    problem: "Scriptless authoring covers taps and swipes, but advanced gestures still require code.",
    outcome: "A visual gesture builder in Scriptless covering all standard mobile gestures with replay preview.",
    audience: "QA generalists and product managers authoring tests without engineering help.",
  },
  {
    title: "Test sharding by historical duration",
    problem: "Parallel runs split by file count, so one shard runs 3x longer than the others, gating the pipeline.",
    outcome: "Auto-shard by historical run duration with a 'longest pole' visualizer in Smart Reporting.",
    audience: "Build engineers tuning CI pipeline wall-time.",
  },
];

const BLAZEMETER_CHIPS: StarterChip[] = [
  {
    label: "Scale load further",
    seed: {
      problem: "Current max concurrent virtual users is capped lower than what we need for peak-traffic simulation against our regional CDN.",
      outcome: "Lift max concurrent VUs by 5x with multi-region orchestration and built-in geo-distribution profiles.",
      audience: "Performance engineers running pre-launch load tests for high-traffic releases.",
    },
  },
  {
    label: "Improve API mocking",
    seed: {
      problem: "Mock Services can't replay production traffic patterns; we hand-roll mocks that drift from real APIs.",
      outcome: "Record-and-replay production traffic to Mock Services with stateful response logic and TTL-based decay.",
      audience: "API engineers writing contract tests against fast-moving backends.",
    },
  },
  {
    label: "New integration",
    seed: {
      problem: "BlazeMeter results live in their own portal; engineers want them as commit-level checks in GitHub.",
      outcome: "First-class GitHub Checks integration that gates PR merges on perf-budget regression.",
      audience: "Platform / DevEx teams who treat performance like a first-class CI signal.",
    },
  },
  {
    label: "Better reporting",
    seed: {
      problem: "Reporting shows per-run results but not regression trends across releases.",
      outcome: "Release-over-release regression dashboards with p95/p99 latency, error rate, and throughput trended.",
      audience: "Perf engineering leads tracking the long-term health of critical user flows.",
    },
  },
];

const BLAZEMETER_EXAMPLES: ProductExample[] = [
  {
    title: "Scenario builder from HAR files",
    problem: "Authoring realistic load scenarios from scratch is slow; engineers want to bootstrap from browser HAR captures.",
    outcome: "Drop a HAR file into BlazeMeter and get a runnable scenario with parameterized URLs, headers, and auth.",
    audience: "Performance engineers reproducing real-world user journeys quickly.",
  },
  {
    title: "Cost-aware test scheduling",
    problem: "Running on-demand load tests against AWS-hosted infra during business hours is expensive.",
    outcome: "Scheduling UI that pairs each test with a cost estimate and recommends low-cost windows / engine sizes.",
    audience: "FinOps-conscious performance teams.",
  },
];

const DELPHIX_CHIPS: StarterChip[] = [
  {
    label: "Add database support",
    seed: {
      problem:
        "We can't virtualize PostgreSQL 16 in Continuous Data — teams on PG16 are blocked from using Delphix for ephemeral environments.",
      outcome:
        "Native PG16 source support in Continuous Data with masking parity for built-in algorithms.",
      audience: "Database engineering teams modernizing onto PG16.",
    },
  },
  {
    label: "Improve performance",
    seed: {
      problem:
        "Provisioning a 2TB Oracle VDB takes ~25 minutes, too slow for on-demand CI test environments.",
      outcome:
        "Cut provisioning time to under 5 minutes through better snapshot reuse or lazy-clone improvements.",
      audience: "QA and platform teams running ephemeral test envs against real-shaped data.",
    },
  },
  {
    label: "New integration",
    seed: {
      problem: "VDBs are provisioned manually; we need to spin them up/down from our Terraform pipeline.",
      outcome: "A maintained Terraform provider for Delphix VDB lifecycle (create, refresh, snapshot, delete).",
      audience: "Platform / DevOps teams already using Terraform for infrastructure.",
    },
  },
  {
    label: "Better masking",
    seed: {
      problem: "Built-in masking algorithms don't cover newer PII patterns (crypto wallet addresses, FHIR identifiers).",
      outcome: "Add 10+ algorithms for modern PII patterns with consistent referential integrity across tables.",
      audience: "Data compliance engineers and dev teams masking production data for test.",
    },
  },
];

const DELPHIX_EXAMPLES: ProductExample[] = [
  {
    title: "Self-service VDB bookmarks",
    problem:
      "Developers want to share a specific point-in-time database state with a teammate, but there's no easy URL-shareable handle.",
    outcome: "Shareable VDB bookmarks with link-based access and TTL, viewable from the Self-Service UI.",
    audience: "Application developers debugging data-shaped issues with teammates or support.",
  },
  {
    title: "Encrypted snapshot replication to S3",
    problem: "DR strategy requires multi-cloud replication; current setup only supports same-region Engine pairs.",
    outcome: "Encrypted snapshot replication to S3-compatible object storage with integrity tests on restore.",
    audience: "Infrastructure / DR teams satisfying multi-region DR policies.",
  },
];

const BRANDS: Record<ProductId, ProductBrand> = {
  "puppet-cloud-ops": {
    iconSrc: puppetIcon,
    wordmarkSrc: puppetCloudOpsWord,
    tint: SOFT_INDIGO,
    starterChips: PUPPET_CLOUD_OPS_CHIPS,
    examples: PUPPET_CLOUD_OPS_EXAMPLES,
  },
  "puppet-enterprise": {
    iconSrc: puppetIcon,
    wordmarkSrc: puppetWord,
    tint: SOFT_INDIGO,
    starterChips: PUPPET_ENTERPRISE_CHIPS,
    examples: PUPPET_ENTERPRISE_EXAMPLES,
  },
  "helix-core": {
    iconSrc: p4Icon,
    wordmarkSrc: p4Word,
    tint: SOFT_INDIGO,
    starterChips: HELIX_CORE_CHIPS,
    examples: HELIX_CORE_EXAMPLES,
  },
  perfecto: {
    iconSrc: perfectoIcon,
    wordmarkSrc: perfectoWord,
    tint: SOFT_INDIGO,
    starterChips: PERFECTO_CHIPS,
    examples: PERFECTO_EXAMPLES,
  },
  blazemeter: {
    iconSrc: blazemeterIcon,
    wordmarkSrc: blazemeterWord,
    tint: SOFT_INDIGO,
    starterChips: BLAZEMETER_CHIPS,
    examples: BLAZEMETER_EXAMPLES,
  },
  delphix: {
    iconSrc: delphixIcon,
    wordmarkSrc: delphixWord,
    tint: SOFT_INDIGO,
    starterChips: DELPHIX_CHIPS,
    examples: DELPHIX_EXAMPLES,
  },
};

export const PRODUCT_VIEWS: Record<ProductId, ProductView> = Object.fromEntries(
  (Object.keys(PRODUCTS) as ProductId[]).map((id) => [
    id,
    { ...PRODUCTS[id], ...BRANDS[id] },
  ]),
) as Record<ProductId, ProductView>;

export function productView(id: ProductId): ProductView {
  return PRODUCT_VIEWS[id];
}
