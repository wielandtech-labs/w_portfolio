# w_portfolio

Source for **[wielandtech.com](https://wielandtech.com)**, the portfolio of
VLAN Technology Services, LLC: case studies, services, and live stats from
the homelab it all runs on.

Astro (static), Tailwind CSS v4 and MDX content collections, served by
`nginx-unprivileged` with a strict CSP. Deploys to the K3s homelab through
Flux. See [AGENTS.md](AGENTS.md) for the tag scheme, the rules, and local
development.

```bash
npm ci && npm run dev
```
