import { prisma } from '@/lib/prisma';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export const dynamic = 'force-dynamic';

export default async function QRInfoPage() {
  const upcomingMeetup = await prisma.meetup.findFirst({
    where: { isUpcoming: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const qrUrl = `${baseUrl}/qr-info`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 py-8">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-12 h-12 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">AI Jam Łódź</h1>
            </div>
            <p className="text-xl text-primary-50">
              Społeczność entuzjastów AI w Łodzi
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            {upcomingMeetup ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Nadchodzący Meetup
                </h2>
                
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-primary-600">
                    {upcomingMeetup.title}
                  </h3>
                  
                  <p className="text-gray-700">
                    {upcomingMeetup.description}
                  </p>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Data i godzina</p>
                        <p className="text-gray-700">
                          {new Date(upcomingMeetup.date).toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                          {' o '}
                          {new Date(upcomingMeetup.date).toLocaleTimeString('pl-PL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Lokalizacja</p>
                        <p className="text-gray-700">{upcomingMeetup.location}</p>
                      </div>
                    </div>
                    
                    {upcomingMeetup.speaker && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Prelegent</p>
                          <p className="text-gray-700">{upcomingMeetup.speaker}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  AI Jam Łódź
                </h2>
                <p className="text-gray-700 mb-4">
                  Społeczność entuzjastów sztucznej inteligencji w Łodzi
                </p>
                <p className="text-gray-600">
                  Brak zaplanowanych meetupów. Sprawdź naszą stronę wkrótce!
                </p>
              </div>
            )}
            
            <div className="text-center pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">Więcej informacji:</p>
              <p className="font-mono text-primary-600 font-semibold">
                {baseUrl}
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Udostępnij tę stronę
            </h3>
            <p className="text-gray-600 mb-6">
              Zeskanuj kod QR, aby szybko udostępnić informacje o AI Jam
            </p>
            <QRCodeGenerator url={qrUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
