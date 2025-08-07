
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Brain, Utensils, Stethoscope, HeartHandshake, Hospital, Aperture, BadgeCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

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

type SpecialistKey = keyof typeof specialistCosts;

const platformFeeCost = {
    name: 'Platform Fee',
    percentage: 0.10,
    color: '#71717a',
    icon: Aperture
};

const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

const PlatformFeeCard = ({ isWaived }: { isWaived: boolean }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-between p-3 rounded-lg ${isWaived ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}
        >
            <div className="flex items-center gap-3">
                {isWaived ? 
                    <BadgeCheck className="h-6 w-6 text-green-600" /> :
                    <Aperture className="h-6 w-6 text-yellow-600" />
                }
                <div className="flex-col">
                    <span className={`font-semibold ${isWaived ? 'text-green-700' : 'text-yellow-700'}`}>
                        {isWaived ? "Platform Fee Waived!" : "10% Platform Fee"}
                    </span>
                     <p className={`text-xs ${isWaived ? 'text-green-600' : 'text-yellow-600'}`}>
                       {isWaived ? "You've selected 2 or more services." : "Select 2+ services to waive this fee."}
                    </p>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
);


export function CostBreakdown() {
    const [selectedTier, setSelectedTier] = useState(subscriptionTiers[2].value);
    const [enabledServices, setEnabledServices] = useState<Record<SpecialistKey, boolean>>({
        nutritionist: true,
        therapist: true,
        emergency: true,
        concierge: true,
    });

    const handleToggleService = (service: SpecialistKey) => {
        setEnabledServices(prev => ({ ...prev, [service]: !prev[service] }));
    };

    const breakdownData = useMemo(() => {
        let remaining = selectedTier;
        const calculatedCosts = [];
        const enabledServicesCount = Object.values(enabledServices).filter(Boolean).length;
        let platformFee = 0;

        if (enabledServicesCount <= 1) {
            platformFee = selectedTier * platformFeeCost.percentage;
            remaining -= platformFee;
            calculatedCosts.push({
                name: platformFeeCost.name,
                value: platformFee,
                color: platformFeeCost.color,
                icon: platformFeeCost.icon,
            });
        }

        for (const key in specialistCosts) {
            const specialistKey = key as SpecialistKey;
            if (enabledServices[specialistKey]) {
                const cost = specialistCosts[specialistKey];
                const calculatedValue = Math.min(selectedTier * cost.percentage, cost.max);
                remaining -= calculatedValue;
                calculatedCosts.push({
                    name: cost.name,
                    value: calculatedValue,
                    color: cost.color,
                    icon: cost.icon,
                });
            }
        }
        
        calculatedCosts.push({
            name: "Hospital's Share",
            value: Math.max(0, remaining),
            color: '#10b981',
            icon: Hospital,
        });

        return calculatedCosts;
    }, [selectedTier, enabledServices]);

    const enabledServicesCount = Object.values(enabledServices).filter(Boolean).length;
    const isPlatformFeeWaived = enabledServicesCount > 1;

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
                    Select a subscription plan and toggle services to build a personalized package for your parents.
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
                        {(Object.keys(specialistCosts) as SpecialistKey[]).map((key) => {
                            const item = specialistCosts[key];
                            const isEnabled = enabledServices[key];
                            const calculatedValue = isEnabled ? Math.min(selectedTier * item.percentage, item.max) : 0;
                            
                            return (
                                <div key={key} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}1A`, opacity: isEnabled ? 1 : 0.6 }}>
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-6 w-6" style={{ color: item.color }} />
                                        <span className="font-semibold" style={{ color: item.color }}>{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="font-bold" style={{ color: item.color }}>{formatCurrency(calculatedValue)}</span>
                                            {isEnabled && (
                                                <p className="text-xs" style={{ color: `${item.color}B3` }}>
                                                    ({((calculatedValue / selectedTier) * 100).toFixed(0)}%)
                                                </p>
                                            )}
                                        </div>
                                        <Switch
                                            id={`switch-${key}`}
                                            checked={isEnabled}
                                            onCheckedChange={() => handleToggleService(key)}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                         <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `#10b9811A` }}>
                            <div className="flex items-center gap-3">
                                <Hospital className="h-6 w-6" style={{ color: '#10b981' }} />
                                <span className="font-semibold" style={{ color: '#10b981' }}>Hospital's Share</span>
                            </div>
                            <div className="text-right">
                                <span className="font-bold" style={{ color: '#10b981' }}>{formatCurrency(breakdownData.find(d => d.name === "Hospital's Share")?.value || 0)}</span>
                                <p className="text-xs" style={{ color: `#10b981B3` }}>
                                    ({(((breakdownData.find(d => d.name === "Hospital's Share")?.value || 0) / selectedTier) * 100).toFixed(0)}%)
                                </p>
                            </div>
                        </div>
                         <PlatformFeeCard isWaived={isPlatformFeeWaived} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
