"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useClients from '@/modules/main/hooks/use-clients';
import { useTranslation } from 'react-i18next';

export const ClientsCard = () => {
    const { clients, isLoading, error } = useClients();
    const { t } = useTranslation();
    if (isLoading) {
        return <Card className="@container/card">
            <CardHeader>
                <CardDescription>{t('overview.loading_clients')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    0
                </CardTitle>
            </CardContent>
        </Card>;
    }
    if (error) {
        return <Card className="@container/card">
            <CardHeader>
                <CardDescription>{t('overview.error_loading_clients')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    0
                </CardTitle>
            </CardContent>
        </Card>;
    }
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>
                    {t('overview.clients')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {clients?.data?.length ?? 0}
                </CardTitle>
            </CardContent>
        </Card>
    );
};