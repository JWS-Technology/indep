import EventCard from "./ScheduleCard";

// Define the shape locally to match your MongoDB Schema
// Or you can move this to a shared 'types.ts' file
export interface EventItem {
  _id: string;
  title: string;
  category: string;
  stageType: "ON_STAGE" | "OFF_STAGE";
  venue: string;
  date: string;
  time: string;
  incharge?: { name: string; department: string }[];
  status?: string;
}

interface Props {
  title: string;
  events: EventItem[];
  onEventClick: (eventId: string) => void;
}

export default function EventSection({ title, events, onEventClick }: Props) {
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
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500">No events in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard
              // IMPORTANT: MongoDB uses '_id', not 'id'
              key={event._id}
              event={event}
              onClick={() => onEventClick(event._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}