import HeroCaseStudy from '../../components/portfolio/caseStudies/Hero';
import VideoGrid from '../../components/portfolio/caseStudies/VideosSection';
import Industries from '../../components/portfolio/Home/Industries';
import VideoCarousel from '../../components/portfolio/Home/VideoCarousel';

export default function CaseStudies() {
  
  
const action = (slug) => {
console.log(slug);

}
  return (
    <div>
      {/* Country Selector Section */}
      <section className="bg-primary flex flex-col items-center text-center px-4 pt-10 ">
        <HeroCaseStudy action={action}/>
      </section>

     

        {/* s-3 Industries Section */}
            <section >
              <div className="px-4 md:px-[10vw] py-[8vh] bg-primary">
                <h1 className="text-center font-semibold text-3xl mb-10 md:mb-5 md:text-4xl">
                  UGC Videos For All <span className="mark">Industries</span>
                </h1>
                <Industries />
                <VideoGrid />
              </div>
            </section>
    </div>
  );
}
