import { useParams, useNavigate } from "react-router-dom";
import CampaignDetailsSection from "../../ExploreCampaigns/components/CampaignDetailsSection";
import MoodboardsSection from "../../ExploreCampaigns/components/MoodboardsSection";
import CampaignsPara from "../../ExploreCampaigns/components/CampaignsPara";
import nikeLogo from "../../../../assets/images/brands/nikeLogo.png";
import moodboardMain from "../../../../assets/images/campaign/moodboardsMain.jpg";
import moodboard1 from "../../../../assets/images/campaign/moodboards1.jpg";
import moodboard2 from "../../../../assets/images/campaign/moodboards2.jpg";
import bannerImage from "../../../../assets/images/campaign/bannerImage.jpg";
import pitchVideoImage from "../../../../assets/images/creator/pitchVideo.png";
import playIcon from "../../../../assets/SVGs/creator/playIcon.svg";

export default function AppliedJobs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const jobData = {
    id: id,
    title: "Unboxing Photo Shoot",
    budget: "1,200",
    daysLeft: "08",
    brandName: "NIKE",
    brandLogo: nikeLogo,
    isVerified: true,
    description: `The brand is actively seeking talented creators who have the ability to produce captivating and high-quality unboxing videos that not only showcase the product in an appealing and authentic manner but also highlight its key features, packaging, and overall user experience. These videos should be visually engaging and emotionally compelling, capturing the audience's attention from the very beginning while effectively communicating the value and uniqueness of the product. The goal is to create content that feels genuine and trustworthy, helping potential customers connect with the brand on a deeper level and making the unboxing process an exciting and shareable moment. Creators are expected to bring their own creative flair and storytelling skills to ensure the videos resonate with the target audience and align with the brand's tone, aesthetics, and overall marketing objectives.`,
    website: "www.nike.com",
    city: "London",
    country: "United Kingdom",
    campaignStartDate: "6 Jun, 2025",
    creatorsNeeded: "5",
    status: "Active",
    deliverable: "Photos",
    applicants: "Global",
    moodboards: [
      {
        image: moodboardMain,
        title: "Nykaa Brand Photo Shoot",
        category: "Fashion Shoot • Events",
      },
      {
        image: moodboard1,
        title: "Fashion Collection",
        category: "Fashion Shoot",
      },
      {
        image: moodboard2,
        title: "Brand Campaign",
        category: "Fashion Shoot",
      },
    ],
    campaignParagraphs: [
      {
        title: "Content We'd Love From You",
        content:
          "The brand is actively seeking talented creators who have the ability to produce captivating and high-quality unboxing videos that not only showcase the product in an appealing and authentic manner but also highlight its key features, packaging, and overall user experience. These videos should be visually engaging and emotionally compelling, capturing the audience's attention from the very beginning while effectively communicating the value and uniqueness of the product. The goal is to create content that feels genuine and trustworthy, helping potential customers connect with the brand on a deeper level and making the unboxing process an exciting and shareable moment. Creators are expected to bring their own creative flair and storytelling skills to ensure the videos resonate with the target audience and align with the brand's tone, aesthetics, and overall marketing objectives.",
      },
      {
        title: "Pitch Your Concept First",
        content:
          "The brand is actively seeking talented creators who have the ability to produce captivating and high-quality unboxing videos that not only showcase the product in an appealing and authentic manner but also highlight its key features, packaging, and overall user experience. These videos should be visually engaging and emotionally compelling, capturing the audience's attention from the very beginning while effectively communicating the value and uniqueness of the product. The goal is to create content that feels genuine and trustworthy, helping potential customers connect with the brand on a deeper level and making the unboxing process an exciting and shareable moment. Creators are expected to bring their own creative flair and storytelling skills to ensure the videos resonate with the target audience and align with the brand's tone, aesthetics, and overall marketing objectives.",
      },
      {
        title: "How to Get Our Product",
        content:
          "The brand is actively seeking talented creators who have the ability to produce captivating and high-quality unboxing videos that not only showcase the product in an appealing and authentic manner but also highlight its key features, packaging, and overall user experience. These videos should be visually engaging and emotionally compelling, capturing the audience's attention from the very beginning while effectively communicating the value and uniqueness of the product. The goal is to create content that feels genuine and trustworthy, helping potential customers connect with the brand on a deeper level and making the unboxing process an exciting and shareable moment. Creators are expected to bring their own creative flair and storytelling skills to ensure the videos resonate with the target audience and align with the brand's tone, aesthetics, and overall marketing objectives.",
      },
      {
        title: "Campaign Rules",
        list: [
          "Follow the campaign brief exactly (content type, length, orientation, deadline).",
          "Only apply if youre confident you can deliver quality content on time.",
          "Submit original content — no repeats, no stock footage.",
          "Ensure all content is free of watermarks or logos (unless brand-approved)",
        ],
      },
      {
        title: "Brand Activity",
        note: "Brand was last active 10 days ago",
      },
    ],
    // Applied job specific data
    coverLetter:
      "The brand is actively seeking talented creators who have the ability to produce captivating and high-quality unboxing videos that not only showcase the product in an appealing and authentic manner but also highlight its key features, packaging, and overall user experience. These videos should be visually engaging and emotionally compelling, capturing the audience's attention from the very beginning while effectively communicating the value and uniqueness of the product. The goal is to create content that feels genuine and trustworthy, helping potential customers connect with the brand on a deeper level and making the unboxing process an exciting and shareable moment. Creators are expected to bring their own creative flair and storytelling skills to ensure the videos resonate with the target audience and align with the brand's tone, aesthetics, and overall marketing objectives.",
    pitchVideo: pitchVideoImage,
  };

  const breadcrumbs = [
    { label: "My Collabs", link: "/creator/my-jobs" },
    { label: "View Collaborations", link: null },
  ];

  const handleWithdrawApplication = () => {
    // TODO: Implement withdraw application logic
    console.log("Withdrawing application for job:", id);
    // After withdrawal, navigate back to my jobs
    // navigate('/creator/my-jobs');
  };

  return (
    <div className="max-w-[1920px] mx-auto min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {crumb.link ? (
                  <button
                    onClick={() => navigate(crumb.link)}
                    className="hover:text-[#0c7bb3] transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "text-[#0c7bb3] font-medium"
                        : ""
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Title and Withdraw Button */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              {jobData.title}
            </h1>
            <button
              onClick={handleWithdrawApplication}
              className="main-btn text-white font-medium md:px-6 md:py-3 px-4 py-2 rounded-full text-base transition-colors whitespace-nowrap"
            >
              Withdraw Application
            </button>
          </div>

          {/* Banner Image */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
            <img
              src={bannerImage}
              alt={jobData.title}
              className="w-full h-full object-cover"
            />
            {jobData.daysLeft && (
              <div className="absolute top-3 right-3 bg-blue-200 text-[#0c7bb3] px-2.5 py-2.5 rounded-lg">
                <div className="text-2xl text-center font-extrabold tracking-tighter">
                  {jobData.daysLeft}
                </div>
                <div className="text-xs font-medium text-gray-800">
                  Days Left
                </div>
              </div>
            )}
          </div>

          {/* Brand Info and Budget */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {jobData.brandLogo && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={jobData.brandLogo}
                    alt={jobData.brandName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900">
                  {jobData.brandName}
                </h2>
                {jobData.isVerified && (
                  <svg
                    className="w-5 h-5 text-[#0c7bb3]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            {jobData.budget && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Budget
                </span>
                <span className="text-xl tracking-tighter font-extrabold text-[#0c7bb3]">
                  ${jobData.budget}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <CampaignDetailsSection
        description={jobData.description}
        website={jobData.website}
        city={jobData.city}
        country={jobData.country}
        campaignStartDate={jobData.campaignStartDate}
        creatorsNeeded={jobData.creatorsNeeded}
        status={jobData.status}
        deliverable={jobData.deliverable}
        applicants={jobData.applicants}
      />

      {/* Moodboards */}
      <MoodboardsSection moodboards={jobData.moodboards} />

      {/* Campaign Paragraphs */}
      <CampaignsPara sections={jobData.campaignParagraphs} />

      {/* Cover Letter Section - Only shown for Applied Jobs */}
      <div className="max-w-[1920px] mx-auto">
        <div className="bg-white rounded-xl p-6 sm:p-8">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Cover Letter
          </h3>
          <p className="text-gray-700 leading-loose text-xs md:text-sm mb-4">
            {jobData.coverLetter}
          </p>
        </div>
      </div>

      {/* Pitch Video Section - Only shown for Applied Jobs */}
      <div className="max-w-[1920px] mx-auto">
        <div className="bg-white rounded-xl p-6 sm:p-8">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Pitch Video
          </h3>
          <div className="relative w-full max-w-md aspect-[7/4] rounded-xl overflow-hidden bg-gray-100">
            <img
              src={jobData.pitchVideo}
              alt="Pitch Video"
              className="w-full h-full object-cover"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                <img
                  src={playIcon}
                  alt="Play"
                  className="w-12 h-12 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
