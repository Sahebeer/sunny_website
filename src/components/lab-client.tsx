"use client";

import dynamic from "next/dynamic";

const ThreePortfolio = dynamic(() => import("@/components/three-portfolio").then((module) => module.ThreePortfolio), { ssr: false });

export function LabClient() {
  return <ThreePortfolio />;
}
