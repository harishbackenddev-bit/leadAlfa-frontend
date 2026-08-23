import { useSearchParams } from "react-router-dom";
import { AU, CA, GM, US, ZA, ZM, ZW } from "../../../assets/SVGs/portfolio/main/Flags";

const countries = [
    { name: "United Kingdom", slug: "gb", flag: GM },
    { name: "South Africa", slug: "za", flag: ZA },
    { name: "Zambia", slug: "zm", flag: ZM },
    { name: "Zimbabwe", slug: "zw", flag: ZW },
    { name: "Australia", slug: "au", flag: AU },
    { name: "United States", slug: "us", flag: US },
    { name: "Canada", slug: "ca", flag: CA },
];

export default function CountrySelector2({action}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCountry = searchParams.get("country");

    const handleSelect = (slug) => {
        localStorage.setItem("country", slug);
        
        setSearchParams({country: slug},{replace: true});
        action(slug)
    };

    return (
        <div className="flex flex-col  justify-center  gap-4 p-4 mt-5">
            <span className="font-medium">I'm based in:</span>

            <div className="grid grid-cols-2 content-center gap-2 md:flex-wrap md:w-[50vw] md:flex md:flex-row">
                {countries.map((country, index) => (
                    <button
                        key={country.slug}
                        onClick={() => handleSelect(country.slug)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-gray-900 font-medium transition-colors
        ${selectedCountry === country.slug
                                ? "border-2 border-blue-600 bg-blue-50 text-black"
                                : "border-gray-300 hover:bg-gray-100 min-w-[140px]"
                            } ${(countries.length % 2 === 1 && index === countries.length - 1) ? "col-span-2 justify-self-center w-fit" : ""}}`}
                    >

                        <country.flag className="w-[30px] h-[23px] rounded-full overflow-hidden" preserveAspectRatio="xMidYMid slice" />

                        <span className="text-left w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] md:text-sm">
                            {country.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
