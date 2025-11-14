# AI Jam Łódź - Website

A modern, responsive website for the AI Jam Łódź community built with Next.js, TailwindCSS, and SQLite.

## Features

- 🎨 **Modern Design**: Beautiful, responsive UI with TailwindCSS
- 📅 **Meetup Management**: Display upcoming and past meetups
- 📱 **QR Code Integration**: Quick access page with QR code for easy sharing
- 📝 **Content Management**: Markdown-based content for easy updates
- 🌍 **Localization Ready**: Support for Polish and English content
- 🗄️ **SQLite Database**: Lightweight database with Prisma

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Database**: SQLite
- **ORM**: Prisma
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

#### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd aijam.pl
```

2. Start the development environment:
```bash
docker compose up dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it! Docker will automatically:
- Install dependencies
- Generate Prisma Client
- Create and migrate the database
- Seed sample data
- Start the development server

#### Option 2: Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd aijam.pl
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
aijam.pl/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── meetups/           # Meetups listing page
│   ├── starter-pack/      # Starter pack for new members
│   ├── qr-info/           # QR code info page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── Footer.tsx         # Footer component
│   ├── MeetupCard.tsx     # Meetup card component
│   └── QRCodeGenerator.tsx # QR code generator
├── db/                    # Database files
│   ├── schema.ts          # Database schema
│   ├── index.ts           # Database connection
│   └── seed.ts            # Seed script
├── public/                # Static files
└── package.json           # Dependencies
```

## Database Schema

### Meetups Table
- `id`: Primary key
- `title`: Meetup title
- `description`: Meetup description
- `date`: ISO date string
- `location`: Venue location
- `speaker`: Speaker name (optional)
- `attendees`: Number of attendees
- `isUpcoming`: Boolean flag for upcoming meetups
- `imageUrl`: Image URL (optional)
- `createdAt`: Creation timestamp

### Pages Table
- `id`: Primary key
- `slug`: URL slug
- `title`: Page title
- `content`: Markdown content
- `locale`: Language code (pl/en)
- `updatedAt`: Last update timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Prisma generation)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run prisma:generate` - Generate Prisma Client

### Docker Commands

- `docker compose up dev` - Start development environment
- `docker compose down` - Stop and remove containers
- `docker compose logs dev` - View logs
- `docker compose exec dev sh` - Access container shell

## Customization

### Adding a New Meetup

You can add meetups through:
1. **Prisma Studio** (recommended):
```bash
npm run db:studio
```
2. **Edit seed file**: Modify `prisma/seed.ts` and run `npm run db:seed`
3. **Programmatically**: Use Prisma Client in your code

### Updating Content

Content pages (About, Starter Pack) are stored in the database. You can update them through:
1. **Prisma Studio** (recommended) - Visual database editor
2. **Direct database queries** using Prisma Client
3. **Creating an admin panel** (future enhancement)

### Styling

The project uses TailwindCSS. Main colors can be customized in `tailwind.config.ts`:
- `primary`: Main brand color (blue)
- `accent`: Accent color (purple/pink)

## Deployment

The website can be deployed to any platform that supports Next.js:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Configure build command as `npm run build`
- **Docker**: Create a Dockerfile with Node.js

Make sure to:
1. Set environment variables if needed
2. Include the SQLite database or set up database seeding
3. Configure the `NEXT_PUBLIC_BASE_URL` for QR codes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own meetup community!

## Contact

For questions or suggestions, reach out to the AI Jam Łódź team at contact@aijam.pl
