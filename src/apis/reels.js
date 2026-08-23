import { PORTFOLIO_VIDEOS } from "../components/portfolio/data/portfolioVideos";
import ukIcon from "../assets/SVGs/portfolio/main/uk.svg";
import zaIcon from "../assets/SVGs/portfolio/main/za.svg";
import zmIcon from "../assets/SVGs/portfolio/main/zm.svg";
import zwIcon from "../assets/SVGs/portfolio/main/zim.svg";
import auIcon from "../assets/SVGs/portfolio/main/auIcon.svg";
import caIcon from "../assets/SVGs/portfolio/main/auIcon.svg";
import usIcon from "../assets/SVGs/portfolio/main/auIcon.svg";

const MARQUEE_REEL_META = [
  { slug: "gb", flag: ukIcon, location: "London, UK" },
  { slug: "gb", flag: ukIcon, location: "Manchester, UK" },
  { slug: "gb", flag: ukIcon, location: "Birmingham, UK" },
  { slug: "za", flag: zaIcon, location: "Johannesburg, South Africa" },
  { slug: "za", flag: zaIcon, location: "Cape Town, South Africa" },
  { slug: "za", flag: zaIcon, location: "Durban, South Africa" },
  { slug: "zm", flag: zmIcon, location: "Lusaka, Zambia" },
  { slug: "zw", flag: zwIcon, location: "Harare, Zimbabwe" },
  { slug: "au", flag: auIcon, location: "Sydney, Australia" },
];

const MARQUEE_REELS = PORTFOLIO_VIDEOS.slice(0, 9).map((video, index) => ({
  name: video.name,
  url: video.src,
  ...MARQUEE_REEL_META[index],
}));

const video1 = PORTFOLIO_VIDEOS[0].src;
const video2 = PORTFOLIO_VIDEOS[1].src;
const video3 = PORTFOLIO_VIDEOS[2].src;
const video4 = PORTFOLIO_VIDEOS[3].src;
const video5 = PORTFOLIO_VIDEOS[4].src;
const video6 = PORTFOLIO_VIDEOS[5].src;
const video7 = PORTFOLIO_VIDEOS[6].src;
const video8 = PORTFOLIO_VIDEOS[7].src;
const video9 = PORTFOLIO_VIDEOS[8].src;
const video10 = PORTFOLIO_VIDEOS[9].src;

const videos = [video1, video2, video3, video4, video5, video6, video7, video8, video9, video10];
const randomVideo = () => videos[Math.floor(Math.random() * videos.length)];
const sampleVideo="https://cdn.pixabay.com/video/2023/11/02/187536-880665469_large.mp4"
export const mockReels = [  
  { name: "Rhea Nair", slug: "gb", flag: ukIcon, location: "Birmingham, UK", url: video1 },
  { name: "Ananya Mehta", slug: "gb", flag: ukIcon, location: "Manchester, UK", url: video2 },
  { name: "Maya Kapoor", slug: "gb", flag: ukIcon, location: "London, UK", url: video3 },
  { name: "Priya Singh", slug: "gb", flag: ukIcon, location: "Delhi, India", url: video4 },
  { name: "Sophie Turner", slug: "gb", flag: ukIcon, location: "London, UK", url: video5 },
  { name: "Shriya Sharma", slug: "gb", flag: ukIcon, location: "London, UK", url: video6 },
  { name: "Raj Laxmi", slug: "za", flag: zaIcon, location: "Mumbai, India", url: video7 },
  { name: "Naledi Khumalo", slug: "za", flag: zaIcon, location: "Pretoria, South Africa", url: video8 },
  { name: "Thandi Mokoena", slug: "za", flag: zaIcon, location: "Durban, South Africa", url: video4},
{ name: "Ava Patel", slug: "za", flag: zaIcon, location: "Johannesburg, South Africa", url: video8  },
  { name: "Zara Khan", slug: "za", flag: zaIcon, location: "Cape Town, South Africa", url: video9 },
  { name: "Lerato Dlamini", slug: "za", flag: zaIcon, location: "Bloemfontein, South Africa", url: video10 },
  { name: "Mwansa Phiri", slug: "zm", flag: zmIcon, location: "Kitwe, Zambia", url: video1   },
  { name: "Emma Watson", slug: "zm", flag: zmIcon, location: "Paris, France", url: video1  },
  { name: "Lily James", slug: "zm", flag: zmIcon, location: "Lusaka, Zambia", url:  video1 },
  { name: "Chipo Banda", slug: "zm", flag: zmIcon, location: "Ndola, Zambia", url:    video1 },
  { name: "Grace Mwila", slug: "zm", flag: zmIcon, location: "Livingstone, Zambia", url: video3 },
  { name: "Tandiwe Zulu", slug: "zm", flag: zmIcon, location: "Kasama, Zambia", url: video3 },
  { name: "Sara Ali", slug: "zw", flag: zwIcon, location: "Harare, Zimbabwe", url: video3 },
  { name: "Nyasha Dube", slug: "zw", flag: zwIcon, location: "Bulawayo, Zimbabwe", url: video3 },
  { name: "Tariro Moyo", slug: "zw", flag: zwIcon, location: "Mutare, Zimbabwe", url: video3 },
  { name: "Zara Khan", slug: "zw", flag: zwIcon, location: "Cape Town, South Africa", url: video3 },
  { name: "Chiedza Chirwa", slug: "zw", flag: zwIcon, location: "Harare, Zimbabwe", url: video3 },
  { name: "Rudo Makoni", slug: "zw", flag: zwIcon, location: "Gweru, Zimbabwe", url: video3 },
  { name: "Olivia Brown", slug: "au", flag: auIcon, location: "Sydney, Australia", url: video3 },
  { name: "Mia Johnson", slug: "au", flag: auIcon, location: "Melbourne, Australia", url: video3 },
  { name: "Liam Wilson", slug: "au", flag:auIcon, location: "Perth, Australia", url: video3 },
  { name: "Isla Davis", slug: "au", flag: auIcon, location: "Brisbane, Australia", url: video3 },
  { name: "Noah Taylor", slug: "au", flag: auIcon, location: "Adelaide, Australia", url: video3 },
  { name: "Sophie Miller", slug: "au", flag: auIcon, location: "Canberra, Australia", url: video3 },
  { name: "Emily Carter", slug: "ca", flag: caIcon, location: "Toronto, Canada", url: video3 },
  { name: "Ethan White", slug: "ca", flag: caIcon, location: "Vancouver, Canada", url: video3 },
  { name: "Ava Robinson", slug: "ca", flag: caIcon, location: "Montreal, Canada", url: video3 },
  { name: "Lucas Martin", slug: "ca", flag: caIcon, location: "Calgary, Canada", url: video3 },
  { name: "Charlotte Green", slug: "ca", flag: caIcon, location: "Ottawa, Canada", url: video3 },
  { name: "Henry Scott", slug: "ca", flag: caIcon, location: "Edmonton, Canada", url: video3 },
  { name: "Ava Johnson", slug: "us", flag: usIcon, location: "New York, USA", url: video3 },
  { name: "Ethan Parker", slug: "us", flag: usIcon, location: "Los Angeles, USA", url: video3 },
  { name: "Sophia Lewis", slug: "us", flag: usIcon, location: "Chicago, USA", url: video3 },
  { name: "Noah Anderson", slug: "us", flag: usIcon, location: "San Francisco, USA", url: video3 },
  { name: "Isabella Moore", slug: "us", flag: usIcon, location: "Houston, USA", url: video3 },
  { name: "Liam Thompson", slug: "us", flag: usIcon, location: "Miami, USA", url: video3 },
];

export const fetchReels = async () => {
  try {
    await fetch("/api/reels");
    return new Promise((resolve) => {
      setTimeout(() => resolve(MARQUEE_REELS), 1000);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to fetch reels");
  }
};

export const filterReelsBySlug = (slug) =>
  mockReels.filter((reel) => reel.slug === slug);
