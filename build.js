const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');
const { minify } = require('html-minifier');
require('dotenv').config();

const md = new MarkdownIt({ html: true });

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const CONTENT_DIR = path.join(SRC_DIR, 'content');
const ASSETS_DIR = path.join(SRC_DIR, 'assets');

// Register Handlebars helpers
Handlebars.registerHelper('eq', (a, b) => a === b);

function separateEventsByDate(events) {
  const now = new Date();
  const upcoming = [];
  const past = [];
  
  events.forEach(event => {
    // Parse event date (YYYY.MM.DD format)
    const [year, month, day] = event.date.split('.').map(Number);
    const eventDate = new Date(year, month - 1, day);
    
    // Add end of day to event date for comparison
    eventDate.setHours(23, 59, 59, 999);
    
    if (eventDate >= now) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  });
  
  // Sort upcoming events by date (ascending - soonest first)
  upcoming.sort((a, b) => {
    const [yearA, monthA, dayA] = a.date.split('.').map(Number);
    const [yearB, monthB, dayB] = b.date.split('.').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });
  
  // Sort past events by date (descending - most recent first)
  past.sort((a, b) => {
    const [yearA, monthA, dayA] = a.date.split('.').map(Number);
    const [yearB, monthB, dayB] = b.date.split('.').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateB - dateA;
  });
  
  return { upcoming, past };
}

async function fetchEventsFromEndpoint(endpoint, label) {
  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(parseInt(process.env.EVENTS_TIMEOUT || '5000'))
    });
    
    if (!response.ok) {
      console.warn(`⚠️  ${label} API returned ${response.status}, using fallback`);
      return [];
    }
    
    const data = await response.json();
    
    // Parse Luma events schema
    const events = (data.entries || []).map(entry => {
      const event = entry.event;
      const startDate = new Date(event.start_at);
      const endDate = new Date(event.end_at);
      
      // Format date as YYYY.MM.DD
      const formattedDate = startDate.toISOString().split('T')[0].replace(/-/g, '.');
      
      // Format time as HH:MM
      const formattedTime = startDate.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: event.timezone || 'Europe/Warsaw'
      });
      
      // Extract location
      const location = event.geo_address_info?.address || 
                      event.geo_address_info?.short_address || 
                      'TBA';
      
      // Determine event type based on name or other criteria
      let type = 'meetup';
      if (event.name.toLowerCase().includes('warsztat') || event.name.toLowerCase().includes('workshop')) {
        type = 'warsztat';
      } else if (event.name.toLowerCase().includes('demo')) {
        type = 'noc_demo';
      }
      
      return {
        type,
        date: formattedDate,
        title: event.name,
        description: event.description_short || `Spotkanie AI Jam w ${event.geo_address_info?.city || 'Łodzi'}`,
        location,
        time: formattedTime,
        url: event.url,
        guest_count: entry.guest_count || 0,
        spots_remaining: entry.ticket_info?.spots_remaining || null
      };
    });
    
    console.log(`✓ Fetched ${events.length} ${label.toLowerCase()}`);
    return events;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`⚠️  ${label} API request timed out, using fallback`);
    } else {
      console.warn(`⚠️  Failed to fetch ${label.toLowerCase()}: ${error.message}`);
    }
    return [];
  }
}

async function fetchEventsFromAPI() {
  const upcomingEndpoint = process.env.EVENTS_ENDPOINT_UPCOMING;
  const pastEndpoint = process.env.EVENTS_ENDPOINT_PAST;
  
  if (!upcomingEndpoint && !pastEndpoint) {
    console.log('ℹ️  No event endpoints configured, skipping API fetch');
    return { upcoming: [], past: [] };
  }
  
  console.log('Fetching events from API...');
  if (upcomingEndpoint) console.log(`  Upcoming: ${upcomingEndpoint}`);
  if (pastEndpoint) console.log(`  Past: ${pastEndpoint}`);
  
  const [upcoming, past] = await Promise.all([
    upcomingEndpoint ? fetchEventsFromEndpoint(upcomingEndpoint, 'Upcoming events') : Promise.resolve([]),
    pastEndpoint ? fetchEventsFromEndpoint(pastEndpoint, 'Past events') : Promise.resolve([])
  ]);
  
  return { upcoming, past };
}

async function loadPartials() {
  const partialsDir = path.join(TEMPLATES_DIR, 'partials');
  const partialFiles = await fs.readdir(partialsDir);
  
  for (const file of partialFiles) {
    if (file.endsWith('.hbs')) {
      const name = path.basename(file, '.hbs');
      const content = await fs.readFile(path.join(partialsDir, file), 'utf-8');
      Handlebars.registerPartial(name, content);
    }
  }
}

async function loadTemplate(templateName) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  return Handlebars.compile(templateContent);
}

async function processMarkdownFile(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    frontmatter: data,
    content: md.render(content),
    markdown: content
  };
}

async function renderPage(contentFile, outputPath, apiEvents = { upcoming: [], past: [] }, options = {}) {
  console.log(`Processing: ${contentFile} -> ${outputPath}`);
  
  const { frontmatter, content, markdown } = await processMarkdownFile(
    path.join(CONTENT_DIR, contentFile)
  );
  
  // Merge API events with markdown events
  // API events are already separated, markdown events need separation
  const markdownEvents = frontmatter.events || [];
  const { upcoming: markdownUpcoming, past: markdownPast } = separateEventsByDate(markdownEvents);
  
  // Merge API events with corresponding markdown events (API events first)
  const upcoming = [...apiEvents.upcoming, ...markdownUpcoming];
  const past = [...apiEvents.past, ...markdownPast];
  
  const totalApiEvents = apiEvents.upcoming.length + apiEvents.past.length;
  const totalEvents = upcoming.length + past.length;
  
  console.log(`  Events: ${totalApiEvents} from API + ${markdownEvents.length} from markdown = ${totalEvents} total`);
  console.log(`  Upcoming: ${upcoming.length}, Past: ${past.length}`);
  
  // Update frontmatter with separated events
  const pageData = {
    ...frontmatter,
    events: options.showPastEvents ? past : upcoming,
    upcoming_events: upcoming,
    past_events: past,
    events_total: totalEvents,
    ...options.extraData
  };
  
  // Load the appropriate layout template
  const layoutName = frontmatter.layout || 'home';
  const layoutTemplate = await loadTemplate(layoutName);
  
  // Render the layout-specific content
  const layoutHtml = layoutTemplate(pageData);
  
  // Load base template
  const baseTemplate = await loadTemplate('base');
  
  // Render final HTML
  const html = baseTemplate({
    ...pageData,
    content: layoutHtml
  });
  
  // Minify HTML
  const minifiedHtml = minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
  });
  
  // Ensure output directory exists
  await fs.ensureDir(path.dirname(outputPath));
  
  // Write output file
  await fs.writeFile(outputPath, minifiedHtml);
  console.log(`✓ Generated: ${outputPath}`);
}

async function copyAssets() {
  console.log('Copying assets...');
  
  const assetsOutput = path.join(DIST_DIR, 'assets');
  await fs.ensureDir(assetsOutput);
  
  // Copy CSS
  await fs.copy(
    path.join(ASSETS_DIR, 'css'),
    path.join(assetsOutput, 'css')
  );
  
  // Copy JS
  await fs.copy(
    path.join(ASSETS_DIR, 'js'),
    path.join(assetsOutput, 'js')
  );
  
  // Copy fonts if they exist
  const fontsDir = path.join(ASSETS_DIR, 'fonts');
  if (await fs.pathExists(fontsDir)) {
    await fs.copy(fontsDir, path.join(assetsOutput, 'fonts'));
  }
  
  console.log('✓ Assets copied');
}

async function build() {
  console.log('🚀 Starting build...\n');
  
  try {
    // Clean dist directory
    await fs.remove(DIST_DIR);
    await fs.ensureDir(DIST_DIR);
    console.log('✓ Cleaned dist directory\n');
    
    // Load partials
    await loadPartials();
    console.log('✓ Loaded partials\n');
    
    // Fetch events from API
    const apiEvents = await fetchEventsFromAPI();
    console.log('');
    
    // Process homepage (upcoming events)
    await renderPage('index.md', path.join(DIST_DIR, 'index.html'), apiEvents);
    
    // Process archive page (past events)
    await renderPage(
      'archive.md', 
      path.join(DIST_DIR, 'archive', 'index.html'), 
      apiEvents,
      { showPastEvents: true }
    );
    
    // Copy assets
    await copyAssets();
    
    console.log('\n✅ Build completed successfully!');
    console.log(`📁 Output directory: ${DIST_DIR}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();
