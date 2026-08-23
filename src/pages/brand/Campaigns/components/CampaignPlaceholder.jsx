import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CampaignBanner from '../../../creator/ExploreCampaigns/components/CampaignBanner';
import CampaignCard from '../../../creator/ExploreCampaigns/components/CampaignCard';
import demoVideoUrl from '../../../../assets/images/creator/thumbanilvideo.png';
import campaignImage from '../../../../assets/images/creator/explorcampagainImag.png';
import CampaignsNav, { navLinks } from './CampaignsNav';
// Tables moved to /brand/campaigns/allCampaigns (ViewAllCampaigns)
import { motion } from 'framer-motion';
import { PlayIcon ,ChevronRightIcon ,ChevronLeftIcon} from '../../../../assets/SVGs/brands/customSVGs';

export default function CampaignsPlaceholder () {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [direction, setDirection] = useState("next");
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApplyNow = (campaignId) => {
    navigate(`/brand/campaigns/${campaignId}/view`);
  };

  const handleViewDetails = (campaignId) => {
    navigate(`/brand/campaigns/${campaignId}/view`);
  };

  const campaigns = [
    {
      id: 1,
      title: "Unboxing Photo Shoot",
      description:
        "Passionate content creator specializing in lifestyle, fashion, and brand collaborations.",
      media: campaignImage,
      tags: ["Unboxing", "Reels", "Photos"],
      isBookmarked: true,
    },
    {
      id: 2,
      title: "Product Review Campaign",
      description:
        "Create engaging product reviews that showcase authentic user experiences and drive conversions.",
      media: campaignImage,
      tags: ["Review", "Authentic", "Product"],
      isBookmarked: false,
    },
    {
      id: 3,
      title: "Brand Collaboration",
      description:
        "Partner with leading brands to create compelling content that resonates with your audience.",
      media: campaignImage,
      tags: ["Collaboration", "Brand", "Content"],
      isBookmarked: false,
    },
    {
      id: 4,
      title: "Social Media Campaign",
      description:
        "Develop viral social media content that increases brand awareness and engagement.",
      media: campaignImage,
      tags: ["Social", "Viral", "Engagement"],
      isBookmarked: true,
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prevIndex) => {
        const maxIndex = isMobile ? campaigns.length - 1 : campaigns.length - 2;
        if (prevIndex >= maxIndex) {
          setIsAutoPlaying(false);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [campaigns.length, isAutoPlaying, isMobile]);

  const nextSlide = () => {
    setDirection("next");
    setCurrentIndex((prevIndex) => {
      const maxIndex = isMobile ? campaigns.length - 1 : campaigns.length - 2;
      return prevIndex >= maxIndex ? prevIndex : prevIndex + 1;
    });
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setDirection("prev");
    setCurrentIndex((prevIndex) => {
      return prevIndex <= 0 ? 0 : prevIndex - 1;
    });
    setIsAutoPlaying(false);
  };

  const visibleCampaigns = [
    campaigns[currentIndex],
    ...(isMobile ? [] : [campaigns[(currentIndex + 1) % campaigns.length]]),
  ].filter(Boolean);

  const navActiveIndex = navLinks.findIndex(
    (n) => n.href === location.pathname
  );

  // Tab/table rendering removed from this page. Use /brand/campaigns/allCampaigns for listing.

  return (
    <div className="bg-[#f8f8f8]">
      <div className="min-h-screen max-w-[1920px] mx-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <CampaignsNav />
        </div>

        <CampaignBanner
          subtitle="Create For Impact"
          title="LAUNCH POWERFUL CAMPAIGNS THAT DRIVE IMPACT AND ENGAGEMENT"
          buttonLabel="Create Campaign"
          buttonRoute="/brand/campaigns/create"
          topNavLinks={navLinks}
          activeIndex={navActiveIndex === -1 ? 0 : navActiveIndex}
        />
        <div className=" px-2 sm:px-6 lg:px-8 py-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 md:mb-10 bg-white rounded-xl p-4">
            <div>
              <div className="relative bg-gray-300 rounded-2xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <video
                  className="w-full h-full object-cover"
                  poster={demoVideoUrl}
                  controls
                >
                  <source src={demoVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <PlayIcon className="w-8 h-8 text-gray-400 ml-1" />
                  </div>
                </div>
              </div>
              <div className="max-w-3xl md:mb-10 mb-4 pt-4">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Congratulations, and welcome to Creatrend. Before starting
                  your first collaboration, please watch this video for tips on
                  creating high-quality videos and managing contracts with
                  brands.
                </p>
              </div>
            </div>
            <div className="flex flex-col relative bg-stone-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-anton text-xl md:text-2xl font-bold text-gray-900">
                  My Campaigns
                </h2>
                <div>
                  <button
                    onClick={() => navigate("/brand/campaigns/allCampaigns")}
                    className="w-full sm:flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer hover:text-[#0c7bb3]"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 z-10 sm:hidden ">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`w-10 h-10 rounded-sm shadow-sm flex items-center justify-center transition-all ${
                    currentIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white/90 hover:bg-white text-gray-700 hover:scale-110"
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={
                    currentIndex >=
                    (isMobile ? campaigns.length - 1 : campaigns.length - 2)
                  }
                  className={`w-10 h-10 rounded-sm shadow-sm flex items-center justify-center transition-all ${
                    currentIndex >=
                    (isMobile ? campaigns.length - 1 : campaigns.length - 2)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white/90 hover:bg-white text-gray-700 hover:scale-110"
                  }`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-1 bg-stone-50 rounded-2xl p-2">
                <div className="relative h-[400px] sm:h-[450px] overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {visibleCampaigns.map((campaign) => (
                      <motion.div
                        key={campaign.id}
                        layout
                        initial={{
                          opacity: 0,
                          x: direction === "next" ? 300 : -300,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: direction === "next" ? -300 : 300,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.5,
                        }}
                        className="h-full"
                      >
                        <CampaignCard
                          campaign={campaign}
                          onApplyClick={handleApplyNow}
                          onViewDetailsClick={handleViewDetails}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab navigation and tables moved to /brand/campaigns/allCampaigns */}
        </div>
      </div>
    </div>
  );
}
