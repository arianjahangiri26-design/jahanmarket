

 
"use clint"

import CreateBannerAdsLogic from '@/components/admin/BannerAds/create/CreateBannerAdsLogic';
import FormProvider from '@/context/form/FormProvider';
import React from 'react'

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