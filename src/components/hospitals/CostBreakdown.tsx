
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Brain, Utensils, Stethoscope, HeartHandshake, Hospital } from 'lucide-react';

const subscriptionTiers = [
    { value: 1499, label: '₹1,499 / month' },
    { value: 1999, label: '₹1,999 / month' },
    { value: 2499, label: '₹2,499 / month' },
    { value: 2999, label: '₹2,999 / month' },
];

const specialistCosts = {
    nutritionist: { name: 'Nutritionist', percentage: 0.30, max: 400, color: '#3b82f6', icon: Utensils },
    therapist: { name: 'Mind Therapist', percentage: 0.20, max: 300, color: '#8b5cf6', icon: Brain },
    emergency: { name: 'Emergency Staff', percentage: 0.35, max: 500, color: '#ef4444', icon: Stethoscope },
    concierge: { name: 'Nurse Concierge', percentage: 0.20, max: 349, color: '#f97316', icon: HeartHandshake },
};

const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export function CostBreakdown() {
    const [selectedTier, setSelectedTier] = useState(subscriptionTiers[2].value);

    const breakdownData = useMemo(() => {
        let remaining = selectedTier;

        const calculatedCosts = Object.entries(specialistCosts).map(([key, cost]) => {
            const calculatedValue = Math.min(selectedTier * cost.percentage, cost.max);
            remaining -= calculatedValue;
            return {
                name: cost.name,
                value: calculatedValue,
                color: cost.color,
                icon: cost.icon,
            };
        });

        calculatedCosts.push({
            name: "Hospital's Share",
            value: Math.max(0, remaining),
            color: '#10b981',
            icon: Hospital,
        });

        return calculatedCosts;
    }, [selectedTier]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 bg-background border rounded-lg shadow-lg">
                    <p className="font-bold">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="shadow-2xl">
            <CardHeader className="text-center p-8">
                <CardTitle className="text-3xl font-bold font-headline">Explore the Partnership: A Transparent Cost Breakdown</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                    Select a subscription plan to see how the revenue is allocated. We invest in the specialist team on your behalf.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="max-w-xs mx-auto">
                    <Select onValueChange={(val) => setSelectedTier(Number(val))} defaultValue={String(selectedTier)}>
                        <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select a parent subscription tier" />
                        </SelectTrigger>
                        <SelectContent>
                            {subscriptionTiers.map(tier => (
                                <SelectItem key={tier.value} value={String(tier.value)}>{tier.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={breakdownData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={70}
                                >
                                    {breakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        {breakdownData.map((item, index) => (
                             <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}1A` }}>
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-6 w-6" style={{ color: item.color }} />
                                    <span className="font-semibold" style={{ color: item.color }}>{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold" style={{ color: item.color }}>{formatCurrency(item.value)}</span>
                                    <p className="text-xs" style={{ color: `${item.color}B3` }}>
                                        ({((item.value / selectedTier) * 100).toFixed(0)}%)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
