import { MapPin } from "lucide-react";

export default function CreatorLocationCard({ video, title = "E-commerce", location = "Cape Town", className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border-2 border-[#8B6BFF] ${className}`}>
      <video
        src={video}
        className="h-[520px] w-[280px] object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent to-45%" />

      <div className="absolute bottom-5 left-5 text-white">
        <h3 className="mb-2 text-[23px] font-black leading-none">{title}</h3>
        <div className="flex items-center gap-2 text-lg">
          <MapPin size={18} fill="currentColor" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
