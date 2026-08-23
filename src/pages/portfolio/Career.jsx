import ActionButton from "../../components/common/ActionButton";
import img1 from "../../assets/images/portfolio/career/img1.png";
import img2 from "../../assets/images/portfolio/career/img2.png";
import img3 from "../../assets/images/portfolio/career/img3.png";
import img4 from "../../assets/images/portfolio/career/img4.png";
import img5 from "../../assets/images/portfolio/career/img5.png";
import img6 from "../../assets/images/portfolio/career/img6.png";

const CheckIcon = ({ width = 30, height = 30 }) => (
  <svg
    width={width}
    height={height}
    className="flex-shrink-0"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1201_965)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 25C0 19.287 1.475 15.726 4.1005 13.1005C6.726 10.475 10.287 9 14 9C17.713 9 21.274 10.475 23.8995 13.1005C26.525 15.726 28 19.287 28 25C28 28.713 26.525 32.274 23.8995 34.8995C21.274 37.525 17.713 39 14 39C10.287 39 6.726 37.525 4.1005 34.8995C1.475 32.274 0 28.713 0 25ZM13.2011 29.992L21.2613 19.9157L19.8053 18.7509L12.9323 27.3395L8.064 23.2832L6.86933 24.7168L13.2011 29.992Z"
        fill="#0c7bb3"
      />
    </g>
    <defs>
      <clipPath id="clip0_1201_965">
        <rect width="50" height="50" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function Career() {
  const points = [
    "You will create strategies and methods to penetrate the market and effectively reach the target audiences.",
    "You will work using a hybrid approach, both online and offline, to build a community.",
    "You will establish retention techniques by conducting interviews, aiming to gather user feedback.",
    "You will be attending all weekly meetings online to debrief your work.",
    "You will be attending all weekly meetings online to debrief your work.",
  ];

  let Box = () => (
    <div className="flex gap-4 flex-col md:flex-row!">
      <div className="md:h-[5vh]" />
      <div className="text-[#6F6E77] self-start text-[0.8rem] font-semibold">
        01
      </div>
      <div className="md:flex! justify-between gap-4 w-full">
        <div className="flex flex-col gap-2 w-full ">
          <h3 className="text-[0.7rem] md:text-[1.2rem]! font-semibold">
            Digital Marketing Specialist
          </h3>
          <span className="text-[#9F9F9F] text-[0.6rem] md:text-[0.8rem]! space-x-6 space-y-3 ">
            Location{" "}
            <strong className="font-semibold text-[#111111] ml-2">
              REMOTE
            </strong>{" "}
            Experience{" "}
            <strong className="font-semibold text-[#111111] ml-2">
              4-5 Years
            </strong>
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 shrink-0 mt-4 md:mt-0!">
          <ActionButton label="Apply Now" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:h-[10vh]" />
      <section className="text-center w-[65vw] mx-auto flex flex-col items-center my-8">
        <h2 className="text-lg md:text-[1.9rem]! font-medium mb-4 text-[#232825]">
          We Are Seeking Individuals Who Are Willing to Challenge Prevailing
          Norms and Are Eager to{" "}
          <span className="font-semibold">
            Participate in a Remarkable Experience.{" "}
            <span className="text-[#0c7bb3] font-semibold">Join us.</span>
          </span>
        </h2>
        <p className="text-[#444A46] text-[10.2px] leading-6 mb-4">
          At Creatrend, we’re excited to continually seek out talented
          individuals from around the world! While we operate entirely remotely,
          our commitment to delivering exceptional results remains strong. We
          celebrate diversity, believing that varied perspectives ignite
          creativity and drive innovation. No matter who you are or where you
          come from, there’s a place for you here!
        </p>

        <ActionButton label="View Job Openings" />
      </section>

      <section className="my-8 w-[85vw] mx-auto">
        <img src={img1} alt="Career Opportunities" className="w-full h-auto" />
      </section>
      <section className="text-center w-[65vw] mx-auto my-8">
        <h2 className="text-lg md:text-[1.9rem]! font-medium mb-4 text-[#232825]">
          Culture of shared values and practices
        </h2>
        <p className="text-[#444A46] text-[12px] leading-6 mb-4">
          Creatrend is a vibrant and growing team of creative professionals,
          all about supporting creators and businesses across the world with
          genuine and impactful User-Generated Content.
        </p>
      </section>
      <section className="my-8 hidden md:flex! justify-between">
        <img
          src={img2}
          alt=""
          className="rounded-tr-lg object-cover w-40 h-70 mt-auto"
        />
        <img
          src={img3}
          alt=""
          className="rounded-t-lg object-cover w-75 h-80"
        />
        <img
          src={img4}
          alt=""
          className="rounded-t-lg object-cover w-75 h-70 mt-auto"
        />
        <img
          src={img5}
          alt=""
          className="rounded-t-lg object-cover w-75 h-80"
        />
        <img
          src={img6}
          alt=""
          className="rounded-tl-lg object-cover w-40 h-80"
        />
      </section>

      <section className="px-auto  py-10 bg-primary">
        <div className="w-[65vw] mx-auto">
          <h2 className="text-[13px] md:text-[1.9rem]! font-medium mb-4 text-[#232825] text-center">
            We're hiring!
          </h2>
          <hr className="border-t border-[#A8A8A8] w-[65vw] my-4" />

          <Box />

          <div className="my-6 space-y-6">
            <p className="text-[9.7px] text-[#6F6E77]">
              Creatrend is an exciting user-generated content platform that
              bridges brands with talented UGC creators. Our diverse team, made
              up of passionate individuals from over a dozen countries, is eager
              to collaborate with others keen on joining a startup journey.
              We're looking for a committed participant who can engage weekly
              and contribute to our vibrant community!
            </p>
            <p className="text-[9.7px] text-[#6F6E77]">
              As a Digital Marketing Specialist, you'll take the exciting lead
              in building and expanding Creatrend’s vibrant community. Your
              creativity and strategy will play a pivotal role in connecting
              with individuals, fostering relationships, and driving engagement
              like never before!
            </p>
          </div>

          <div>
            <h4 className="mb-2 ">Your mission</h4>
            <ul className="text-gray-700 text-[12px] ">
              {points?.length > 0 &&
                points.map((point, i) => (
                  <li key={i} className="flex items-center ">
                    <CheckIcon />
                    <span>{point}</span>
                  </li>
                ))}
            </ul>
          </div>
          <hr className="border-t border-[#A8A8A8] w-[65vw] my-4" />
          <Box />

          <hr className="border-t border-[#A8A8A8] w-[65vw] my-4" />
        </div>
      </section>
    </>
  );
}
