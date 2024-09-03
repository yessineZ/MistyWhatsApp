"use client";

import { useTheme } from "next-themes";
import LeftPanel from "@/components/home/left-panel";
import RightPanel from "@/components/home/right-panel";
export default function Home() {
	 return (
    <div className="m-2 phone:m-0">
      <div className="flex h-screen max-w-[1700px] bg-left-panel flex-col overflow-y-hidden phone:flex-col pc1:flex-row pc2:flex-row">
        {/* Green background decorator for Light Mode */}
        <div className="fixed top-0 left-0 z-[-30] w-full h-36 bg-green-primary dark:bg-transparent" />
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}