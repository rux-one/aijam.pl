import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.meetup.deleteMany();
  await prisma.page.deleteMany();

  // Seed meetups
  await prisma.meetup.createMany({
    data: [
      {
        title: 'AI Jam #1: Introduction to Machine Learning',
        description: 'Kick-off event for AI Jam Łódź. We discussed the basics of machine learning and neural networks.',
        date: '2024-01-15T18:00:00',
        location: 'TechHub Łódź, ul. Piotrkowska 102',
        speaker: 'Dr. Anna Kowalska',
        attendees: 45,
        isUpcoming: false,
        imageUrl: '/images/meetup1.jpg',
        createdAt: new Date().toISOString(),
      },
      {
        title: 'AI Jam #2: Deep Learning Fundamentals',
        description: 'Deep dive into neural networks, backpropagation, and popular frameworks like TensorFlow and PyTorch.',
        date: '2024-02-20T18:00:00',
        location: 'TechHub Łódź, ul. Piotrkowska 102',
        speaker: 'Piotr Nowak',
        attendees: 52,
        isUpcoming: false,
        imageUrl: '/images/meetup2.jpg',
        createdAt: new Date().toISOString(),
      },
      {
        title: 'AI Jam #3: Natural Language Processing',
        description: 'Exploring NLP techniques, transformers, and the latest developments in language models.',
        date: '2024-03-18T18:00:00',
        location: 'Innovation Center, ul. Gdańska 43',
        speaker: 'Maria Wiśniewska',
        attendees: 38,
        isUpcoming: false,
        imageUrl: '/images/meetup3.jpg',
        createdAt: new Date().toISOString(),
      },
      {
        title: 'AI Jam #4: Computer Vision Applications',
        description: 'Hands-on workshop on computer vision, image classification, and object detection using modern frameworks.',
        date: '2025-12-15T18:00:00',
        location: 'TechHub Łódź, ul. Piotrkowska 102',
        speaker: 'Jan Kowalczyk',
        attendees: 0,
        isUpcoming: true,
        imageUrl: '/images/meetup4.jpg',
        createdAt: new Date().toISOString(),
      },
    ],
  });

  // Seed pages (Polish)
  await prisma.page.createMany({
    data: [
      {
        slug: 'about',
        title: 'O nas',
        locale: 'pl',
        content: `# Historia AI Jam Łódź

AI Jam Łódź to społeczność entuzjastów sztucznej inteligencji, która powstała na początku 2024 roku. Naszym celem jest tworzenie przestrzeni do wymiany wiedzy, doświadczeń i inspiracji związanych z AI.

## Nasza misja

- **Edukacja**: Organizujemy regularne spotkania i warsztaty dla osób na różnych poziomach zaawansowania
- **Networking**: Łączymy ludzi z branży tech, studentów i pasjonatów AI
- **Innowacja**: Wspieramy rozwój lokalnej społeczności AI i startupów technologicznych

## Zespół

Jesteśmy grupą wolontariuszy pasjonujących się sztuczną inteligencją i jej zastosowaniami. Organizujemy spotkania, zapraszamy prelegentów i dbamy o rozwój społeczności.`,
        updatedAt: new Date().toISOString(),
      },
      {
        slug: 'starter-pack',
        title: 'Starter Pack',
        locale: 'pl',
        content: `# Witaj w AI Jam Łódź!

Cieszymy się, że dołączasz do naszej społeczności! Oto wszystko, co musisz wiedzieć na początek.

## Czego się spodziewać?

Nasze spotkania odbywają się zazwyczaj raz w miesiącu i trwają około 2-3 godzin. Program typowego meetupu:

- **18:00-18:30** - Networking i pizza
- **18:30-19:30** - Główna prezentacja
- **19:30-20:00** - Q&A i dyskusja
- **20:00-21:00** - Swobodne rozmowy

## Dla kogo?

AI Jam jest otwarty dla wszystkich:
- Studentów zainteresowanych AI
- Profesjonalistów z branży tech
- Badaczy i naukowców
- Entuzjastów technologii

Nie musisz być ekspertem - wystarczy ciekawość i chęć nauki!

## Jak się przygotować?

1. **Dołącz do naszej grupy** na platformach społecznościowych
2. **Zarejestruj się** na nadchodzące spotkanie
3. **Przygotuj pytania** - zawsze zachęcamy do aktywnego uczestnictwa
4. **Przynieś laptop** (jeśli planowany jest warsztat)

## Zasady społeczności

- Szanuj innych uczestników
- Bądź otwarty na różne perspektywy
- Dziel się wiedzą
- Zadawaj pytania
- Baw się dobrze!

Do zobaczenia na meetupie! 🚀`,
        updatedAt: new Date().toISOString(),
      },
      // English versions
      {
        slug: 'about',
        title: 'About Us',
        locale: 'en',
        content: `# AI Jam Łódź History

AI Jam Łódź is a community of artificial intelligence enthusiasts that was founded in early 2024. Our goal is to create a space for exchanging knowledge, experiences, and inspiration related to AI.

## Our Mission

- **Education**: We organize regular meetings and workshops for people at various skill levels
- **Networking**: We connect people from the tech industry, students, and AI enthusiasts
- **Innovation**: We support the development of the local AI community and tech startups

## Team

We are a group of volunteers passionate about artificial intelligence and its applications. We organize meetings, invite speakers, and nurture the community's growth.`,
        updatedAt: new Date().toISOString(),
      },
      {
        slug: 'starter-pack',
        title: 'Starter Pack',
        locale: 'en',
        content: `# Welcome to AI Jam Łódź!

We're excited to have you join our community! Here's everything you need to know to get started.

## What to Expect?

Our meetups typically happen once a month and last about 2-3 hours. A typical meetup schedule:

- **18:00-18:30** - Networking and pizza
- **18:30-19:30** - Main presentation
- **19:30-20:00** - Q&A and discussion
- **20:00-21:00** - Open conversations

## Who is it for?

AI Jam is open to everyone:
- Students interested in AI
- Tech industry professionals
- Researchers and scientists
- Technology enthusiasts

You don't need to be an expert - curiosity and willingness to learn are enough!

## How to Prepare?

1. **Join our group** on social media platforms
2. **Register** for the upcoming meetup
3. **Prepare questions** - we always encourage active participation
4. **Bring a laptop** (if a workshop is planned)

## Community Guidelines

- Respect other participants
- Be open to different perspectives
- Share knowledge
- Ask questions
- Have fun!

See you at the meetup! 🚀`,
        updatedAt: new Date().toISOString(),
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
