import { prisma } from '@/lib/prisma';
import MeetupCard from '@/components/MeetupCard';

export const dynamic = 'force-dynamic';

export default async function MeetupsPage() {
  const allMeetups = await prisma.meetup.findMany({
    orderBy: { date: 'desc' },
  });

  const upcoming = allMeetups.filter(m => m.isUpcoming);
  const past = allMeetups.filter(m => !m.isUpcoming);

  return (
    <div className="py-16">
      <div className="container-custom">
        <h1 className="section-title">Nasze Meetupy</h1>
        <p className="section-subtitle">
          Historia naszych spotkań i nadchodzące wydarzenia
        </p>

        {/* Upcoming Meetups */}
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nadchodzące</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((meetup) => (
                <MeetupCard key={meetup.id} meetup={meetup} />
              ))}
            </div>
          </section>
        )}

        {/* Past Meetups */}
        {past.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Historia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((meetup) => (
                <MeetupCard key={meetup.id} meetup={meetup} />
              ))}
            </div>
          </section>
        )}

        {allMeetups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Nie ma jeszcze żadnych meetupów. Wróć wkrótce!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
