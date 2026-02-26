const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');
const { minify } = require('html-minifier');

const md = new MarkdownIt({ html: true });

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const CONTENT_DIR = path.join(SRC_DIR, 'content');
const ASSETS_DIR = path.join(SRC_DIR, 'assets');

// Register Handlebars helpers
Handlebars.registerHelper('eq', (a, b) => a === b);

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

async function renderPage(contentFile, outputPath) {
  console.log(`Processing: ${contentFile} -> ${outputPath}`);
  
  const { frontmatter, content, markdown } = await processMarkdownFile(
    path.join(CONTENT_DIR, contentFile)
  );
  
  // Load the appropriate layout template
  const layoutName = frontmatter.layout || 'home';
  const layoutTemplate = await loadTemplate(layoutName);
  
  // Render the layout-specific content
  const layoutHtml = layoutTemplate(frontmatter);
  
  // Load base template
  const baseTemplate = await loadTemplate('base');
  
  // Render final HTML
  const html = baseTemplate({
    ...frontmatter,
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
    
    // Process pages
    await renderPage('index.md', path.join(DIST_DIR, 'index.html'));
    
    // Create subdirectories for clean URLs
    // For now, we'll just create the homepage
    // Additional pages can be added later
    
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
