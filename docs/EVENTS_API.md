# Events API Integration

## Overview

The static site generator now supports fetching events from an external API during build time. This allows you to maintain events in a CMS or external service (like Luma) and automatically populate the website with the latest event information.

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Configure the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `EVENTS_ENDPOINT` | URL to fetch events from | `http://localhost:1337/luma_events.json` |
| `EVENTS_TIMEOUT` | Request timeout in milliseconds | `5000` |

### Example Configuration

```env
EVENTS_ENDPOINT=https://api.lu.ma/calendar/cal-LgZzH80VBHWnNQy/events
EVENTS_TIMEOUT=5000
```

## API Schema

The API endpoint should return JSON in the Luma events format. See `docs/luma_events.json` for a complete example.

### Required Structure

```json
{
  "entries": [
    {
      "event": {
        "name": "Event Name",
        "start_at": "2026-02-19T17:30:00.000Z",
        "end_at": "2026-02-19T20:00:00.000Z",
        "timezone": "Europe/Warsaw",
        "geo_address_info": {
          "address": "Venue Name",
          "short_address": "Street Address",
          "city": "City"
        }
      },
      "guest_count": 6,
      "ticket_info": {
        "spots_remaining": 14
      }
    }
  ]
}
```

### Extracted Fields

The build script extracts the following information from each event:

- **name** → `title`
- **start_at** → `date` (formatted as YYYY.MM.DD) and `time` (formatted as HH:MM)
- **geo_address_info.address** → `location`
- **guest_count** → `guest_count`
- **ticket_info.spots_remaining** → `spots_remaining`
- **url** → `url` (Luma event slug)

### Event Type Detection

The build script automatically determines event type based on the event name:

- Contains "warsztat" or "workshop" → `warsztat` (green badge)
- Contains "demo" → `noc_demo` (cyan badge)
- Default → `meetup`

## Build Process

### How It Works

1. **Load environment** - Read `.env` file for configuration
2. **Fetch events** - HTTP GET request to `EVENTS_ENDPOINT`
3. **Parse response** - Extract event data from Luma schema
4. **Transform data** - Convert to internal event format
5. **Merge events** - Combine API events with markdown frontmatter events
6. **Render templates** - Generate HTML with merged event list

### Event Priority

Events are displayed in this order:

1. **API events** (from external endpoint) - appear first
2. **Markdown events** (from frontmatter) - appear after API events

This allows you to have both dynamic (API) and static (markdown) events on the same page.

### Fallback Behavior

If the API request fails (timeout, network error, invalid response), the build will:

1. Log a warning message
2. Continue with markdown events only
3. Complete the build successfully

**No build failures due to API issues!**

## Usage Examples

### Local Development with Test Data

```bash
# Start a local server to serve test events
python3 -m http.server 1337 --directory docs

# In another terminal, build the site
npm run build
```

Expected output:
```
Fetching events from: http://localhost:1337/luma_events.json
✓ Fetched 7 events from API
Events: 7 from API + 2 from markdown = 9 total
```

### Production with Real API

```bash
# Set production endpoint in .env
EVENTS_ENDPOINT=https://api.lu.ma/calendar/cal-YOUR-ID/events

# Build
npm run build
```

### Without API (Markdown Only)

```bash
# Remove or comment out EVENTS_ENDPOINT in .env
# EVENTS_ENDPOINT=

# Build
npm run build
```

Expected output:
```
ℹ️  No EVENTS_ENDPOINT configured, skipping API fetch
Events: 0 from API + 2 from markdown = 2 total
```

## GitHub Actions Integration

### Add Environment Variable

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `EVENTS_ENDPOINT`
4. Value: Your production API URL

### Update Workflow

Edit `.github/workflows/deploy.yml`:

```yaml
- name: Build site
  run: npm run build
  env:
    EVENTS_ENDPOINT: ${{ secrets.EVENTS_ENDPOINT }}
    EVENTS_TIMEOUT: 5000
```

## Troubleshooting

### Events Not Appearing

1. **Check endpoint URL**
   ```bash
   curl $EVENTS_ENDPOINT
   ```

2. **Verify JSON structure**
   ```bash
   curl $EVENTS_ENDPOINT | jq '.entries[].event.name'
   ```

3. **Check build logs**
   ```bash
   npm run build
   # Look for: "✓ Fetched X events from API"
   ```

### API Timeout

Increase timeout in `.env`:
```env
EVENTS_TIMEOUT=10000
```

### Invalid Response

The API must return valid JSON with the `entries` array. Check:

```bash
curl $EVENTS_ENDPOINT | jq '.entries | length'
```

### CORS Issues (Browser)

Not applicable - events are fetched during build time (server-side), not in the browser.

## Event Data Format

### API Event Object

```javascript
{
  type: 'warsztat',              // Event type badge
  date: '2026.02.19',            // Formatted date
  title: 'AI Jam Łódź #22',      // Event name
  description: 'Event details',   // Short description
  location: 'Get Software Done',  // Venue name
  time: '18:30',                 // Start time
  url: 'qj4qseuc',               // Luma event slug
  guest_count: 6,                // Number of attendees
  spots_remaining: 14            // Available spots
}
```

### Markdown Event Object

```yaml
type: warsztat
date: "2024.02.15"
title: Event Title
description: Event description
location: Venue Name
time: "18:30"
```

## Performance

- **Build time impact**: ~100-500ms per API request
- **Caching**: Not implemented (events fetched on every build)
- **Timeout**: Configurable (default 5 seconds)
- **Fallback**: Instant (uses markdown events)

## Future Enhancements

- [ ] Cache API responses to speed up rebuilds
- [ ] Support multiple event sources
- [ ] Filter events by date (upcoming only)
- [ ] Sort events by date
- [ ] Add event pagination
- [ ] Support event images from API
- [ ] Add event registration links
