"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useEmployees from '@/modules/main/hooks/use-employees';
import { useTranslation } from 'react-i18next';

export const EmployeesCard = () => {
  const { employees, isLoading, error } = useEmployees();
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t('overview.loading_employees')}</CardDescription>
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
          <CardDescription>{t('overview.error_loading_employees')}</CardDescription>
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
        <CardDescription>
          {t('overview.employees')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {employees?.data?.length ?? 0}
        </CardTitle>
      </CardContent>

    </Card>
  );
};