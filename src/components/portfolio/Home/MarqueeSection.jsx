import Marquee from "./Marquee";

export default function MarqueeSection({ details = [], isImage = false, direction = "left", height = "", width="", cardHeight="", cardWidth="", mediaClassName="" }) {
  return (
    <section className="">
     
      <Marquee
        details={details}
        isImage={isImage}
        direction={direction}
        height={height}
        width={width}
        cardHeight={cardHeight}
        cardWidth={cardWidth}
        fadeEdges={false}
        mediaClassName={mediaClassName}
      />
    </section>
  );
}



