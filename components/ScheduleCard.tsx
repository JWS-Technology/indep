// app/events/EventCard.tsx
import { EventItem } from "@/data/events";

interface EventCardProps {
  event: EventItem;
  isExpanded: boolean;
  onClick: () => void;
}

export default function EventCard({ event, isExpanded, onClick }: EventCardProps) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg transition-all duration-300 ${
        isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Clickable Header */}
      <div 
        onClick={onClick}
        className="p-4 cursor-pointer flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              event.stageType === "ON_STAGE" 
                ? "bg-red-100 text-red-700" 
                : "bg-blue-100 text-blue-700"
            }`}>
              {event.stageType === "ON_STAGE" ? "🎭 On Stage Event" : "🎨 Off Stage Event"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            📅 {event.date} {event.time && `• ${event.time}`}
          </p>
        </div>
        
        {/* Expand/Collapse Icon */}
        <div className={`transform transition-transform duration-300 ${
          isExpanded ? 'rotate-180' : ''
        }`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 animate-slideDown">
          <div className="space-y-3">
            {/* Venue */}
            <div className="flex items-center text-sm text-gray-700">
              <span className="text-gray-500 mr-3">📍</span>
              <span className="font-medium">Venue: </span>
              <span className="ml-2">{event.venue || "To be announced"}</span>
            </div>

            {/* Incharge */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="text-gray-500 mr-2">👤</span>
                Event Incharge
              </p>
              <div className="space-y-2 ml-6">
                {event.incharge.map((p, idx) => (
                  <div key={idx} className="text-sm text-gray-600">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({p.department || "General"})</span>
                  </div>
                ))}
              </div>
            </div>

           
          </div>
        </div>
      )}
    </div>
  );
}