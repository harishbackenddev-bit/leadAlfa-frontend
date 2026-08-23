import MediaViewer from "../../common/MediaViewer";

export default function Card({ url, name, flag, location, cardHeight, cardWidth, mediaClassName = "" }) {
  return (
    <div className="relative flex flex-col gap-2" style={{ height: cardHeight, width: cardWidth }}>
      {/* Media */}
      <MediaViewer file={url} className={mediaClassName} alt={url || "card-media"} autoPlay
        muted
        loop
        playsInline />
      {/* Overlay Content */}
      <div className="absolute bottom-2 left-2 md:bottom-6 md:left-4 lg:bottom-4 lg:left-4 flex flex-col gap-1 md:gap-2 text-white text-xs md:text-sm">
        <h4 className="font-semibold text-[8px] md:text-[12px]">{name}</h4>
        <p className="flex text-[6px] md:text-[10px] items-center gap-2 max-w-[120px] md:max-w-[200px]">
          {flag && <img src={flag} alt="flag" className="w-3 h-3 md:w-5 md:h-5" />}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {location}
          </span>
        </p>

      </div>
    </div>
  );
}
