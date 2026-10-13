export interface Service {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  engagement: string;
  proof: { slug: string; label: string };
}

export const services: Service[] = [
  {
    id: 'platforms',
    title: 'Kubernetes & GitOps platforms',
    summary:
      'A deploy pipeline your team trusts: every change through Git, a preview environment per pull request, and gates that catch mistakes before production does.',
    deliverables: [
      'K3s or managed Kubernetes with Flux GitOps',
      'Review apps per pull request, dev/QA/prod promotion',
      'Postgres with backups, TLS, sealed secrets',
      'Prometheus, Grafana, logs and alerting',
    ],
    engagement: 'Fixed-scope build or audit of an existing cluster, then optional ongoing support.',
    proof: { slug: 'homelab', label: 'K3s homelab platform' },
  },
  {
    id: 'web',
    title: 'Django & Python web apps',
    summary:
      'Production web apps with tests, migrations that are checked in CI, and privacy and multi-tenancy designed in from the start, not bolted on.',
    deliverables: [
      'Django apps from MVP to multi-tenant SaaS',
      'Auth, billing hooks, admin back office',
      'Test suites that guard the rules that matter',
      'Containerised, deployed and monitored',
    ],
    engagement: 'Fixed-scope build, or a retainer to extend and maintain an existing app.',
    proof: { slug: 'r12d', label: 'r12d' },
  },
  {
    id: 'data',
    title: 'Data pipelines & scraping',
    summary:
      'Collectors that keep working when sources change: scheduled jobs, validation gates, replayable failures and clean data in Postgres or your warehouse.',
    deliverables: [
      'Scrapers for HTML, PDF, CSV and hostile sites',
      'Validation, de-duplication and failure snapshots',
      'APIs, exports and dashboards on top',
      'Alerting when a source breaks',
    ],
    engagement: 'Fixed-scope pipeline build, plus optional monitoring and repair.',
    proof: { slug: 'warn-index', label: 'WARN Index' },
  },
  {
    id: 'ai',
    title: 'AI & LLM integration',
    summary:
      'LLM features that earn their place: enrichment and extraction with confidence scores, agent workflows with a human review step, and costs you can predict.',
    deliverables: [
      'LLM enrichment and extraction pipelines',
      'Agent workflows that open PRs, not surprises',
      'Evaluation against real data before rollout',
      'Rate limits, retries and cost controls',
    ],
    engagement: 'Short discovery to find the right use case, then a fixed-scope build.',
    proof: { slug: 'warn-index', label: 'WARN Index enrichment' },
  },
];
