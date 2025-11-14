import { Calendar, MapPin, Users, User } from 'lucide-react';
import type { Meetup } from '@prisma/client';

interface MeetupCardProps {
  meetup: Meetup;
}

export default function MeetupCard({ meetup }: MeetupCardProps) {
  const date = new Date(meetup.date);
  const formattedDate = date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card">
      {meetup.imageUrl && (
        <div className="w-full h-48 bg-gradient-to-r from-primary-400 to-accent-400 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white text-6xl">🤖</span>
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{meetup.title}</h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{meetup.description}</p>
      
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <span>{formattedDate} o {formattedTime}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-600" />
          <span>{meetup.location}</span>
        </div>
        
        {meetup.speaker && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600" />
            <span>{meetup.speaker}</span>
          </div>
        )}
        
        {!meetup.isUpcoming && meetup.attendees > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-600" />
            <span>{meetup.attendees} uczestników</span>
          </div>
        )}
      </div>
      
      {meetup.isUpcoming && (
        <div className="mt-4 pt-4 border-t">
          <span className="inline-block bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
            Nadchodzący meetup
          </span>
        </div>
      )}
    </div>
  );
}
