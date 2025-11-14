import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const aboutPage = await prisma.page.findFirst({
    where: {
      slug: 'about',
      locale: 'pl',
    },
  });

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title">{aboutPage?.title || 'O nas'}</h1>
          
          {aboutPage ? (
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{aboutPage.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Historia AI Jam Łódź</h2>
              <p className="text-gray-700 mb-4">
                AI Jam Łódź to społeczność entuzjastów sztucznej inteligencji, która powstała na początku 2024 roku. 
                Naszym celem jest tworzenie przestrzeni do wymiany wiedzy, doświadczeń i inspiracji związanych z AI.
              </p>
              
              <h3 className="text-xl font-bold mb-3 mt-6">Nasza misja</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Edukacja:</strong> Organizujemy regularne spotkania i warsztaty dla osób na różnych poziomach zaawansowania</li>
                <li><strong>Networking:</strong> Łączymy ludzi z branży tech, studentów i pasjonatów AI</li>
                <li><strong>Innowacja:</strong> Wspieramy rozwój lokalnej społeczności AI i startupów technologicznych</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 mt-6">Zespół</h3>
              <p className="text-gray-700">
                Jesteśmy grupą wolontariuszy pasjonujących się sztuczną inteligencją i jej zastosowaniami. 
                Organizujemy spotkania, zapraszamy prelegentów i dbamy o rozwój społeczności.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
