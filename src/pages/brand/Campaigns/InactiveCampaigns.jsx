import React from 'react';
import { getInactiveCampaigns } from './mockCampaigns';
import CampaignsTable from './components/CampaignsTable';

const InactiveCampaigns = () => {
  const campaigns = getInactiveCampaigns();

  return (
    <CampaignsTable campaigns={campaigns} itemsPerPage={9} />
  );
};

export default InactiveCampaigns;
