import React from "react";
import { ArrowRight, Building2, UsersRound } from "lucide-react";

const roles = [
  {
    id: "creator",
    title: "I am a Creator",
    description:
      "Join Creatrend to collaborate with brands, get paid for UGC, and grow your personal brand.",
    Icon: UsersRound,
    cta: "Continue as Creator",
  },
  {
    id: "brand",
    title: "I am a Brand",
    description:
      "Launch campaigns, collaborate with verified creators, and scale your marketing.",
    Icon: Building2,
    cta: "Continue as Brand",
  },
];

const RoleSelectionStep = ({ selectedRole, onNext, loading, error }) => {
  const handleContinue = (roleId) => {
    if (!roleId) return;
    if (typeof onNext === "function") onNext(roleId);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Create Your Account
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-3 max-w-xl mx-auto">
          Choose your account type to get started
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {roles.map((role) => {
          const { Icon } = role;
          const isSelected = selectedRole === role.id;
          return (
            <div
              key={role.id}
              className={`flex flex-col items-stretch text-left p-6 md:p-8 rounded-2xl border bg-white transition-shadow ${
                isSelected
                  ? "border-blue-300 shadow-md"
                  : "border-gray-200/90 shadow-sm"
              }`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl btn-gradient">
                <Icon className="h-8 w-8 text-white" strokeWidth={2} aria-hidden />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {role.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {role.description}
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleContinue(role.id)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl btn-gradient px-5 py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              >
                <span>
                  {loading
                    ? "Please wait..."
                    : role.cta}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.25} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelectionStep;
