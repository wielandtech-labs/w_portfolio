# AGENTS.md — wielandtech-labs app repo conventions

This repository builds a container image that deploys to the K3s homelab via
GitOps. The deployment manifests do NOT live here — they live in
`wielandtech-labs/w_homelab` under `clusters/{dev,qa,prod}/apps/<app>/`.

## Image tags drive deployments

`.github/workflows/docker.yaml` publishes to `ghcr.io/wielandtech-labs/<repo>`:

| Event | Tag | Effect |
|---|---|---|
| Push to `main` | `YYYYMMDD-HHMMSS-<shortsha>` | Flux Image Automation deploys it to **prod** (via a fast-forwarded PR on `flux/image-updates/prod`) |
| Push to any other branch | `dev-YYYYMMDD-HHMMSS-<shortsha>` | Flux Image Automation deploys it to **dev** (via `flux/image-updates/dev`) |
| Same-repo pull request | `pr-<number>-<shortsha>` | A per-PR **review app** at `https://pr-<number>-<app>.review.wielandtech.com` |

Never change these tag formats — Flux ImagePolicies and the review-app
automation in w_homelab parse them.

**A push to `main` is a production deploy.** Treat `main` accordingly: merge
only after the change was validated on a review app or in dev/qa.

## Promotion ladder

1. Open a PR → review app deploys automatically (merge the generated
   `chore(review): deploy ...` PR in w_homelab).
2. Merge or push a branch → dev environment tracks the newest `dev-*` tag.
3. Promote dev → QA with the w_homelab promotion workflow:
   `gh workflow run promote.yaml -R wielandtech-labs/w_homelab -f app=<app> -f to_env=qa`
4. Merge to `main` → prod tag published → Flux deploys; post-merge
   verification in w_homelab gates the result.

Rollback = revert the environment's HelmRelease image tag in w_homelab via PR.

## Build infrastructure

- Jobs run on the shared org runner pool: `runs-on: homelab-dind`.
- Docker builds use buildx `driver: remote` against the in-cluster buildkitd
  (mTLS certs are mounted at `/etc/buildkit/certs`); there is no local Docker
  daemon, so `docker run`/service containers do NOT work on this pool.
- Registry layer cache lives at `<image>:buildcache`.

## Requirements for a new repo

1. Copy `docker.yaml`, set `APP_NAME` and `IMAGE` in its `env` block.
2. Add a `Dockerfile` at the repo root (or set `context`/`file` in the build step).
3. App repos are **public** by convention, so the org-level
   `HOMELAB_REVIEW_APP_TOKEN` secret is visible to their workflows. If a
   repo must stay private, set the token per-repo instead
   (`gh secret set HOMELAB_REVIEW_APP_TOKEN --repo wielandtech-labs/<repo>`)
   — the Free plan hides org secrets from private repos.
4. Onboard the app in w_homelab with the `new-app` skill (or
   `.github/scripts/scaffold_app.py`) so dev/prod manifests, Flux image
   automation, and the review-app registry entry exist.

---

# This app: `portfolio`

**wielandtech.com**: the professional portfolio for VLAN Technology Services,
LLC (brand: WielandTech). A static Astro site served by nginx. Homelab slug
`portfolio`; image `ghcr.io/wielandtech-labs/w_portfolio`; manifests in
`w_homelab` under `clusters/{dev,prod}/apps/portfolio/`. Dev is
`https://portfolio.r12d.dev`. The resume, blog and accounts live on
raphaelwieland.com (repo `w_tech`); link there, don't duplicate them.

## Rules that are not negotiable

- **Strict CSP, no inline anything.** nginx sends `script-src 'self';
  style-src 'self'` (`nginx/security-headers.conf`). No inline `<script>`,
  `<style>` or `style=""` attributes, and no third-party origins. Theme code
  is the external `public/theme.js`. `build.inlineStylesheets: 'never'` and
  `assetsInlineLimit: 0` keep Astro from inlining. After a build,
  `grep -rn '<style\|style="\|<script>' dist/` must come back empty.
- **No analytics or trackers** until self-hosted Umami exists, and then only
  same-origin through the nginx proxy so the CSP doesn't change.
- **Old links keep working.** Any path this site doesn't serve gets a 308 to
  `https://raphaelwieland.com` with path and query (`location @personal`).
  `/work/`, `/services/` and `/contact/` return the site's own 404 instead.
  A new top-level page needs adding to that regex in `nginx/default.conf`,
  or its typo'd sub-paths will redirect to the personal site.
- **Nothing internal in case studies.** No tailnet hostnames, IPs, secret
  names or `*.k8s.local` hosts. The sources (other repos' AGENTS.md) are full
  of them.
- **Every header-setting `location` includes `security-headers.conf`.** An
  `add_header` in a location drops the server-level ones.

## Live stats

`/api/metrics/` is proxied by nginx to w_tech's in-cluster Service (Host
`raphaelwieland.com`, 30 s cache). Every environment uses prod's w_tech:
the data is public and read-only. In `npm run dev`, Vite proxies it to
`https://raphaelwieland.com`. `src/components/LiveStats.astro` polls it
every 30 s, pauses while the tab is hidden, and degrades to "Live stats
unavailable" without layout shift.

w_tech owns the endpoint (Prometheus-backed) and pins the fields this site
reads in a contract test (`ClusterMetricsViewTests.test_w_portfolio_contract`):
`availability.{percentage,services}`, `deployments.{healthy,total}`,
`pods.count`, `nodes.{count,ready}`, `traffic.requests_per_second`,
`database.{size_mb,databases}`. A card is `null` when its query failed. When
you read a new field, add it to that test in w_tech. Because every
environment reads prod w_tech, a new field must be live there before this
site's review app can show it.

## Content

Case studies are `src/content/work/*.mdx` (schema in
`src/content.config.ts`). The body follows Problem → Approach (with a
`<Flow>` diagram) → Hard parts → Outcome. The stack renders from
frontmatter. Covers and OG images come from `scripts/covers.mjs`
(`node scripts/covers.mjs src/assets/covers`); `/og/<slug>.png` is
rasterised from the cover at build time.

## Local development

There's no Docker on the dev machine. Use Node 24:

```bash
npm ci
npm run dev       # http://localhost:4321, metrics proxied to prod
npm run check     # astro check (also runs in the Docker build)
npm run build && npm run preview
```

The nginx config (routing, headers, proxy) can only be exercised in the
cluster: verify it on the PR's review app.
