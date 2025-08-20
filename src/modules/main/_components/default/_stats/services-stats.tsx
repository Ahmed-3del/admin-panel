"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useServices from '@/modules/main/hooks/use-services';
import { useTranslation } from 'react-i18next';

export const ServicesCard = () => {
  const { services, isLoading, error } = useServices();
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('overview.loading_services')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('overview.error_loading_services')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
        </CardContent>
      </Card>
    );
  }
  console.log("useServices data:", services);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          {t('overview.services')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {services?.data?.services.length ?? 0}
        </CardTitle>
      </CardContent>

    </Card>
  );
};