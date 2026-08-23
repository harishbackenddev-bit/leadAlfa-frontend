import React, { useState } from 'react';
import laptopIcon from '../../../assets/SVGs/settings/laptop.svg';
import phoneIcon from '../../../assets/SVGs/settings/phone.svg';
import deleteIcon from '../../../assets/SVGs/settings/delete.svg';
import AccountActions from '../../creator/MyProfile/components/AccountActions';

export default function SecurityAccessContent() {
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);
  
  const [devices, setDevices] = useState([
    { id: 1, type: 'desktop', name: 'PC1234D', lastActive: null, isCurrent: true },
    { id: 2, type: 'mobile', name: 'ios - 15 pro', lastActive: '1 hr ago', isCurrent: false },
    { id: 3, type: 'mobile', name: 'ios - 13', lastActive: '1 month ago', isCurrent: false },
    { id: 4, type: 'desktop', name: 'PC1234D', lastActive: '2 months ago', isCurrent: false },
  ]);

  const handleEditPassword = () => {
    console.log('Edit password clicked');
  };

  const handleToggleTwoStep = () => {
    setTwoStepEnabled(!twoStepEnabled);
  };

  const handleRemoveDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  return (
    <>
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Section Header */}
      <h2 className="text-xl sm:text-2xl font-extrabold font-anton text-gray-900 mb-2">
        Security & Access
      </h2>
      {/* <p className="text-xs sm:text-sm text-gray-400 mb-2 mt-4 leading-relaxed">
        Brands create an account by submitting essential company details, after which their profile undergoes admin review. Upon approval, they gain full access to the platform's dashboard and campaign tools.
      </p> */}

      {/* Password Section */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Password</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Set a password to protect your account</p>
          </div>
          <div className="flex-1 text-left sm:text-center sm:mt-7">
            <span className="text-lg sm:text-xl text-gray-800">**********</span>
          </div>
          <div className="flex-1 flex justify-start sm:justify-end">
            <button
              onClick={handleEditPassword}
              className="px-6 sm:px-8 py-2 sm:py-2.5 bg-[#1E60DB] text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Two-Step Verification Section */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Two-step-verification</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xs">
              We recommend requiring a verification code in addition to your password
            </p>
          </div>
          <button
            onClick={handleToggleTwoStep}
            className={`relative w-15 h-5 rounded-full transition-colors mr-2 ${
              twoStepEnabled ? 'bg-[#DEE9FF]' : ' bg-[#1E60DB]'
            }`}
          >
            <span
              className={`absolute top-0 w-5 h-5 rounded-full transition-all duration-300 ${
                twoStepEnabled ? 'left-0 bg-[#1E60DB]' : 'left-10 bg-[#DEE9FF]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Browsers & Devices Section */}
      <div className="pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Browsers & Devices</h3>
        {/* <p className="text-xs sm:text-sm text-gray-400 mt-1 mb-4">
          These devices are used to login tou your account. Remove any unauthorised device.
        </p> */}

        <div className="divide-y divide-gray-100">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center py-4 sm:py-6">
              {/* Device Icon - Fixed width at start */}
              <div className="w-10 sm:w-16 flex-shrink-0">
                <img 
                  src={device.type === 'desktop' ? laptopIcon : phoneIcon} 
                  alt={device.type === 'desktop' ? 'Laptop' : 'Phone'} 
                  className="w-8 h-6 sm:w-14 sm:h-10"
                />
              </div>
              
              {/* Device Name - 33% position */}
              <div className="flex-1 text-center">
                <span className="text-xs sm:text-sm text-gray-400">{device.name}</span>
              </div>
              
              {/* Session Status - 66% position */}
              <div className="flex-1 text-center">
                <span className="text-xs sm:text-sm text-gray-400">
                  {device.isCurrent ? (
                    <span className="flex flex-col items-center">
                      <span>Current</span>
                      <span>Session</span>
                    </span>
                  ) : (
                    device.lastActive
                  )}
                </span>
              </div>
              
              {/* Delete Icon - 100% position */}
              <div className="w-10 sm:w-16 flex-shrink-0 flex justify-end">
                <button
                  onClick={() => handleRemoveDevice(device.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <img src={deleteIcon} alt="Delete" className="w-5 h-5 sm:w-7 sm:h-7" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        
    </div>
      <div className='mt-6'>
      <AccountActions />
      </div>
      </>
  );
}
