const countryHeading = 
    {
        0: {
            hero:[
                "Stop relying on expensive studio shoots. Creatrend connects Mzansi’s best brands with vetted local creators to produce high-converting",
                "User Generated Content (UGC) for TikTok, Instagram Reels, and Facebook Ads."
            ],              
        },
        ZM: {
            hero:[
                "Creatrend connects Zambian businesses and a vibrant community of authentic UserGenerated Content (UGC) creators. Whether you’re running an e-commerce website orlooking to create captivating viral short videos for platforms like TikTok, Facebook, Instagram, X, and YouTube, our talented creators are poised to craft innovative videos that not only engage but also drive tangible sales.",
                "Get your videos curated in a language of your choice. Whether you're looking for Nyanja, Bemba, or simply English content, we have a pool of creators across Zambia ready to deliver high-quality, authentic UGC videos for your brand in local languages",
            ],
        },
        US: {
            hero:[
                "Creatrend connects US businesses and a vibrant community of authentic User-GeneratedContent (UGC) creators. Whether you’re running an Amazon storefront, e-commerce website or looking to create captivating viral short videos for platforms like TikTok, Facebook,Instagram, X, and YouTube, our talented creators are poised to craft innovative videos that not only engage but also drive tangible sales.",
                "Get your videos curated by local creators across the US. We have a pool of creators acrossthe United States ready to deliver high-quality, authentic UGC videos for your brand."
            ],
        },
        ZA: {
            hero:[
                "Creatrend connects South African businesses and a vibrant community of authentic UserGenerated Content (UGC) creators. Whether you’re managing an online storefront on Amazon or Takealot, curating your own e-commerce website, or looking to create captivating viral short videos for platforms like TikTok, Facebook, Instagram, X, and YouTube, our talented creators are poised to craft innovative videos that not only engage but also drive tangible sales.",
                "Get your videos curated in a language of your choice. Whether you're looking for Zulu, Afrikaans, or simply English content, we have a pool of creators across South Africa ready to deliver high-quality, authentic UGC videos for your brand in local languages.",
               ],
        },
        CA: {
            hero:[
                "Creatrend connects Canadian businesses and a vibrant community of authentic UserGenerated Content (UGC) creators. Whether you’re running an Amazon storefront, ecommerce website or looking to create captivating viral short videos for platforms like TikTok, Facebook, Instagram, X, and YouTube, our talented creators are poised to craft innovative videos that not only engage but also drive tangible sales.",
                "Get your videos curated by local creators across Canada. We have a pool of creators across Canada ready to deliver high-quality, authentic UGC videos for your brand."
                ],              
        },
        AU: {
            hero:[
                "Creatrend connects Australian businesses and a vibrant community of authentic UserGenerated Content (UGC) creators. Whether you’re running an Amazon storefront, ecommerce website or looking to create captivating viral short videos for platforms like TikTok, Facebook, Instagram, X, and YouTube, our talented creators are poised to craft innovative videos that not only engage but also drive tangible sales.",
                "Get your videos curated by local creators across Australia. We have a pool of creators across Australia ready to deliver high-quality, authentic UGC videos for your brand."
                ],   
        },
        
    }



export const getHeroText = (c)=> {
   //if country exist in countryHeading then return hero text else return default hero text 
   const country = c.toUpperCase().trim();
   let heroText = [];
   if(countryHeading[country]) {
    heroText = countryHeading[country]?.hero;
   } else {    
    heroText = countryHeading["0"]?.hero;
   }
   return heroText;
}