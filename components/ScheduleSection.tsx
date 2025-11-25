// app/events/EventSection.tsx
import EventCard from "./ScheduleCard";
import { EventItem } from "@/data/events";

interface Props {
  title: string;
  events: EventItem[];
  expandedEventId: string | null;
  onEventClick: (eventId: string) => void;
}

export default function EventSection({ title, events, expandedEventId, onEventClick }: Props) {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {events.length}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              event={event}
              isExpanded={expandedEventId === event.id}
              onClick={() => onEventClick(event.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}