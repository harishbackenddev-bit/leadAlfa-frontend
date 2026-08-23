import React from 'react';
import { getClosedCampaigns } from './mockCampaigns';
import CampaignsTable from './components/CampaignsTable';

const ClosedCampaigns = () => {
  const campaigns = getClosedCampaigns();

  return (
    <CampaignsTable campaigns={campaigns} itemsPerPage={9} />
  );
};

export default ClosedCampaigns;
