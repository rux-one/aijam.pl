import Link from 'next/link';
import { Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import MeetupCard from '@/components/MeetupCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Get the next upcoming meetup
  const upcomingMeetup = await prisma.meetup.findFirst({
    where: { isUpcoming: true },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-12 h-12" />
              <h1 className="text-5xl md:text-6xl font-bold">AI Jam Łódź</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-primary-50">
              Społeczność entuzjastów sztucznej inteligencji w Łodzi
            </p>
            <p className="text-lg mb-8 text-primary-100">
              Dołącz do nas na regularnych meetupach, warsztatach i sesjach networkingowych.
              Rozwijaj swoją wiedzę o AI, poznawaj ciekawych ludzi i bądź częścią innowacyjnej społeczności!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/meetups" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Zobacz meetupy
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/starter-pack" className="btn-secondary border-white text-white hover:bg-white/10">
                Starter Pack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next Meetup Section */}
      {upcomingMeetup && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="section-title text-center">Nadchodzący Meetup</h2>
            <p className="section-subtitle text-center">
              Nie przegap naszego następnego spotkania!
            </p>
            <div className="max-w-2xl mx-auto">
              <MeetupCard meetup={upcomingMeetup} />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center">Dlaczego AI Jam?</h2>
          <p className="section-subtitle text-center">
            Poznaj korzyści z dołączenia do naszej społeczności
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Networking</h3>
              <p className="text-gray-600">
                Poznaj profesjonalistów, studentów i entuzjastów AI z Łodzi i okolic
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wiedza</h3>
              <p className="text-gray-600">
                Ucz się od ekspertów i dziel się swoimi doświadczeniami z innymi
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Regularne spotkania</h3>
              <p className="text-gray-600">
                Comiesięczne meetupy z ciekawymi prezentacjami i warsztatami
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Gotowy na dołączenie?</h2>
          <p className="text-xl mb-8 text-primary-50">
            Sprawdź nasz Starter Pack i dowiedz się wszystkiego o AI Jam Łódź
          </p>
          <Link href="/starter-pack" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Przejdź do Starter Pack
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
