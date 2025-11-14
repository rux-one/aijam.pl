import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StarterPackPage() {
  const starterPackPage = await prisma.page.findFirst({
    where: {
      slug: 'starter-pack',
      locale: 'pl',
    },
  });

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title">{starterPackPage?.title || 'Starter Pack'}</h1>
          
          {starterPackPage ? (
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{starterPackPage.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Witaj w AI Jam Łódź!</h2>
                <p className="text-gray-700 mb-4">
                  Cieszymy się, że dołączasz do naszej społeczności! Oto wszystko, co musisz wiedzieć na początek.
                </p>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-3">Czego się spodziewać?</h3>
                <p className="text-gray-700 mb-4">
                  Nasze spotkania odbywają się zazwyczaj raz w miesiącu i trwają około 2-3 godzin. Program typowego meetupu:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>18:00-18:30</strong> - Networking i pizza</li>
                  <li><strong>18:30-19:30</strong> - Główna prezentacja</li>
                  <li><strong>19:30-20:00</strong> - Q&A i dyskusja</li>
                  <li><strong>20:00-21:00</strong> - Swobodne rozmowy</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-3">Dla kogo?</h3>
                <p className="text-gray-700 mb-4">AI Jam jest otwarty dla wszystkich:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Studentów zainteresowanych AI</li>
                  <li>Profesjonalistów z branży tech</li>
                  <li>Badaczy i naukowców</li>
                  <li>Entuzjastów technologii</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Nie musisz być ekspertem - wystarczy ciekawość i chęć nauki!
                </p>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-3">Jak się przygotować?</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Dołącz do naszej grupy</strong> na platformach społecznościowych</li>
                  <li><strong>Zarejestruj się</strong> na nadchodzące spotkanie</li>
                  <li><strong>Przygotuj pytania</strong> - zawsze zachęcamy do aktywnego uczestnictwa</li>
                  <li><strong>Przynieś laptop</strong> (jeśli planowany jest warsztat)</li>
                </ol>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-3">Zasady społeczności</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Szanuj innych uczestników</li>
                  <li>Bądź otwarty na różne perspektywy</li>
                  <li>Dziel się wiedzą</li>
                  <li>Zadawaj pytania</li>
                  <li>Baw się dobrze!</li>
                </ul>
              </div>

              <div className="text-center mt-8">
                <p className="text-xl font-semibold mb-4">Do zobaczenia na meetupie! 🚀</p>
                <Link href="/meetups" className="btn-primary">
                  Zobacz nadchodzące meetupy
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
