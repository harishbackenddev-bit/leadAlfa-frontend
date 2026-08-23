import { Link } from "react-router-dom";


export default function HoverLinkArrow({ title,
    titleLink, }) {
    return (
        <Link
            to={titleLink}
            className="
        text-[12px] text-[#6A6A70]
        py-2
        flex items-center gap-2
        group transition-all duration-300 ease-in-out
      "
        >
            <span className="group-hover:text-[#1e60db] transition-colors duration-300">
                {title}
            </span>

            <svg
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 transition-all duration-300 ease-in-out"
            >
                <rect
                    x="0.279785"
                    width="40"
                    height="40"
                    rx="20"
                    className="
            fill-[#ebebeb]
            transition-all duration-300 ease-in-out
            group-hover:fill-[#1e60db]
          "
                />
                <path
                    d="M16.1573 23.1248L24.4068 14.8752M24.4068 14.8752H16.1573M24.4068 14.8752V23.1248"
                    stroke="#6A6A70"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="
            origin-center
            transition-transform transition-colors duration-300 ease-in-out
            group-hover:rotate-45 group-hover:stroke-[#ffffff]
          "
                />
            </svg>
        </Link>
    )
}

