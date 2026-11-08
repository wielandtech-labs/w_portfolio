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
      'Every change goes through Git, every pull request gets its own copy of the app, and the pipeline catches mistakes before production does. It is the setup I run at home for 12 apps.',
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
      'Django apps with real tests, migrations checked in CI, and privacy and multi-tenancy designed in from the first model.',
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
      'Scrapers that assume the source will change. Scheduled jobs, validation, a saved snapshot of every failure, and clean data in Postgres or your warehouse.',
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
      'LLMs where they actually help: enrichment and extraction with a confidence score on every answer, agents that hand a human a pull request to review, and costs you can predict.',
    deliverables: [
      'LLM enrichment and extraction pipelines',
      'Agent workflows that end in a reviewed PR',
      'Evaluation against real data before rollout',
      'Rate limits, retries and cost controls',
    ],
    engagement: 'Short discovery to find the right use case, then a fixed-scope build.',
    proof: { slug: 'warn-index', label: 'WARN Index enrichment' },
  },
];
