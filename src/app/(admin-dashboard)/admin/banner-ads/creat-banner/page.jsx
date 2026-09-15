
"use client"; // ✅ درست

import CreateBannerAdsLogic from '@/components/admin/BannerAds/create/CreateBannerAdsLogic';
 
import React from 'react'
import { FormProvider } from 'react-hook-form';
 
const CreateBannerAdsPage = () => {
    return (
        <div>
  <FormProvider  >
            <CreateBannerAdsLogic />
</FormProvider>
        </div>
    );
};

export default CreateBannerAdsPage;