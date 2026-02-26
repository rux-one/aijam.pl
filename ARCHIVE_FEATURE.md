# Archive Feature - Past Events

## Overview

The static site generator now automatically separates events into **upcoming** and **past** categories, creating two distinct pages:

- **Homepage** (`/`) - Shows upcoming events only
- **Archive** (`/archiwum/`) - Shows past events only

## How It Works

### Event Separation Logic

```javascript
// Events are separated based on current date at build time
const now = new Date();

// Event date is parsed from YYYY.MM.DD format
const [year, month, day] = event.date.split('.').map(Number);
const eventDate = new Date(year, month - 1, day);
eventDate.setHours(23, 59, 59, 999); // End of day

// Comparison
if (eventDate >= now) {
  // Upcoming event
} else {
  // Past event
}
```

### Sorting

**Upcoming Events**
- Sorted ascending by date (soonest first)
- Helps users find the next event quickly

**Past Events**
- Sorted descending by date (most recent first)
- Shows latest events at the top of archive

## Pages Generated

### Homepage (`/`)

**URL**: `https://aijam.pl/`  
**Section**: `nadchodzace_wydarzenia`  
**Shows**: Upcoming events only  
**Link to archive**: Yes (in section header)

### Archive Page (`/archiwum/`)

**URL**: `https://aijam.pl/archiwum/`  
**Section**: `archiwum_wydarzen`  
**Shows**: Past events only  
**Link to homepage**: Yes (back button at bottom)

## Navigation

The archive page is accessible from:

1. **Main navigation** - `./archiwum` link in header
2. **Homepage events section** - "archiwum" link in section header
3. **Direct URL** - `/archiwum/`

## Build Output

```bash
$ npm run build

Processing: index.md -> /home/bart/code/aijam.pl/dist/index.html
  Events: 7 from API + 2 from markdown = 9 total
  Upcoming: 3, Past: 6
✓ Generated: /home/bart/code/aijam.pl/dist/index.html

Processing: archive.md -> /home/bart/code/aijam.pl/dist/archiwum/index.html
  Events: 7 from API + 0 from markdown = 7 total
  Upcoming: 3, Past: 6
✓ Generated: /home/bart/code/aijam.pl/dist/archiwum/index.html
```

## Template Differences

### Homepage Template (`home.hbs`)

- Shows upcoming events in colored badges (green/cyan)
- Hover effect: border turns emerald
- Displays "spots remaining" if available
- Link to archive in section header

### Archive Template (`archive.hbs`)

- Shows past events in gray badges
- Reduced opacity (75%) with hover to 100%
- Displays guest count if available
- Shows total count of archived events
- Back button to homepage

## Files Modified

### New Files
- `src/content/archive.md` - Archive page content
- `src/templates/archive.hbs` - Archive page template

### Modified Files
- `build.js` - Added `separateEventsByDate()` function
- `build.js` - Updated `renderPage()` to handle event separation
- `build.js` - Updated `build()` to generate archive page
- `src/templates/partials/nav.hbs` - Added archive link
- `src/templates/home.hbs` - Added archive link in events section

## Event Data Available in Templates

Both templates have access to:

```javascript
{
  events: [],              // Upcoming (homepage) or Past (archive)
  upcoming_events: [],     // All upcoming events
  past_events: [],         // All past events
  events_total: 0          // Total count of all events
}
```

## Example Event Dates

Given current date: **2026-02-26**

**Upcoming Events** (shown on homepage):
- 2026.03.15 - Future event
- 2026.02.28 - Event in 2 days
- 2026.02.26 - Event today (end of day)

**Past Events** (shown in archive):
- 2026.02.25 - Yesterday
- 2026.02.19 - Last week
- 2026.01.15 - Last month

## Clean URLs

Both pages use clean URLs without `.html` extension:

- Homepage: `/` or `/index.html`
- Archive: `/archiwum/` or `/archiwum/index.html`

Nginx configuration handles both formats automatically.

## Empty States

### No Upcoming Events

Homepage shows all sections normally, but events section will be empty if there are no upcoming events.

### No Past Events

Archive page shows:
```
📚
Brak przeszłych wydarzeń w archiwum
```

## Statistics

The archive page displays:
- Total count of past events
- Event type badges (grayed out)
- Guest count (if available from API)
- Location and time information

## Future Enhancements

- [ ] Add pagination for archive (if > 20 events)
- [ ] Add year/month grouping in archive
- [ ] Add search/filter functionality
- [ ] Add "load more" button for archive
- [ ] Add event statistics (total attendees, etc.)
- [ ] Add calendar view option
