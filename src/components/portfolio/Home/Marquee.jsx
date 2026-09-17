import Card from "./Card";

/**
 * Marquee component
 * @param {Array} details - list of details objects
 * @param {String} direction - "left" | "right" | "up" | "down"
 */

export default function  Marquee({ details = [], direction = "left", fadeEdges = false, height, width, isImage=false, cardHeight, cardWidth, mediaClassName="" }) {
    const isVertical = direction === "up" || direction === "down";

    return (
        <div className={`w-full overflow-hidden relative h-[${isVertical ? height : "auto"}]`} style={{ width }}>
            {/* edge fades */}
            {!isVertical && fadeEdges && (
                <>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
                </>
            )}
            {isVertical && fadeEdges && (
                <>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
                </>
            )}


            <div
                className={`
                    flex
                    ${isVertical ? "flex-col" : "flex-row"}
                    gap-4
                    w-max
                    h-max
                    ${getAnimationClass(direction)}
                `}
            >
                {details.length > 0 &&
                    details.map((element, idx) => (
                        <Card
                            key={idx}
                            url={element?.url}
                            isImage={isImage}
                            name={element?.name}
                            flag={element?.flag}
                            location={element?.location}
                            cardHeight={cardHeight}
                            cardWidth={cardWidth}
                            mediaClassName={mediaClassName}
                        />
                    ))}
            </div>
        </div>
    );
}

/** Helper: map direction to CSS animation */
function getAnimationClass(direction) {
    switch (direction) {
        case "right":
            return "animate-scrollRight";
        case "up":
            return "animate-scrollUp";
        case "down":
            return "animate-scrollDown";
        default:
            return "animate-scrollLeft"; // default
    }
}


// import { useEffect, useRef, useState } from "react";
// import Card from "./Card";

// export default function Marquee({
//   details = [],
//   direction = "left",
//   speed = 100,
//   fadeEdges = false,
//   height,
//   width,
//   isImage = false,
//   cardHeight,
//   cardWidth,
//   mediaClassName = "",
// }) {
//   const isVertical = direction === "up" || direction === "down";
//   const marqueeRef = useRef(null);
//   const [duration, setDuration] = useState(20);

//   useEffect(() => {
//     if (!marqueeRef.current) return;
//     const el = marqueeRef.current;

//     const updateDuration = () => {
//       const scrollSize = isVertical ? el.scrollHeight : el.scrollWidth;
//       const newDuration = scrollSize / speed;
//       setDuration(Number.isFinite(newDuration) ? newDuration : 20);
//     };

//     // Only recalc once when all media are ready
//     const mediaElements = el.querySelectorAll("img, video");
//     let loaded = 0;

//     const handleMediaLoad = () => {
//       loaded++;
//       if (loaded === mediaElements.length) updateDuration();
//     };

//     if (mediaElements.length === 0) updateDuration();
//     else {
//       mediaElements.forEach((media) => {
//         if (
//           (media.tagName === "IMG" && media.complete) ||
//           (media.tagName === "VIDEO" && media.readyState >= 2)
//         ) {
//           loaded++;
//           if (loaded === mediaElements.length) updateDuration();
//         } else {
//           media.addEventListener("load", handleMediaLoad);
//           media.addEventListener("loadeddata", handleMediaLoad, { once: true });
//         }
//       });
//     }

//     return () => {
//       mediaElements.forEach((media) => {
//         media.removeEventListener("load", handleMediaLoad);
//         media.removeEventListener("loadeddata", handleMediaLoad);
//       });
//     };
//   }, [details, speed, isVertical]);

//   return (
//     <div
//       className="w-full overflow-hidden relative"
//       style={{ height: isVertical ? height : "auto", width }}
//     >
//       {/* Edge fade gradients */}
//       {fadeEdges && (
//         <>
//           {!isVertical && (
//             <>
//               <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
//             </>
//           )}
//           {isVertical && (
//             <>
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent z-10" />
//               <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
//             </>
//           )}
//         </>
//       )}

//       {/* Scrolling content */}
//       <div
//         ref={marqueeRef}
//         className={`flex ${isVertical ? "flex-col" : "flex-row"} gap-4 w-max h-max ${getAnimationClass(direction)}`}
//         style={{
//           animationDuration: `${duration}s`,
//           willChange: "transform",
//         }}
//       >
//         {[...details, ...details].map((element, idx) => (
//           <Card
//             key={idx}
//             url={element?.url}
//             isImage={isImage}
//             name={element?.name}
//             flag={element?.flag}
//             location={element?.location}
//             cardHeight={cardHeight}
//             cardWidth={cardWidth}
//             mediaClassName={mediaClassName}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function getAnimationClass(direction) {
//   switch (direction) {
//     case "right":
//       return "animate-scrollRight";
//     case "up":
//       return "animate-scrollUp";
//     case "down":
//       return "animate-scrollDown";
//     default:
//       return "animate-scrollLeft";
//   }
// }

