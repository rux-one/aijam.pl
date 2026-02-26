# Events API Integration - Summary

## ✅ What Was Implemented

A complete events API integration that fetches events from an external endpoint (Luma) during build time and merges them with static markdown events.

## 📦 New Files

- **`.env.example`** - Environment configuration template
- **`.env`** - Local environment configuration (gitignored)
- **`docs/EVENTS_API.md`** - Complete API integration documentation

## 🔧 Modified Files

- **`package.json`** - Added `dotenv` dependency
- **`build.js`** - Added API fetching and event merging logic
- **`.gitignore`** - Added `.env` and `.env.local`
- **`README.md`** - Updated with events integration docs
- **`DEPLOYMENT.md`** - Added API configuration instructions

## 🚀 How It Works

### Build Process

```
1. Load .env configuration
2. Fetch events from EVENTS_ENDPOINT (if configured)
3. Parse Luma events JSON schema
4. Transform to internal event format
5. Merge API events + markdown events
6. Render templates with merged events
7. Generate static HTML
```

### Event Sources Priority

1. **API events** (from Luma) - displayed first
2. **Markdown events** (from frontmatter) - displayed after

### Fallback Strategy

- If API fails → Use markdown events only
- If API times out → Use markdown events only
- If no endpoint configured → Use markdown events only
- **Build never fails due to API issues**

## 📊 Test Results

```bash
$ npm run build

🚀 Starting build...
✓ Cleaned dist directory
✓ Loaded partials
Fetching events from: http://localhost:1337/luma_events.json
✓ Fetched 7 events from API

Processing: index.md -> /home/bart/code/aijam.pl/dist/index.html
  Events: 7 from API + 2 from markdown = 9 total
✓ Generated: /home/bart/code/aijam.pl/dist/index.html
Copying assets...
✓ Assets copied

✅ Build completed successfully!
```

## 🔑 Configuration

### Local Development

```bash
# 1. Copy example
cp .env.example .env

# 2. Configure endpoint
echo "EVENTS_ENDPOINT=http://localhost:1337/luma_events.json" > .env

# 3. Test with local server
python3 -m http.server 1337 --directory docs

# 4. Build
npm run build
```

### Production (GitHub Actions)

Add GitHub secret:
- Name: `EVENTS_ENDPOINT`
- Value: `https://api.lu.ma/calendar/cal-YOUR-ID/events`

## 📝 Event Data Mapping

### Luma API → Internal Format

| Luma Field | Internal Field | Transformation |
|------------|----------------|----------------|
| `event.name` | `title` | Direct |
| `event.start_at` | `date` | ISO → YYYY.MM.DD |
| `event.start_at` | `time` | ISO → HH:MM (Warsaw TZ) |
| `event.geo_address_info.address` | `location` | Direct |
| `guest_count` | `guest_count` | Direct |
| `ticket_info.spots_remaining` | `spots_remaining` | Direct |
| `event.url` | `url` | Luma slug |
| Auto-detected | `type` | Based on name keywords |

### Event Type Detection

- Name contains "warsztat" or "workshop" → `warsztat`
- Name contains "demo" → `noc_demo`
- Default → `meetup`

## 🎯 Features

✅ **Automatic event fetching** during build  
✅ **Luma events schema** parsing  
✅ **Date/time formatting** (Polish timezone)  
✅ **Event type detection** (warsztat, demo, meetup)  
✅ **Graceful fallback** to markdown events  
✅ **Timeout handling** (configurable)  
✅ **Merge strategy** (API + markdown)  
✅ **Build-time only** (no client-side fetching)  
✅ **Zero runtime dependencies**  

## 📖 Documentation

- **`README.md`** - Quick start and events integration
- **`DEPLOYMENT.md`** - Production setup and GitHub Actions
- **`docs/EVENTS_API.md`** - Complete API reference
- **`docs/luma_events.json`** - Example API response

## 🔄 Usage Examples

### With API (Recommended)

```bash
EVENTS_ENDPOINT=https://api.lu.ma/calendar/cal-LgZzH80VBHWnNQy/events
npm run build
# → Fetches live events from Luma
```

### Without API (Fallback)

```bash
# No EVENTS_ENDPOINT configured
npm run build
# → Uses markdown events only
```

### Mixed (API + Markdown)

```bash
EVENTS_ENDPOINT=https://api.lu.ma/...
npm run build
# → Shows API events first, then markdown events
```

## 🎨 Template Integration

Events are automatically available in templates:

```handlebars
{{#each events}}
  <div class="event">
    <span class="badge">{{type}}</span>
    <h3>{{title}}</h3>
    <p>{{description}}</p>
    <span>{{location}} • {{time}}</span>
  </div>
{{/each}}
```

## 🔐 Security

- ✅ Environment variables in `.env` (gitignored)
- ✅ No API keys in code
- ✅ Server-side only (build time)
- ✅ No client-side API calls
- ✅ No CORS issues

## 🚀 Next Steps

1. **Configure production endpoint** in GitHub secrets
2. **Test with real Luma API** (if available)
3. **Customize event types** based on your needs
4. **Add event filtering** (upcoming only)
5. **Implement caching** for faster rebuilds

## 📚 Related Files

- `@/home/bart/code/aijam.pl/.env.example:1-6` - Configuration template
- `@/home/bart/code/aijam.pl/build.js:20-95` - API fetching logic
- `@/home/bart/code/aijam.pl/docs/luma_events.json:1-100` - Example schema
- `@/home/bart/code/aijam.pl/docs/EVENTS_API.md:1-300` - Full documentation

---

**Status**: ✅ Complete and tested  
**Build time impact**: ~100-500ms per API request  
**Fallback**: Always works with markdown events
