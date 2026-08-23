import React from 'react';
import { CategoriesIcon, SelectCategoryIcon, AddSkillIcon, AccountCreationIcon, ChooseRoleIcon, BasicInformationIcon, PaymentInformationIcon } from '../../../assets/SVGs/portfolio/main/signUp_icons';

export default function Stepper({ currentStep, role }) {
  if (currentStep < 2) return null;

  const getSteps = (role) => {
    const baseSteps = [
      {
        id: 1,
        title: 'Account Creation',
        icon:  <AccountCreationIcon/>
      },
      {
        id: 2,
        title: 'Choose Your Role',
        icon: <ChooseRoleIcon/>
         
      },
      {
        id: 3,
        title: 'Add Basic Information',
        icon:<BasicInformationIcon/>
      },
    ];

    if (role === 'creator') {
      return [
        ...baseSteps,
        {
          id: 4,
          title: 'Select Categories',
          icon: <SelectCategoryIcon/>
        },
        {
          id: 5,
          title: 'Add Skills',
          icon: <AddSkillIcon/>
        }
      ];
    } else if (role === 'brand') {
      return [
        ...baseSteps,
        {
          id: 4,
          title: 'Payment Information',
          icon: <PaymentInformationIcon/>
        }
      ];
    } else {
      return baseSteps;
    }
  };

  const steps = getSteps(role);

  return (
    <div className="w-full">     
      {/* Desktop View - Full Stepper */}
      <div className="hidden md:block">
        <div className="mb-8">
          <h3 className="text-base font-semibold text-[#5B576F]">
            Complete your profile in <span className="text-[#041C4A]">{steps.length} easy steps</span>
          </h3>
        </div>     
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div className={currentStep === index + 1
                  ? "shadow-lg border-[1px] rounded-full p-1 border-dashed border-blue-300"
                  : "p-1"}>
                  <div
                    className={`w-[3.175rem] h-[3.175rem] rounded-full flex items-center justify-center transition-all ${currentStep > index + 1
                        ? "bg-[#DBE8FF] text-white"
                        : currentStep === index + 1
                          ? "bg-[#DBE8FF] text-white shadow-lg"
                          : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {step.icon}
                  </div>
                </div>
                <p
                  className={`mt-3 text-sm text-center font-medium max-w-[100px] ${currentStep >= index + 1 ? "text-gray-900" : "text-gray-500"
                    }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-8">
                  {currentStep === index + 1 ? (
                    <div className="flex h-[3px] w-full">
                      <div className="w-[35%] h-full bg-gradient-to-r from-[#1E60DBF2] to-[#E0EBFF]"></div>
                      <div className="w-[65%] h-full bg-gray-200"></div>
                    </div>
                  ) : (
                    <div
                      className={`h-[3px] transition-all ${currentStep > index + 1 ? "bg-gradient-to-r from-[#1E60DBF2] to-[#E0EBFF]" : "bg-gray-200"
                        }`}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile View - Circular Progress */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Next - {steps[currentStep]?.title || 'Review and Done'}
            </p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="4"
              />
              {/* Progress Circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray={`${(currentStep / steps.length) * 175.93} 175.93`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            {/* Step Text */}
            <div className="relative text-center">
              <span className="text-sm font-semibold text-gray-700">{currentStep} of {steps.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}