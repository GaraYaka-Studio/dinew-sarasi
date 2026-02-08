'use client';

import { Card } from '@/components/ui/card';
import { getSummaryCards, type ReportType } from '@/lib/mock-data-reports';

interface ReportsSummaryCardsProps {
    reportType: ReportType;
}

export function ReportsSummaryCards({ reportType }: ReportsSummaryCardsProps) {
    const cards = getSummaryCards(reportType);

    return (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <Card
                    key={card.label}
                    className={`border p-4 shadow-sm ${card.className}`}
                >
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                            {card.label}
                        </p>
                        <p className="text-2xl font-semibold">{card.value}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
