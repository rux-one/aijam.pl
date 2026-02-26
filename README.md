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
/home/bart/code/aijam.pl/
├── src/
│   ├── templates/
│   │   ├── base.hbs              # Main layout
│   │   ├── home.hbs              # Homepage template
│   │   ├── archive.hbs           # Archive page template
│   │   └── partials/
│   │       ├── nav.hbs           # Navigation
│   │       └── footer.hbs        # Footer
│   ├── content/
│   │   ├── index.md              # Homepage content (YAML + Markdown)
│   │   └── archive.md            # Archive page content
│   └── assets/
│       ├── css/styles.css        # Custom styles
│       └── js/main.js            # JavaScript (theme, mobile menu, forms)
├── dist/                         # Generated output (gitignored)
│   ├── index.html                # Homepage (upcoming events)
│   ├── archiwum/
│   │   └── index.html            # Archive page (past events)
│   └── assets/                   # Copied assets
├── build.js                      # Build script
├── package.json                  # Dependencies
├── .github/workflows/deploy.yml  # CI/CD pipeline
├── nginx.conf.example            # Server configuration
├── README.md                     # Project documentation
└── DEPLOYMENT.md                 # Deployment guide
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

### Events Integration

Events can come from two sources:

1. **External API** (recommended) - Fetched during build time
2. **Markdown frontmatter** - Static fallback events

#### API Events (Luma Integration)

Configure the events endpoint in `.env`:

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and set your events endpoint
EVENTS_ENDPOINT=http://localhost:1337/luma_events.json
EVENTS_TIMEOUT=5000
```

The build script will:
- Fetch events from the configured endpoint
- Parse Luma events JSON schema (see `docs/luma_events.json`)
- Extract event details (name, date, time, location, etc.)
- Merge with markdown events (API events appear first)
- Fallback to markdown events if API is unavailable

#### Markdown Events (Fallback)

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

#### Event Types

- `warsztat` - Workshop (green badge)
- `noc_demo` - Demo night (cyan badge)
- `meetup` - Regular meetup (default)

### Event Separation

Events are automatically separated into two categories based on the current date:

**Upcoming Events** (`nadchodzace_wydarzenia`)
- Displayed on the homepage (`/`)
- Events with date >= today
- Sorted by date (soonest first)

**Past Events** (`archiwum_wydarzen`)
- Displayed on archive page (`/archive/`)
- Events with date < today
- Sorted by date (most recent first)

The build script automatically:
1. Fetches all events (API + markdown)
2. Compares event dates with current date
3. Separates into upcoming and past
4. Generates two pages with appropriate events

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
- [x] REST API integration for events (Luma events)
- [ ] Additional pages (events, about, join as separate pages)
- [ ] RSS feed generation
- [ ] Sitemap generation
- [ ] Image optimization
- [ ] Cache API responses for faster rebuilds

## License

MIT
