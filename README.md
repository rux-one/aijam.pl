# AI Jam - Static Site Generator

Static site generator for the AI Jam meetup website in Łódź.

## Features

- 📝 Markdown content with YAML frontmatter
- 🎨 Handlebars templates
- 🚀 Fast static HTML generation
- 📦 Self-hosted assets (no external CDN dependencies)
- 🔄 Automated deployment to VPS via GitHub Actions
- 🎯 Clean URLs without `.html` suffixes
- ⚡ Optimized for caching

## Project Structure

```
.
├── src/
│   ├── templates/          # Handlebars templates
│   │   ├── base.hbs       # Base layout
│   │   ├── home.hbs       # Homepage template
│   │   └── partials/      # Reusable components
│   ├── content/           # Markdown content files
│   │   └── index.md       # Homepage content
│   └── assets/            # Static assets
│       ├── css/           # Stylesheets
│       ├── js/            # JavaScript
│       └── fonts/         # Self-hosted fonts
├── dist/                  # Generated output (gitignored)
├── build.js               # Build script
├── package.json           # Dependencies
└── nginx.conf.example     # Nginx configuration
```

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Build and serve locally
npm run dev
```

The site will be available at `http://localhost:8000`

## Content Management

### Editing Content

Content is stored in `src/content/` as Markdown files with YAML frontmatter:

```markdown
---
layout: home
title: Page Title
description: Page description
---

Your markdown content here...
```

### Adding Events

Edit `src/content/index.md` and add events to the `events` array in the frontmatter:

```yaml
events:
  - type: warsztat
    date: "2024.02.15"
    title: Event Title
    description: Event description
    location: Venue Name
    time: "18:30"
```

## Deployment

### GitHub Actions Setup

1. Add the following secrets to your GitHub repository:
   - `SSH_HOST`: Your VPS hostname or IP
   - `SSH_USER`: SSH username
   - `SSH_KEY`: Private SSH key
   - `SSH_PATH`: Target path on VPS (e.g., `/var/www/aijam.pl/`)

2. Push to `main` branch to trigger automatic deployment

### VPS Setup

1. Copy `nginx.conf.example` to `/etc/nginx/sites-available/aijam.pl`
2. Create symlink: `ln -s /etc/nginx/sites-available/aijam.pl /etc/nginx/sites-enabled/`
3. Test config: `nginx -t`
4. Reload nginx: `systemctl reload nginx`

### SSL Setup (Optional)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d aijam.pl -d www.aijam.pl

# Auto-renewal is configured automatically
```

## Build System

The build process:

1. Reads markdown files from `src/content/`
2. Parses YAML frontmatter and markdown content
3. Renders Handlebars templates with data
4. Minifies HTML output
5. Copies static assets to `dist/`
6. Generates clean URL structure (directories with `index.html`)

## Technologies

- **Build Tool**: Node.js
- **Templating**: Handlebars
- **Markdown**: markdown-it
- **Frontmatter**: gray-matter
- **Minification**: html-minifier
- **Styling**: Tailwind CSS (CDN for now, can be built locally)
- **Fonts**: Google Fonts (can be self-hosted)

## Future Enhancements

- [ ] Self-host Tailwind CSS build
- [ ] Self-host fonts
- [ ] REST API integration for events
- [ ] Additional pages (events, about, join as separate pages)
- [ ] RSS feed generation
- [ ] Sitemap generation
- [ ] Image optimization

## License

MIT
