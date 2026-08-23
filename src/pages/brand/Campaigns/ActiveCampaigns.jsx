import React from 'react';
import { getActiveCampaigns } from './mockCampaigns';
import CampaignsTable from './components/CampaignsTable';

const ActiveCampaigns = () => {
  const campaigns = getActiveCampaigns();

  return (
    <CampaignsTable campaigns={campaigns} itemsPerPage={9} />
  );
};

export default ActiveCampaigns;
