
"use client";

import React, { useEffect, useState } from 'react';
import EnhancedUpdateService from '@/modules/services/enhanced-update-service';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  if (!params.id) {
    return <div>Error: Service ID is required</div>;
  }

  return (
    <div className="min-h-screen">
      <EnhancedUpdateService serviceId={params.id} />
    </div>
  );
};

export default Page;
