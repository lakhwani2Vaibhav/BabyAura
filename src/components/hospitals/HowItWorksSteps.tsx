
"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { ScrollAnimationWrapper } from "../layout/ScrollAnimationWrapper";

const steps = [
    {
        step: "1",
        title: "Express Interest",
        description: "Fill out our simple partnership form to begin the conversation. No commitment required."
    },
    {
        step: "2",
        title: "Onboard Your Team",
        description: "Our plug-and-play platform makes it easy to set up your hospital and onboard your doctors in minutes."
    },
    {
        step: "3",
        title: "Engage Your Patients",
        description: "Start offering BabyAura to new parents, providing them unparalleled support from the moment they leave."
    }
];

export function HowItWorksSteps() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });

    // Smoother spring animation for the progress line
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div ref={ref} className="relative">
            {/* Desktop and Tablet view (Horizontal with connecting line) */}
            <div className="hidden md:block">
                <motion.div
                    style={{ scaleX }}
                    className="absolute top-8 left-0 w-full h-1 bg-border origin-left"
                />
                <div className="relative grid grid-cols-3 gap-8">
                    {steps.map((item, index) => (
                        <div key={item.step} className="text-center relative">
                            <motion.div
                                className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary/20"
                                style={{
                                    scale: scrollYProgress,
                                    opacity: scrollYProgress
                                }}
                            />
                            <ScrollAnimationWrapper
                                key={item.title}
                                animationClasses={`animate-in fade-in zoom-in-95 duration-700 ease-out delay-${100 + (index * 200)}`}
                            >
                                <div className="relative z-10">
                                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-muted/40 mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground px-2">{item.description}</p>
                                </div>
                            </ScrollAnimationWrapper>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile view (Vertical timeline) */}
            <div className="md:hidden relative pl-8">
                <div className="absolute left-8 top-0 h-full w-1 bg-border -translate-x-1/2" />
                <div className="space-y-12">
                    {steps.map((item, index) => (
                        <ScrollAnimationWrapper
                            key={item.title}
                            animationClasses={`animate-in fade-in slide-in-from-left-8 duration-700 ease-out delay-${100 + (index * 100)}`}
                        >
                            <div className="relative">
                                <div className="absolute -left-0 top-0 h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-muted/40 -translate-x-1/2">
                                    {item.step}
                                </div>
                                <div className="ml-12 pl-4">
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        </ScrollAnimationWrapper>
                    ))}
                </div>
            </div>
        </div>
    );
}
