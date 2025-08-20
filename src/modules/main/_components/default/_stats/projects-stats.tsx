"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGetProjects from '@/modules/main/hooks/use-get-projects';
import { useTranslation } from 'react-i18next';

export const ProjectsCard = () => {
  const { projects, error, isLoading } = useGetProjects();
  const { t } = useTranslation(); // Uncomment if translation is needed
  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('overview.loading_projects')}</CardDescription>
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
          <CardDescription>{t('overview.error_loading_projects')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{t('overview.projects')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {projects?.portfolioItems?.length ?? 0}
        </CardTitle>
      </CardContent>
    </Card>
  );
};