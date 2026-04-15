# Pyxora · 파이조라

A digital forge for curious makers — retro arcade, micro apps, experiment lab.

**Live site:** https://pyxora.app

## Stack

- Static HTML · Zero dependencies (except Google Fonts)
- Hosted on Cloudflare Pages
- Domain managed via Cloudflare DNS

## Structure

```
pyxora-site/
└── index.html    # Brand guide + landing page
```

## Subdomain Ecosystem

### Live
- `kidquest.pyxora.app` — family habit tracker (React SPA · Firebase Auth + Firestore · hosted on Firebase Hosting, repo: `D:\AI Workspaces\KidQuest`)

### Planned
- `arcade.pyxora.app` — retro game hub
- `lab.pyxora.app` — shader & generative experiments
- `tools.pyxora.app` — micro utility apps
- `blog.pyxora.app` — tech journal
- `forge.pyxora.app` — open source libraries
- `api.pyxora.app` — public API

> Subdomains can live on separate hosting platforms (Cloudflare Pages,
> Firebase Hosting, Cloud Run, etc.) and are wired up via CNAME/A
> records in the Cloudflare DNS zone for `pyxora.app`. The apex
> (`pyxora.app` / `www.pyxora.app`) stays on Cloudflare Pages.

## Local preview

Open `index.html` directly in a modern browser.
