import { useSearchParams } from "react-router-dom";
import { creatorProvinces } from "../../../utils/location";

const ALL_PROVINCE = "all";

const provinces = [
  { label: "All", value: ALL_PROVINCE },
  ...creatorProvinces,
];

export default function ProvinceSelector({ action }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProvince = searchParams.get("province") || ALL_PROVINCE;

  const handleSelect = (value) => {
    localStorage.setItem("province", value);
    setSearchParams({ province: value }, { replace: true });
    action?.(value);
  };

  return (
    <div className="flex flex-col justify-center gap-4 p-4 mt-5">
      <span className="font-medium">I'm based in:</span>

      <div className="grid grid-cols-2 content-center gap-2 md:flex-wrap md:w-[50vw] md:flex md:flex-row">
        {provinces.map((province, index) => (
          <button
            key={province.value}
            onClick={() => handleSelect(province.value)}
            className={`flex items-center justify-center min-w-[140px] px-3 py-1.5 rounded-full border text-gray-900 font-medium transition-colors
        ${
          selectedProvince === province.value
            ? "border-2 border-blue-600 bg-blue-50 text-black"
            : "border-gray-300 hover:bg-blue-100"
        } ${
              provinces.length % 2 === 1 && index === provinces.length - 1
                ? "col-span-2 justify-self-center w-fit"
                : ""
            }`}
          >
            <span className="text-center w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] md:text-sm">
              {province.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
