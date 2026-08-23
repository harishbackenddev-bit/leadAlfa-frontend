import React, { useState } from 'react';
import SettingsHeader from './components/SettingsHeader';
import PaymentSettingsContent from './components/PaymentSettingsContent';
import SecurityAccessContent from './components/SecurityAccessContent';
import NotificationsContent from './components/NotificationsContent';
import AvailabilityContent from './components/AvailabilityContent';
import LegalComplianceContent from './components/LegalComplianceContent';

export default function Settings() {
  const [activeMainTab, setActiveMainTab] = useState('Payment Settings');

  const renderContent = () => {
    switch (activeMainTab) {
      case 'Payment Settings':
        return <PaymentSettingsContent />;
      case 'Security & Access':
        return <SecurityAccessContent />;
      case 'Notifications':
        return <NotificationsContent />;
      case 'Availability':
        return <AvailabilityContent />;
      case 'Legal & Compliance':
        return <LegalComplianceContent />;
      default:
        return <PaymentSettingsContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Section: Settings Header with Main Tabs */}
        <SettingsHeader 
          activeTab={activeMainTab} 
          onTabChange={setActiveMainTab} 
        />

        {/* Gray gap between sections */}
        <div className="h-6"></div>

        {/* Bottom Section: Content based on active tab */}
        {renderContent()}
      </div>
    </div>
  );
}
