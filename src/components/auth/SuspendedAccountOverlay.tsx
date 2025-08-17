
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ShieldAlert, LifeBuoy, Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";

const suspensionReasons = [
    "Pending KYC verification.",
    "Violation of platform policies.",
    "Unresolved payment or billing issues.",
    "Reported misconduct or malpractice.",
    "Failure to meet service level agreements.",
    "Security concerns related to your account.",
    "Repeated parent complaints.",
    "Incomplete or outdated credentials.",
    "Non-compliance with regulatory requirements.",
    "Scheduled platform maintenance or review.",
];

export function SuspendedAccountOverlay() {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="max-w-2xl w-full mx-4 shadow-2xl border-destructive">
                <CardHeader className="text-center items-center">
                    <div className="p-3 bg-destructive/10 rounded-full w-fit mb-2">
                        <ShieldAlert className="w-10 h-10 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Account Suspended</CardTitle>
                    <CardDescription className="text-base">
                        Your access to the dashboard is temporarily restricted.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground">
                        Your account has been placed on hold by the BabyAura platform administrators. This could be for one of several reasons, including but not limited to:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground list-disc list-inside">
                        {suspensionReasons.map(reason => <li key={reason}>{reason}</li>)}
                    </ul>
                </CardContent>
                <CardFooter className="flex-col gap-4 bg-muted/50 p-6">
                    <h3 className="font-semibold">How to Resolve This?</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        To resolve this and reactivate your account, please contact our administrative team for further details and assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild>
                            <a href="mailto:babyauraindia@gmail.com">
                               <Mail className="mr-2 h-4 w-4" /> Email Support
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <a href="tel:+919876543210">
                               <Phone className="mr-2 h-4 w-4" /> Call Support
                            </a>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
