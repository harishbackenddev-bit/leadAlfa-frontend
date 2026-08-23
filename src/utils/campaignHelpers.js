// Campaign data transformation utilities

export function calculateDaysLeft(createdAt) {
  // Simple calculation - you can modify this based on your business logic
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - diffDays).toString().padStart(2, '0'); // Assume 30 days campaign
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

export function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCountryName(countryCode) {
  const countryMap = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'AU': 'Australia',
    'ZA': 'South Africa',
    'IN': 'India',
    'DE': 'Germany',
    'FR': 'France'
  };
  return countryMap[countryCode] || countryCode;
}

export function prepareMoodboards(media, defaultImages = []) {
  const moodboards = [];
  
  // Add product images
  if (media?.productImages?.length > 0) {
    media.productImages.forEach((img, index) => {
      moodboards.push({
        image: img.url,
        title: img.name || `Product Image ${index + 1}`,
        category: 'Product • Campaign'
      });
    });
  }
  
  // Add moodboard if exists
  if (media?.moodboards) {
    moodboards.push({
      image: media.moodboards.url,
      title: media.moodboards.name || 'Campaign Moodboard',
      category: 'Inspiration • Campaign'
    });
  }
  
  // Fallback to default images if no media
  if (moodboards.length === 0 && defaultImages.length > 0) {
    return defaultImages.map((img, index) => ({
      image: img,
      title: `Campaign Visual ${index + 1}`,
      category: 'Campaign • Creative'
    }));
  }
  
  return moodboards;
}

export function prepareCampaignParagraphs(campaign) {
  const sections = [
    {
      title: "Content We'd Love From You",
      content: campaign.campaignBrief || "No brief provided"
    }
  ];
  
  // Add additional brief if exists
  if (campaign.additionalBrief) {
    sections.push({
      title: 'Additional Requirements',
      content: campaign.additionalBrief
    });
  }
  
  // Add campaign rules
  if (campaign.campaignRules) {
    const rules = campaign.campaignRules.split(/\r?\n/).filter(rule => rule.trim());
    sections.push({
      title: 'Campaign Rules',
      list: rules.length > 0 ? rules : ['Follow all campaign guidelines']
    });
  }
  
  // Add campaign specs
  const specs = [];
  if (campaign.socialMediaType) {
    specs.push(`Platform: ${capitalizeFirst(campaign.socialMediaType)}`);
  }
  if (campaign.videoLength) {
    specs.push(`Video Length: ${campaign.videoLength} seconds`);
  }
  if (campaign.videoAspectRatio) {
    specs.push(`Aspect Ratio: ${campaign.videoAspectRatio}`);
  }
  
  if (specs.length > 0) {
    sections.push({
      title: 'Technical Specifications',
      list: specs
    });
  }
  
  // Add brand activity (placeholder - you can enhance this with real data)
  sections.push({
    title: 'Brand Activity',
    note: 'Brand was last active recently'
  });
  
  return sections;
}

export function transformCampaignForDetails(campaign, defaultBrandLogo = null) {
  return {
    id: campaign.id,
    title: campaign.campaignTitle,
    budget: `$${parseFloat(campaign.budgetValue).toLocaleString()}`,
    daysLeft: calculateDaysLeft(campaign.createdAt),
    brandName: campaign.brand?.companyName || 'Unknown Brand',
    brandLogo: defaultBrandLogo, // Use provided default or campaign.brand?.logo if available
    isVerified: campaign.brand?.isVerified || false,
    description: campaign.campaignBrief,
    website: campaign.brand?.website || '',
    city: campaign.brand?.city || '',
    country: getCountryName(campaign.countryPreferences?.[0]) || campaign.brand?.country || '',
    campaignStartDate: formatDate(campaign.createdAt),
    creatorsNeeded: campaign.creatorsNeeded?.toString() || '0',
    status: campaign.status === 'active' ? 'Active' : capitalizeFirst(campaign.status),
    deliverable: capitalizeFirst(campaign.deliverables),
    applicants: campaign.countryPreferences?.length > 0 ? 
      campaign.countryPreferences.map(code => getCountryName(code)).join(', ') : 'Global'
  };
}