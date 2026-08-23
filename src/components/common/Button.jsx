import React from "react";
import clsx from "clsx";

const Button = ({ variant = "primary", children, ...props }) => {
  const baseStyles =
    "px-6 py-4  rounded-full font-medium text-sm transition-all duration-300";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-blue-600 text-[#0c7bb3] hover:bg-blue-50",
    black: "bg-black text-white hover:bg-gray-800",
  };

  return (
    <button className={clsx(baseStyles, variants[variant])} {...props}>
      {children}
    </button>
  );
};

export default Button;
