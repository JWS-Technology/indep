import type { EventItem } from "@/types/EventItem";

interface EventCardProps {
  event: EventItem;
  onClick: () => void;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-5 space-y-3">

      {/* Header */}
      <div className="flex flex-col gap-1">
        {/* Title + Category Badge Side-by-Side */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[18px] font-extrabold text-gray-900 leading-tight">
            {event.title}
          </h3>

          <span
            className={`text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap ${event.stageType === "ON_STAGE"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
              }`}
          >
            {event.stageType === "ON_STAGE"
              ? "🎭 On Stage"
              : "🎨 Off Stage"}
          </span>
        </div>
      </div>

      {/* Marquee Details */}
      <div className="overflow-hidden whitespace-nowrap marquee-container py-1">
        <div className="marquee inline-block text-sm text-gray-700">

          📅 <strong>Date:</strong> {event.date || "TBA"} &nbsp;•&nbsp;
          🕒 <strong>Time:</strong> {event.time || "TBA"} &nbsp;•&nbsp;
          📍 <strong>Venue:</strong> {event.venue || "Will be announced"} &nbsp;•&nbsp;
          👤 <strong>Incharge:</strong>&nbsp;
          {event.incharge?.map((p, i) => (
            <span key={i}>
              {p.name} &nbsp;&nbsp;
            </span>
          ))}


        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(20%); }
          100% { transform: translateX(-100%); }
        }
        .marquee {
          display: inline-block;
          animation: slide 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
